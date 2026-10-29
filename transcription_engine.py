"""
OmniScribe - Multi-Engine Audio Transcription System
Supports Google Gemini (Audio Ingest), Groq Whisper Large v3, OpenAI Whisper,
and Local Whisper Fallback with 3 distinct transcription output types:
1. Native Script (Hindi Devanagari, Bengali, Tamil, etc.)
2. English Translation (Contextual, accurate English)
3. Romanized Script (Hinglish, Banglish, Colloquial Latin script)
"""

import base64
import json
import os
import re
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import requests

from audio_processor import AudioAnalysisReport, ChunkInfo
from config import Config


@dataclass
class TranscriptionSegment:
    start: float
    end: float
    native: str
    english: str
    romanized: str

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class TranscriptionResult:
    filename: str
    duration_seconds: float
    duration_formatted: str
    language_detected: str
    confidence: float
    native_text: str
    english_text: str
    romanized_text: str = ""
    artisan_name: str = ""
    section_name: str = ""
    segments: List[TranscriptionSegment] = field(default_factory=list)
    chunks_info: List[dict] = field(default_factory=list)
    engine_used: str = "gemini"
    denoised: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict:
        d = asdict(self)
        d["segments"] = [s.to_dict() if hasattr(s, "to_dict") else s for s in self.segments]
        return d

    @classmethod
    def from_dict(cls, d: dict) -> 'TranscriptionResult':
        segs = [TranscriptionSegment(**s) if isinstance(s, dict) else s for s in d.get("segments", [])]
        return cls(
            filename=d.get("filename", ""),
            duration_seconds=float(d.get("duration_seconds", 0.0)),
            duration_formatted=d.get("duration_formatted", ""),
            language_detected=d.get("language_detected", ""),
            confidence=float(d.get("confidence", 0.95)),
            native_text=d.get("native_text", ""),
            english_text=d.get("english_text", ""),
            romanized_text=d.get("romanized_text", ""),
            artisan_name=d.get("artisan_name", ""),
            section_name=d.get("section_name", ""),
            segments=segs,
            chunks_info=d.get("chunks_info", []),
            engine_used=d.get("engine_used", "gemini"),
            denoised=bool(d.get("denoised", False)),
            metadata=d.get("metadata", {})
        )


class BaseEngine:
    """Base interface for all transcription engines."""

    def transcribe_chunk(
        self,
        audio_path: Path,
        start_offset_sec: float = 0.0,
        artisan_hint: Optional[str] = None,
        section_hint: Optional[str] = None
    ) -> Tuple[str, str, str, str, float, List[TranscriptionSegment], str, str]:
        """
        Transcribes a single audio chunk.
        Returns: (detected_lang, native_text, english_text, romanized_text, confidence, segments)
        """
        raise NotImplementedError


class GeminiAudioEngine(BaseEngine):
    """
    Direct Audio Ingestion via Google Gemini 2.5 Flash / 2.0 Flash.
    Provides extraordinary multi-lingual, Indic language, Hinglish, and Banglish accuracy.
    """

    def __init__(self, api_key: Optional[str] = None, model: str = Config.DEFAULT_GEMINI_MODEL):
        self.api_key = api_key or Config.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.model = model
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    def is_available(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    def _extract_json_from_response(self, text: str) -> dict:
        """Robustly extracts JSON from raw model response even if wrapped in markdown."""
        text = text.strip()
        # Remove markdown code blocks if present
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        # Try direct parse
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        # Match first { to last }
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass

        # Salvage fields from truncated or unclosed JSON
        salvaged = {}
        for key in ["detected_language", "confirmed_artisan_name", "confirmed_section"]:
            m = re.search(rf'"{key}"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', text)
            if m:
                salvaged[key] = m.group(1).replace(r'\"', '"').replace(r'\n', '\n').strip()

        # Extract native_transcript via regex
        m_nat = re.search(r'"native_transcript"\s*:\s*"(.*?)(?:"\s*,\s*"[a-zA-Z_]+"|"\s*\}|$)', text, re.DOTALL)
        if m_nat:
            salvaged["native_transcript"] = m_nat.group(1).replace(r'\"', '"').replace(r'\n', '\n').strip()

        # Extract english_transcript via regex
        m_eng = re.search(r'"english_transcript"\s*:\s*"(.*?)(?:"\s*,\s*"[a-zA-Z_]+"|"\s*\}|$)', text, re.DOTALL)
        if m_eng:
            salvaged["english_transcript"] = m_eng.group(1).replace(r'\"', '"').replace(r'\n', '\n').strip()

        if salvaged.get("native_transcript"):
            salvaged.setdefault("detected_language", "Detected Audio")
            salvaged.setdefault("confidence", 0.95)
            salvaged.setdefault("english_transcript", "")
            salvaged.setdefault("romanized_transcript", "")
            salvaged.setdefault("segments", [])
            return salvaged

        # Fallback dictionary if JSON parsing failed completely
        return {
            "detected_language": "Detected Audio",
            "confidence": 0.90,
            "native_transcript": text,
            "english_transcript": "",
            "romanized_transcript": text,
            "segments": []
        }

    def transcribe_chunk(
        self,
        audio_path: Path,
        start_offset_sec: float = 0.0,
        artisan_hint: Optional[str] = None,
        section_hint: Optional[str] = None
    ) -> Tuple[str, str, str, str, float, List[TranscriptionSegment], str, str]:
        if not self.is_available():
            raise ValueError("Gemini API key is missing. Please provide a GEMINI_API_KEY.")

        # Ensure audio payload is compact (< 10MB) for reliable transmission
        send_path = audio_path
        mime_type = "audio/wav"
        
        # If WAV or large, convert to clean 64kbps MP3
        if audio_path.stat().st_size > 8 * 1024 * 1024 or audio_path.suffix.lower() == ".wav":
            from config import FFMPEG_PATH
            import subprocess
            compressed_mp3 = audio_path.with_name(f"{audio_path.stem}_gemini_opt.mp3")
            try:
                cmd = [FFMPEG_PATH, "-y", "-i", str(audio_path), "-codec:a", "libmp3lame", "-b:a", "64k", str(compressed_mp3)]
                subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
                if compressed_mp3.exists() and compressed_mp3.stat().st_size > 0:
                    send_path = compressed_mp3
                    mime_type = "audio/mp3"
            except Exception:
                send_path = audio_path
                mime_type = "audio/wav" if audio_path.suffix.lower() == ".wav" else "audio/mp3"
        elif audio_path.suffix.lower() in [".mp3", ".m4a", ".aac", ".ogg"]:
            mime_type = f"audio/{audio_path.suffix.lower().replace('.', '')}"

        with open(send_path, "rb") as f:
            audio_bytes = f.read()

        b64_audio = base64.b64encode(audio_bytes).decode("utf-8")

        prompt = f"""You are an elite, world-class ethnographic field-interview transcriptionist.
Analyze this interview audio recording carefully.
There are two primary speakers:
1. Interviewer: The researcher conducting the interview, asking questions, prompting for explanations.
2. Artisan / Interviewee: The master craftsman, artist, or person being interviewed{f" (Candidate/expected name: '{artisan_hint}')" if artisan_hint else ""}.

CRITICAL INSTRUCTIONS:
1. SPEAKER DIARIZATION (NO TIMESTAMPS):
   - You MUST label EVERY single conversational turn clearly.
   - Use "Interviewer:" for the person asking questions.
   - Use the Artisan's verified name (e.g. "Deepak Prajapati:" or "{artisan_hint or 'Artisan'}:") for the artisan answering questions.
   - If a second artisan or another person speaks, label them clearly (e.g. "Reena Prajapati:" or "Artisan 2:").
   - Example dialogue turn format:
     Interviewer: Aap apna naam bataye?
     Deepak Prajapati: Mera naam Deepak Prajapati hai.
     Interviewer: Yeh kariagari ki history aapke parivar se judi hai?
     Deepak Prajapati: Yeh jo art hai yeh lagbhag 600 varsh purv...

2. EXACTLY TWO OUTPUT TRANSCRIPTS REQUIRED (NO TIMESTAMPS):
   - "native_transcript": Complete verbatim dialogue in the authentic spoken native script (Devanagari for Hindi, Bengali script বাংলা লিপি for Bengali, Tamil தமிழ், etc.). Every turn MUST begin with "Interviewer: " or "<Artisan Name>: ". Do NOT transcribe in English or Romanized letters (e.g. do not write 'Ami bhalo achi' - write 'আমি ভালো আছি'). Use genuine native script. Do NOT include timestamps or timecodes.
   - "english_transcript": Flawless, genuine, pure raw English translation of the exact same spoken dialogue, with identical matching speaker turns ("Interviewer: ..." and "<Artisan Name>: ..."). Do NOT summarize, omit, or add editorial commentary.

3. DETECTED ENTITIES:
   - "confirmed_artisan_name": The verified full name of the artisan / interviewee (e.g. '{artisan_hint or 'Deepak Prajapati'}').
   - "confirmed_section": The interview section if identifiable from speech or context (e.g. '{section_hint or 'Section A'}').
   - "detected_language": Primary spoken language (e.g. 'Hindi', 'Bengali', etc.).
   - "confidence": 0.98

Output STRICTLY a JSON object with EXACTLY these keys:
{{
  "confirmed_artisan_name": "{artisan_hint or 'Artisan'}",
  "confirmed_section": "{section_hint or 'Section'}",
  "detected_language": "Hindi",
  "confidence": 0.98,
  "native_transcript": "Interviewer: ...\\n\\n<Artisan Name>: ...",
  "english_transcript": "Interviewer: ...\\n\\n<Artisan Name>: ..."
}}
Output only the valid JSON without any other conversational commentary."""

        fallback_models = [
            "gemini-3.5-flash-lite",
            "gemini-3.5-flash",
            "gemini-3.8-flash",
            "gemini-flash-latest"
        ]
        
        # Ensure current model is first
        if self.model in fallback_models:
            fallback_models.remove(self.model)
        fallback_models.insert(0, self.model)

        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": b64_audio
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 8192,
                "response_mime_type": "application/json"
            },
            "safetySettings": [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_CIVIC_INTEGRITY", "threshold": "BLOCK_NONE"}
            ]
        }

        last_error = None
        for current_model in fallback_models:
            url = f"{self.base_url}/{current_model}:generateContent?key={self.api_key}"
            for attempt in range(3):
                try:
                    resp = requests.post(url, headers=headers, json=payload, timeout=(15, 75))
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if not candidates:
                            raise RuntimeError(f"No response generated by Gemini: {data}")
                        raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        parsed = self._extract_json_from_response(raw_text)

                        detected_lang = parsed.get("detected_language", "Unknown")
                        confidence = float(parsed.get("confidence", 0.95))
                        native_text = parsed.get("native_transcript", "").strip()
                        english_text = parsed.get("english_transcript", "").strip()
                        romanized_text = parsed.get("romanized_transcript", "").strip()

                        segments: List[TranscriptionSegment] = []
                        raw_segs = parsed.get("segments", [])
                        if isinstance(raw_segs, list):
                            for seg in raw_segs:
                                if isinstance(seg, dict):
                                    s_start = float(seg.get("start", 0.0)) + start_offset_sec
                                    s_end = float(seg.get("end", 0.0)) + start_offset_sec
                                    segments.append(
                                        TranscriptionSegment(
                                            start=round(s_start, 2),
                                            end=round(s_end, 2),
                                            native=str(seg.get("native", "")).strip(),
                                            english=str(seg.get("english", "")).strip(),
                                            romanized=str(seg.get("romanized", "")).strip()
                                        )
                                    )

                        confirmed_artisan = parsed.get("confirmed_artisan_name", "").strip() or (artisan_hint or "")
                        confirmed_section = parsed.get("confirmed_section", "").strip() or (section_hint or "")

                        # If audio was processed but no text was returned at all, retry
                        if not native_text and not english_text:
                            last_error = f"Model {current_model} returned empty transcript"
                            time.sleep(2)
                            continue

                        # AUTOMATIC TRANSLATION RECOVERY:
                        # Guarantee that English is never missing or truncated when Native text is present
                        if native_text and (not english_text or len(english_text) < 0.25 * len(native_text)):
                            print(f"[OmniScribe] Chunk translation recovery triggered for '{confirmed_artisan}' (Native len: {len(native_text)})")
                            english_text = self.translate_dialogue_to_english(native_text, confirmed_artisan or "Artisan")

                        # Clean up temp mp3 if created
                        if send_path != audio_path and send_path.exists():
                            try:
                                send_path.unlink()
                            except Exception:
                                pass

                        return detected_lang, native_text, english_text, romanized_text, confidence, segments, confirmed_artisan, confirmed_section

                    elif resp.status_code in (429, 500, 502, 503, 504):
                        backoff = 3 * (attempt + 1)
                        last_error = f"Gemini API status {resp.status_code}: {resp.text}"
                        time.sleep(backoff)
                    elif resp.status_code == 404:
                        last_error = f"Model {current_model} not found: {resp.text}"
                        break  # Try next model
                    else:
                        last_error = f"Gemini API returned status {resp.status_code}: {resp.text}"
                        time.sleep(2)
                except Exception as e:
                    last_error = str(e)
                    time.sleep(2 * (attempt + 1))

        # Clean up temp mp3 if created
        if send_path != audio_path and send_path.exists():
            try:
                send_path.unlink()
            except Exception:
                pass

        raise RuntimeError(f"Gemini transcription failed across available models: {last_error}")

    def translate_dialogue_to_english(self, text: str, artisan_name: str = "Artisan") -> str:
        """
        Translates dialogue turns into pure, genuine English verbatim.
        Handles long transcripts safely by batching turns to prevent output token starvation.
        """
        if not text or not text.strip():
            return ""

        # Normalize turns
        raw_turns = [t.strip() for t in text.split("\n\n") if t.strip()]
        if not raw_turns:
            raw_turns = [text.strip()]

        # Group turns into manageable blocks (< 10,000 chars per block)
        blocks: List[str] = []
        cur_block: List[str] = []
        cur_len = 0
        for turn in raw_turns:
            if cur_len + len(turn) > 10000 and cur_block:
                blocks.append("\n\n".join(cur_block))
                cur_block = [turn]
                cur_len = len(turn)
            else:
                cur_block.append(turn)
                cur_len += len(turn)
        if cur_block:
            blocks.append("\n\n".join(cur_block))

        translated_blocks: List[str] = []
        for blk in blocks:
            res_blk = self._call_text_translation(blk, artisan_name)
            if res_blk:
                translated_blocks.append(res_blk)
            else:
                translated_blocks.append(blk)

        return "\n\n".join(translated_blocks).strip()

    def _call_text_translation(self, text_block: str, artisan_name: str) -> str:
        """Invokes Gemini fast text model to translate interview dialogue verbatim."""
        prompt = f"""You are an elite, world-class verbatim ethnographic interview translator.
Translate the following interview dialogue turns into pure, genuine English verbatim without additions, omissions, or editorial commentary.
Keep identical matching speaker labels (e.g. "Interviewer: ...", "{artisan_name}: ...").
Do NOT include timestamps.
Translate every single turn completely and accurately.

ORIGINAL DIALOGUE:
{text_block}

OUTPUT ONLY THE TRANSLATED DIALOGUE WITHOUT ANY PREAMBLE OR COMMENTARY."""

        fallback_models = [
            "gemini-3.5-flash-lite",
            "gemini-3.5-flash",
            "gemini-3.8-flash"
        ]
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 8192
            },
            "safetySettings": [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_CIVIC_INTEGRITY", "threshold": "BLOCK_NONE"}
            ]
        }

        for model in fallback_models:
            url = f"{self.base_url}/{model}:generateContent?key={self.api_key}"
            for attempt in range(2):
                try:
                    resp = requests.post(url, headers=headers, json=payload, timeout=(10, 45))
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            trans = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                            if trans:
                                return trans
                    elif resp.status_code in (429, 500, 502, 503, 504):
                        time.sleep(2 * (attempt + 1))
                except Exception:
                    time.sleep(2)
        return ""


class GroqWhisperEngine(BaseEngine):
    """
    Ultra-fast transcription via Groq Whisper-large-v3,
    followed by Groq Llama 3.3 70B post-processing for Native, English, and Romanized formats.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or Config.GROQ_API_KEY or os.environ.get("GROQ_API_KEY", "")

    def is_available(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    def transcribe_chunk(
        self,
        audio_path: Path,
        start_offset_sec: float = 0.0,
        artisan_hint: Optional[str] = None,
        section_hint: Optional[str] = None
    ) -> Tuple[str, str, str, str, float, List[TranscriptionSegment], str, str]:
        if not self.is_available():
            raise ValueError("Groq API key is missing. Please provide a GROQ_API_KEY.")

        # Step 1: Transcribe with Whisper Large v3
        whisper_url = "https://api.groq.com/openai/v1/audio/transcriptions"
        headers = {"Authorization": f"Bearer {self.api_key}"}

        with open(audio_path, "rb") as f:
            files = {"file": (audio_path.name, f, "audio/wav")}
            data = {
                "model": "whisper-large-v3",
                "response_format": "verbose_json"
            }
            resp = requests.post(whisper_url, headers=headers, files=files, data=data, timeout=60)

        if resp.status_code != 200:
            raise RuntimeError(f"Groq Whisper transcription failed: {resp.text}")

        res_data = resp.json()
        raw_text = res_data.get("text", "").strip()
        detected_lang = res_data.get("language", "Auto")

        # Step 2: Use Llama 3.3 70B to format into the 3 transcription types
        chat_url = "https://api.groq.com/openai/v1/chat/completions"
        chat_headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        prompt = f"""Given this verbatim transcript of speech (detected language: {detected_lang}):
\"\"\"{raw_text}\"\"\"

Generate 3 high-precision transcription versions:
1. "native_transcript": The text in its proper native script (e.g. Hindi in Devanagari, Bengali in Bengali script, etc.).
2. "english_transcript": Accurate, fluid English translation.
3. "romanized_transcript": Phonetic colloquial Romanized text (e.g., Hinglish or Banglish in Latin alphabet).

Output strictly a JSON object:
{{
  "detected_language": "{detected_lang}",
  "confidence": 0.95,
  "native_transcript": "...",
  "english_transcript": "...",
  "romanized_transcript": "..."
}}"""
        chat_payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"},
            "temperature": 0.1
        }
        chat_resp = requests.post(chat_url, headers=chat_headers, json=chat_payload, timeout=45)
        if chat_resp.status_code == 200:
            chat_json = chat_resp.json()["choices"][0]["message"]["content"]
            parsed = json.loads(chat_json)
            native = parsed.get("native_transcript", raw_text)
            english = parsed.get("english_transcript", raw_text)
            romanized = parsed.get("romanized_transcript", raw_text)
        else:
            native = raw_text
            english = raw_text
            romanized = raw_text

        # Segments from Whisper
        segments: List[TranscriptionSegment] = []
        for s in res_data.get("segments", []):
            s_start = float(s.get("start", 0.0)) + start_offset_sec
            s_end = float(s.get("end", 0.0)) + start_offset_sec
            t_txt = s.get("text", "").strip()
            segments.append(
                TranscriptionSegment(
                    start=round(s_start, 2),
                    end=round(s_end, 2),
                    native=t_txt,
                    english=t_txt,
                    romanized=t_txt
                )
            )

        return detected_lang, native, english, romanized, 0.95, segments, artisan_hint or "", section_hint or ""


class OpenAIWhisperEngine(BaseEngine):
    """
    OpenAI Whisper-1 Transcription + GPT-4o-mini formatting.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or Config.OPENAI_API_KEY or os.environ.get("OPENAI_API_KEY", "")

    def is_available(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    def transcribe_chunk(
        self,
        audio_path: Path,
        start_offset_sec: float = 0.0,
        artisan_hint: Optional[str] = None,
        section_hint: Optional[str] = None
    ) -> Tuple[str, str, str, str, float, List[TranscriptionSegment], str, str]:
        if not self.is_available():
            raise ValueError("OpenAI API key is missing. Please provide an OPENAI_API_KEY.")

        whisper_url = "https://api.openai.com/v1/audio/transcriptions"
        headers = {"Authorization": f"Bearer {self.api_key}"}

        with open(audio_path, "rb") as f:
            files = {"file": (audio_path.name, f, "audio/wav")}
            data = {"model": "whisper-1", "response_format": "verbose_json"}
            resp = requests.post(whisper_url, headers=headers, files=files, data=data, timeout=60)

        if resp.status_code != 200:
            raise RuntimeError(f"OpenAI Whisper failed: {resp.text}")

        res_data = resp.json()
        raw_text = res_data.get("text", "").strip()
        detected_lang = res_data.get("language", "Auto")

        # GPT-4o-mini formatting
        chat_url = "https://api.openai.com/v1/chat/completions"
        chat_headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        prompt = f"""Format this transcript:
\"{raw_text}\"

Return JSON with keys:
"detected_language", "native_transcript", "english_transcript", "romanized_transcript" (e.g. Hinglish/Banglish)."""
        chat_payload = {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"},
            "temperature": 0.1
        }
        chat_resp = requests.post(chat_url, headers=chat_headers, json=chat_payload, timeout=45)
        if chat_resp.status_code == 200:
            parsed = json.loads(chat_resp.json()["choices"][0]["message"]["content"])
            native = parsed.get("native_transcript", raw_text)
            english = parsed.get("english_transcript", raw_text)
            romanized = parsed.get("romanized_transcript", raw_text)
        else:
            native = raw_text
            english = raw_text
            romanized = raw_text

        segments: List[TranscriptionSegment] = []
        for s in res_data.get("segments", []):
            s_start = float(s.get("start", 0.0)) + start_offset_sec
            s_end = float(s.get("end", 0.0)) + start_offset_sec
            t_txt = s.get("text", "").strip()
            segments.append(
                TranscriptionSegment(
                    start=round(s_start, 2),
                    end=round(s_end, 2),
                    native=t_txt,
                    english=t_txt,
                    romanized=t_txt
                )
            )

        return detected_lang, native, english, romanized, 0.95, segments, artisan_hint or "", section_hint or ""


class LocalWhisperEngine(BaseEngine):
    """
    Offline local transcription using HuggingFace Transformers pipeline.
    Optimized for multi-core CPU and sub-sliced into bounded segments so it never hangs.
    """

    def __init__(self, model_name: str = "openai/whisper-tiny"):
        self.model_name = model_name
        self._pipeline = None

    def _load_pipeline(self):
        if self._pipeline is None:
            import torch
            try:
                torch.set_num_threads(max(1, os.cpu_count() or 4))
            except Exception:
                pass
            from transformers import pipeline
            self._pipeline = pipeline(
                "automatic-speech-recognition",
                model=self.model_name,
                device="cpu"
            )
        return self._pipeline

    def transcribe_chunk(
        self,
        audio_path: Path,
        start_offset_sec: float = 0.0,
        sub_progress_cb: Optional[Any] = None
    ) -> Tuple[str, str, str, str, float, List[TranscriptionSegment]]:
        pipe = self._load_pipeline()
        
        import soundfile as sf
        import numpy as np
        data, sr = sf.read(str(audio_path))
        if data.ndim > 1:
            data = data.mean(axis=1)

        total_samples = len(data)
        slice_samples = 30 * sr  # 30-second bounded slices
        total_slices = max(1, int(np.ceil(total_samples / slice_samples)))

        full_text_parts = []
        segments: List[TranscriptionSegment] = []

        for slice_idx in range(total_slices):
            s_start_sample = slice_idx * slice_samples
            s_end_sample = min((slice_idx + 1) * slice_samples, total_samples)
            slice_data = data[s_start_sample:s_end_sample]

            slice_start_sec = start_offset_sec + (s_start_sample / sr)
            slice_end_sec = start_offset_sec + (s_end_sample / sr)

            if sub_progress_cb:
                fraction = (slice_idx + 1) / total_slices
                sub_progress_cb(fraction, f"Transcribing {int(slice_start_sec // 60)}m{int(slice_start_sec % 60):02d}s - {int(slice_end_sec // 60)}m{int(slice_end_sec % 60):02d}s...")

            # Skip silence slices (< -45 dBFS)
            rms = np.sqrt(np.mean(slice_data**2) + 1e-12)
            if rms < 0.005:  # ~ -46 dBFS silence
                continue

            try:
                # Bounded generation prevents autoregressive infinite loops
                out = pipe(
                    {"raw": slice_data.astype(np.float32), "sampling_rate": sr},
                    generate_kwargs={"max_new_tokens": 96}
                )
                txt = out.get("text", "").strip()
                if txt:
                    full_text_parts.append(txt)
                    segments.append(
                        TranscriptionSegment(
                            start=round(slice_start_sec, 2),
                            end=round(slice_end_sec, 2),
                            native=txt,
                            english=txt,
                            romanized=txt
                        )
                    )
            except Exception:
                pass

        raw_text = " ".join(full_text_parts).strip()
        return "Auto (Local)", raw_text, raw_text, raw_text, 0.85, segments, artisan_hint or "", section_hint or ""


class TranscriptionManager:
    """
    Orchestrates transcription across engines, handles multi-chunk stitching,
    timestamp offsetting, and graceful fallbacks.
    """

    def __init__(
        self,
        preferred_engine: str = "gemini",
        gemini_key: Optional[str] = None,
        groq_key: Optional[str] = None,
        openai_key: Optional[str] = None
    ):
        self.preferred_engine = preferred_engine.lower()
        self.gemini_key = gemini_key or Config.GEMINI_API_KEY
        self.groq_key = groq_key or Config.GROQ_API_KEY
        self.openai_key = openai_key or Config.OPENAI_API_KEY

        self.engines = {
            "gemini": GeminiAudioEngine(api_key=self.gemini_key),
            "groq": GroqWhisperEngine(api_key=self.groq_key),
            "openai": OpenAIWhisperEngine(api_key=self.openai_key),
            "local": LocalWhisperEngine()
        }

    def get_active_engine(self) -> Tuple[str, BaseEngine]:
        """
        Selects the requested engine. If user requested a cloud engine (Gemini/Groq/OpenAI)
        and the API key is missing, raises an explicit error so user knows to provide the key.
        """
        pref = self.preferred_engine
        if pref in ["gemini", "groq", "openai"]:
            eng = self.engines[pref]
            if hasattr(eng, "is_available") and eng.is_available():
                return pref, eng
            else:
                raise ValueError(
                    f"MISSING_API_KEY:{pref}: {pref.upper()} API Key is missing. "
                    f"Please enter your {pref.upper()} API Key in Settings, or choose 'Local Whisper' to run offline."
                )

        # Explicitly requested local
        return "local", self.engines["local"]

    def transcribe_audio_report(
        self,
        report: AudioAnalysisReport,
        progress_callback: Optional[callable] = None,
        is_cancelled_check: Optional[callable] = None
    ) -> TranscriptionResult:
        """
        Transcribes all chunks in the AudioAnalysisReport, joins them seamlessly,
        and produces the complete 3-type TranscriptionResult.
        """
        engine_name, engine = self.get_active_engine()
        chunks = report.chunks

        from artisan_organizer import extract_artisan_and_section
        cand_artisan, cand_sec = extract_artisan_and_section(report.original_path.name)

        all_native_parts: List[str] = []
        all_english_parts: List[str] = []
        all_romanized_parts: List[str] = []
        all_segments: List[TranscriptionSegment] = []
        detected_languages: List[str] = []
        confidences: List[float] = []
        detected_artisans: List[str] = []
        detected_sections: List[str] = []

        total_chunks = len(chunks)
        for i, chunk in enumerate(chunks, 1):
            if is_cancelled_check and is_cancelled_check():
                break

            if progress_callback:
                progress_callback(
                    chunk_idx=i,
                    total_chunks=total_chunks,
                    msg=f"Transcribing {cand_artisan} - {cand_sec} ({chunk.duration_seconds:.1f}s) using {engine_name.upper()}..."
                )

            start_offset = chunk.start_ms / 1000.0

            def on_sub_progress(sub_fraction: float, sub_msg: str):
                if progress_callback:
                    progress_callback(
                        chunk_idx=i,
                        total_chunks=total_chunks,
                        msg=f"Chunk {i}/{total_chunks}: {sub_msg}",
                        sub_fraction=sub_fraction
                    )

            if isinstance(engine, LocalWhisperEngine):
                res = engine.transcribe_chunk(
                    chunk.file_path,
                    start_offset_sec=start_offset,
                    sub_progress_cb=on_sub_progress,
                    artisan_hint=cand_artisan,
                    section_hint=cand_sec
                )
            else:
                res = engine.transcribe_chunk(
                    chunk.file_path,
                    start_offset_sec=start_offset,
                    artisan_hint=cand_artisan,
                    section_hint=cand_sec
                )

            if len(res) >= 8:
                lang, native, eng, rom, conf, segs, art_det, sec_det = res[:8]
                if art_det:
                    detected_artisans.append(art_det)
                if sec_det:
                    detected_sections.append(sec_det)
            else:
                lang, native, eng, rom, conf, segs = res[:6]

            detected_languages.append(lang)
            confidences.append(conf)
            if native:
                all_native_parts.append(native)
            if eng:
                all_english_parts.append(eng)
            if rom:
                all_romanized_parts.append(rom)
            all_segments.extend(segs)

        # Merge text
        full_native = "\n\n".join(all_native_parts).strip()
        full_english = "\n\n".join(all_english_parts).strip()
        full_romanized = "\n\n".join(all_romanized_parts).strip()

        # Second-tier safety net: Ensure English translation is never missing or truncated
        if full_native and (not full_english or len(full_english) < 0.25 * len(full_native)):
            if hasattr(engine, "translate_dialogue_to_english"):
                print(f"[OmniScribe] Second-tier recovery: Translating dialogue to English for '{final_artisan}'...")
                full_english = engine.translate_dialogue_to_english(full_native, final_artisan)
            elif "gemini" in self.engines and self.engines["gemini"].is_available():
                print(f"[OmniScribe] Second-tier recovery: Using Gemini to translate dialogue to English for '{final_artisan}'...")
                full_english = self.engines["gemini"].translate_dialogue_to_english(full_native, final_artisan)

        primary_lang = detected_languages[0] if detected_languages else "Unknown"
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.90
        final_artisan = detected_artisans[0] if detected_artisans else cand_artisan
        final_section = detected_sections[0] if detected_sections else cand_sec

        chunks_data = [
            {
                "chunk_index": c.index,
                "start_formatted": c.start_formatted,
                "end_formatted": c.end_formatted,
                "duration_seconds": c.duration_seconds,
                "file": c.file_path.name
            }
            for c in chunks
        ]

        return TranscriptionResult(
            filename=report.original_path.name,
            duration_seconds=report.duration_seconds,
            duration_formatted=report.duration_formatted,
            language_detected=primary_lang,
            confidence=round(avg_confidence, 2),
            native_text=full_native,
            english_text=full_english,
            romanized_text=full_romanized,
            artisan_name=final_artisan,
            section_name=final_section,
            segments=all_segments,
            chunks_info=chunks_data,
            engine_used=engine_name,
            denoised=report.denoised_applied,
            metadata={
                "artisan_name": final_artisan,
                "section_name": final_section,
                "sample_rate": report.sample_rate,
                "rms_dbfs": report.rms_dbfs,
                "noise_floor_dbfs": report.noise_floor_dbfs,
                "is_noisy": report.is_noisy,
                "denoise_mode": report.denoise_mode,
                "total_chunks": len(chunks)
            }
        )
