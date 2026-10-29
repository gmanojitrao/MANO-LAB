"""
OmniScribe - Advanced Audio Preprocessor
Handles format normalization, quality analysis, intelligent denoising, and silence-aware chunking.
"""

import os
import subprocess
import tempfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional, Tuple

from config import (
    FFMPEG_PATH,
    FFPROBE_PATH,
    Config,
    ALL_SUPPORTED_EXTENSIONS
)

import numpy as np
import scipy.signal
import soundfile as sf
import noisereduce as nr
from pydub import AudioSegment
from pydub.silence import detect_silence


@dataclass
class ChunkInfo:
    index: int
    start_ms: int
    end_ms: int
    start_formatted: str
    end_formatted: str
    duration_seconds: float
    file_path: Path


@dataclass
class AudioAnalysisReport:
    original_path: Path
    normalized_path: Path
    duration_seconds: float
    duration_formatted: str
    sample_rate: int
    channels: int
    rms_dbfs: float
    noise_floor_dbfs: float
    is_noisy: bool
    denoised_applied: bool
    denoise_mode: str
    chunks: List[ChunkInfo] = field(default_factory=list)
    has_multiple_chunks: bool = False


class AudioProcessor:
    """Robust audio engine for converting, denoising, and chunking audio files."""

    def __init__(self, target_sr: int = Config.TARGET_SAMPLE_RATE):
        self.target_sr = target_sr
        self.ffmpeg_path = FFMPEG_PATH
        self.ffprobe_path = FFPROBE_PATH

    @staticmethod
    def format_timestamp(ms: int) -> str:
        """Converts milliseconds into HH:MM:SS.mmm format."""
        total_seconds = ms / 1000.0
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        seconds = total_seconds % 60
        return f"{hours:02d}:{minutes:02d}:{seconds:06.3f}"

    @staticmethod
    def format_duration(seconds: float) -> str:
        """Converts seconds into human-readable duration."""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        if hours > 0:
            return f"{hours}h {minutes}m {secs}s"
        elif minutes > 0:
            return f"{minutes}m {secs}s"
        else:
            return f"{secs:.1f}s"

    def normalize_to_wav(self, input_file: Path, output_file: Path) -> Path:
        """
        Converts any audio/video container to 16kHz mono 16-bit PCM WAV.
        Guarantees format compliance for all speech AI models.
        """
        output_file.parent.mkdir(parents=True, exist_ok=True)
        cmd = [
            self.ffmpeg_path,
            "-y",  # Overwrite output
            "-i", str(input_file),
            "-vn",  # Discard video streams if container is video
            "-acodec", "pcm_s16le",
            "-ar", str(self.target_sr),
            "-ac", "1",  # Mono
            str(output_file)
        ]
        
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        if proc.returncode != 0:
            raise RuntimeError(f"FFmpeg conversion failed for {input_file.name}: {proc.stderr}")
        return output_file

    def analyze_audio_quality(self, wav_path: Path) -> Tuple[float, float, bool]:
        """
        Computes RMS volume level, noise floor estimate, and determines if audio is noisy.
        Returns: (rms_dbfs, noise_floor_dbfs, is_noisy)
        """
        data, sr = sf.read(str(wav_path))
        if len(data) == 0:
            return -100.0, -100.0, False

        # Calculate RMS
        rms = np.sqrt(np.mean(data**2) + 1e-12)
        rms_dbfs = 20 * np.log10(rms) if rms > 0 else -100.0

        # Frame-based noise floor estimation (100ms frames)
        frame_size = int(sr * 0.1)
        if len(data) >= frame_size * 2:
            num_frames = len(data) // frame_size
            trimmed_data = data[:num_frames * frame_size].reshape((num_frames, frame_size))
            frame_rms = np.sqrt(np.mean(trimmed_data**2, axis=1) + 1e-12)
            # Noise floor estimated from bottom 15th percentile of frames
            noise_floor_rms = np.percentile(frame_rms, 15)
            noise_floor_dbfs = 20 * np.log10(noise_floor_rms) if noise_floor_rms > 0 else -100.0
        else:
            noise_floor_dbfs = rms_dbfs - 20.0

        snr = rms_dbfs - noise_floor_dbfs
        # Audio is considered noisy if SNR is poor (< 15 dB) or noise floor is high (> -38 dBFS)
        is_noisy = (snr < 16.0) or (noise_floor_dbfs > -38.0 and rms_dbfs > -30.0)

        return float(rms_dbfs), float(noise_floor_dbfs), bool(is_noisy)

    def denoise_audio(
        self,
        input_wav: Path,
        output_wav: Path,
        mode: str = "auto",
        force: bool = False
    ) -> Tuple[Path, bool]:
        """
        Applies intelligent spectral gating, voice bandpass filtering,
        and loudness normalization.
        """
        if mode == "none" and not force:
            return input_wav, False

        rms_dbfs, noise_floor_dbfs, is_noisy = self.analyze_audio_quality(input_wav)

        should_denoise = force or (mode in ["mild", "aggressive"]) or (mode == "auto" and is_noisy)
        if not should_denoise and mode == "auto":
            return input_wav, False

        data, sr = sf.read(str(input_wav))
        if len(data) == 0:
            return input_wav, False

        # 1. Bandpass filter: Voice speech spectrum is 80Hz - 7600Hz
        # Butterworth 4th order bandpass
        try:
            nyq = 0.5 * sr
            low = 80.0 / nyq
            high = min(7600.0 / nyq, 0.99)
            b, a = scipy.signal.butter(4, [low, high], btype='band')
            filtered_data = scipy.signal.filtfilt(b, a, data)
        except Exception:
            filtered_data = data

        # 2. Spectral noise reduction
        prop_decrease = 0.65 if mode == "mild" else (0.88 if mode == "aggressive" else 0.75)
        try:
            cleaned_data = nr.reduce_noise(
                y=filtered_data,
                sr=sr,
                stationary=True,
                prop_decrease=prop_decrease,
                n_fft=1024,
                win_length=1024,
                hop_length=512
            )
        except Exception:
            cleaned_data = filtered_data

        # 3. Peak Normalization: bring speech up to -1.0 dBFS to prevent quiet audio issues
        peak = np.max(np.abs(cleaned_data)) + 1e-12
        target_peak = 0.89  # approx -1.0 dBFS
        if peak > 0:
            gain = min(target_peak / peak, 5.0)  # Max gain factor of 5x
            cleaned_data = cleaned_data * gain

        # Clip bounds to avoid distortion
        cleaned_data = np.clip(cleaned_data, -1.0, 1.0)

        # Write output WAV
        sf.write(str(output_wav), cleaned_data, sr, subtype='PCM_16')
        return output_wav, True

    def split_audio_intelligently(
        self,
        wav_path: Path,
        output_chunks_dir: Path,
        max_chunk_duration_sec: float = 600.0  # 10 minutes
    ) -> List[ChunkInfo]:
        """
        Splits audio at natural speech pauses / silence boundaries
        so that sentences and words are never severed mid-speech.
        """
        output_chunks_dir.mkdir(parents=True, exist_ok=True)
        audio = AudioSegment.from_file(str(wav_path))
        total_duration_ms = len(audio)
        max_chunk_ms = int(max_chunk_duration_sec * 1000)

        # If audio is within chunk limit, no split needed
        if total_duration_ms <= max_chunk_ms * 1.05:  # 5% grace window
            chunk_file = output_chunks_dir / f"chunk_01_full.wav"
            audio.export(str(chunk_file), format="wav")
            return [
                ChunkInfo(
                    index=1,
                    start_ms=0,
                    end_ms=total_duration_ms,
                    start_formatted=self.format_timestamp(0),
                    end_formatted=self.format_timestamp(total_duration_ms),
                    duration_seconds=total_duration_ms / 1000.0,
                    file_path=chunk_file
                )
            ]

        # Scan for silences throughout the audio
        # Using silence threshold relative to audio loudness
        silence_thresh = max(audio.dBFS - 14, -45.0)
        silences = detect_silence(
            audio,
            min_silence_len=Config.MIN_SILENCE_LEN_MS,
            silence_thresh=silence_thresh
        )

        chunks_info: List[ChunkInfo] = []
        current_start_ms = 0
        chunk_idx = 1

        while current_start_ms < total_duration_ms:
            target_end_ms = current_start_ms + max_chunk_ms
            if target_end_ms >= total_duration_ms:
                # Last remaining chunk
                chunk_end_ms = total_duration_ms
            else:
                # Look for optimal silence boundary around target
                # Ensure search window is strictly after current_start_ms
                window_lookback = min(30000, int(max_chunk_ms * 0.3))
                search_min = max(current_start_ms + int(max_chunk_ms * 0.4), target_end_ms - window_lookback)
                search_max = min(target_end_ms + 15000, total_duration_ms)
                
                best_split = None
                for s_start, s_end in silences:
                    s_mid = (s_start + s_end) // 2
                    if search_min <= s_mid <= search_max:
                        best_split = s_mid
                        break

                if best_split is not None and best_split > current_start_ms + 1000:
                    chunk_end_ms = best_split
                else:
                    chunk_end_ms = min(target_end_ms, total_duration_ms)

            # Safety guarantee: chunk must be at least 1 second or reach end
            if chunk_end_ms <= current_start_ms:
                chunk_end_ms = min(current_start_ms + max_chunk_ms, total_duration_ms)

            # Slice and export
            chunk_segment = audio[current_start_ms:chunk_end_ms]
            start_str = self.format_timestamp(current_start_ms).replace(":", "-").replace(".", "_")
            end_str = self.format_timestamp(chunk_end_ms).replace(":", "-").replace(".", "_")
            chunk_filename = f"chunk_{chunk_idx:02d}_{start_str}_to_{end_str}.wav"
            chunk_path = output_chunks_dir / chunk_filename
            chunk_segment.export(str(chunk_path), format="wav")

            chunks_info.append(
                ChunkInfo(
                    index=chunk_idx,
                    start_ms=current_start_ms,
                    end_ms=chunk_end_ms,
                    start_formatted=self.format_timestamp(current_start_ms),
                    end_formatted=self.format_timestamp(chunk_end_ms),
                    duration_seconds=(chunk_end_ms - current_start_ms) / 1000.0,
                    file_path=chunk_path
                )
            )

            # Move to next chunk
            current_start_ms = chunk_end_ms
            chunk_idx += 1

        return chunks_info

    def process_audio(
        self,
        input_file: Path,
        output_dir: Path,
        denoise_mode: str = "auto",
        chunk_duration_minutes: float = 45.0
    ) -> AudioAnalysisReport:
        """
        Complete end-to-end preprocessing pipeline:
        1. Normalizes input container to 16kHz WAV.
        2. Analyzes acoustic properties and SNR.
        3. Applies denoising (if auto/mild/aggressive).
        4. Splits into silence-aligned chunks if duration exceeds limit.
        """
        output_dir.mkdir(parents=True, exist_ok=True)
        base_name = input_file.stem

        # Step 1: Normalize format
        raw_wav = output_dir / f"{base_name}_normalized.wav"
        if not raw_wav.exists() or raw_wav.stat().st_size == 0:
            self.normalize_to_wav(input_file, raw_wav)

        # Step 2: Analyze quality
        rms_dbfs, noise_floor_dbfs, is_noisy = self.analyze_audio_quality(raw_wav)
        
        # Duration info
        data, sr = sf.read(str(raw_wav))
        duration_sec = len(data) / float(sr) if sr > 0 else 0.0

        # Step 3: Denoise
        denoised_wav = output_dir / f"{base_name}_cleaned.wav"
        if denoised_wav.exists() and denoised_wav.stat().st_size > 0:
            processed_wav = denoised_wav
            denoised_applied = True
        else:
            processed_wav, denoised_applied = self.denoise_audio(
                raw_wav,
                denoised_wav,
                mode=denoise_mode
            )

        final_working_wav = processed_wav if denoised_applied else raw_wav

        # Step 4: Chunking
        max_chunk_sec = chunk_duration_minutes * 60.0
        chunks_dir = output_dir / f"{base_name}_chunks"
        chunks = self.split_audio_intelligently(
            final_working_wav,
            chunks_dir,
            max_chunk_duration_sec=max_chunk_sec
        )

        return AudioAnalysisReport(
            original_path=input_file,
            normalized_path=final_working_wav,
            duration_seconds=duration_sec,
            duration_formatted=self.format_duration(duration_sec),
            sample_rate=self.target_sr,
            channels=1,
            rms_dbfs=round(rms_dbfs, 2),
            noise_floor_dbfs=round(noise_floor_dbfs, 2),
            is_noisy=is_noisy,
            denoised_applied=denoised_applied,
            denoise_mode=denoise_mode,
            chunks=chunks,
            has_multiple_chunks=(len(chunks) > 1)
        )
