"""
OmniScribe - Batch Orchestrator
Recursively discovers audio files in folders, applies natural sorting,
coordinates preprocessing, denoising, chunking, transcription,
creates organized folder structures, and bundles complete master downloads.
"""

import json
import os
import re
import shutil
import zipfile
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Callable, Dict, List, Optional, Tuple

from audio_processor import AudioProcessor
from config import (
    ALL_SUPPORTED_EXTENSIONS,
    DEFAULT_OUTPUT_DIR,
    DEFAULT_TEMP_DIR,
    Config,
)
from document_generator import DocumentGenerator
from transcription_engine import TranscriptionManager, TranscriptionResult


def natural_sort_key(s: str):
    """Sorts strings containing numbers in human order (e.g., file1, file2, file10)."""
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', str(s))]


@dataclass
class BatchProgress:
    current_file_idx: int = 0
    total_files: int = 0
    current_filename: str = ""
    current_chunk_idx: int = 0
    total_chunks: int = 0
    status_message: str = ""
    percent_complete: float = 0.0
    is_completed: bool = False
    is_cancelled: bool = False
    error: Optional[str] = None
    results: List[TranscriptionResult] = field(default_factory=list)


class BatchOrchestrator:
    """Manages full batch runs over folders or lists of files."""

    def __init__(
        self,
        engine_name: str = Config.DEFAULT_ENGINE,
        denoise_mode: str = Config.DEFAULT_DENOISE_MODE,
        chunk_duration_mins: float = Config.DEFAULT_CHUNK_DURATION_MINUTES,
        gemini_key: Optional[str] = None,
        groq_key: Optional[str] = None,
        openai_key: Optional[str] = None,
        output_base_dir: Optional[Path] = None
    ):
        self.engine_name = engine_name
        self.denoise_mode = denoise_mode
        self.chunk_duration_mins = chunk_duration_mins
        self.output_base_dir = output_base_dir or DEFAULT_OUTPUT_DIR
        
        self.audio_processor = AudioProcessor()
        self.transcription_manager = TranscriptionManager(
            preferred_engine=engine_name,
            gemini_key=gemini_key,
            groq_key=groq_key,
            openai_key=openai_key
        )
        self.doc_generator = DocumentGenerator()

    @staticmethod
    def scan_folder_for_media(folder_path: Path, recursive: bool = True) -> List[Path]:
        """Scans a directory for supported audio and video containers with natural sorting."""
        if not folder_path.exists() or not folder_path.is_dir():
            return []

        IGNORED_DIR_NAMES = {
            "node_modules", ".git", ".svn", ".hg", "__pycache__", ".venv", "venv",
            "env", ".env", ".next", ".nuxt", "dist", "build", ".cache", ".idea",
            ".vscode", "windows", "appdata", "$recycle.bin", "system volume information",
            "temp_processing", "temp", "tmp", ".temp"
        }

        found_files: List[Path] = []
        try:
            if recursive:
                for root, dirs, filenames in os.walk(folder_path):
                    # Prune ignored and hidden directories in-place so os.walk skips them
                    dirs[:] = [
                        d for d in dirs 
                        if not d.startswith('.') and d.lower() not in IGNORED_DIR_NAMES
                    ]
                    for fn in filenames:
                        suffix = os.path.splitext(fn)[1].lower()
                        if suffix in ALL_SUPPORTED_EXTENSIONS:
                            found_files.append(Path(root) / fn)
            else:
                for entry in folder_path.iterdir():
                    if entry.is_file() and entry.suffix.lower() in ALL_SUPPORTED_EXTENSIONS:
                        found_files.append(entry)
        except Exception as e:
            logger.warning(f"Error scanning folder {folder_path}: {e}")

        found_files.sort(key=lambda x: natural_sort_key(x.name))
        return found_files

    def process_batch(
        self,
        files: List[Path],
        batch_title: Optional[str] = None,
        progress_callback: Optional[Callable[[BatchProgress], None]] = None
    ) -> Tuple[Path, List[TranscriptionResult]]:
        """
        Processes a list of audio files:
        1. Preprocesses and denoises.
        2. Splits long files into chunks.
        3. Generates 3 types of transcriptions (Native, English, Hinglish/Banglish).
        4. Saves organized subfolder per audio file.
        5. Combines into Master Batch Documents (Word, PDF, MD, TXT, JSON, ZIP).
        """
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        batch_title = batch_title or f"Batch_{timestamp_str}"
        batch_folder_name = re.sub(r'[^\w\-_\.]', '_', batch_title)
        batch_dir = self.output_base_dir / batch_folder_name
        batch_dir.mkdir(parents=True, exist_ok=True)

        total_files = len(files)
        all_results: List[TranscriptionResult] = []
        progress = BatchProgress(total_files=total_files)

        for f_idx, audio_file in enumerate(files, 1):
            if progress.is_cancelled:
                progress.status_message = "Transcription batch cancelled by user."
                break

            progress.current_file_idx = f_idx
            progress.current_filename = audio_file.name
            progress.percent_complete = round(((f_idx - 1) / total_files) * 100, 1)
            progress.status_message = f"[{f_idx}/{total_files}] Preprocessing & Denoising: {audio_file.name}"
            if progress_callback:
                progress_callback(progress)

            # Create dedicated directory for this audio file
            clean_stem = re.sub(r'[^\w\-_\.]', '_', audio_file.stem)
            item_dir_name = f"{f_idx:02d}_{clean_stem}"
            item_output_dir = batch_dir / item_dir_name
            item_output_dir.mkdir(parents=True, exist_ok=True)

            try:
                # 1. Audio Processing & Denoising & Chunking
                report = self.audio_processor.process_audio(
                    input_file=audio_file,
                    output_dir=item_output_dir,
                    denoise_mode=self.denoise_mode,
                    chunk_duration_minutes=self.chunk_duration_mins
                )

                if progress.is_cancelled:
                    break

                # 2. Transcription
                def chunk_progress(chunk_idx: int, total_chunks: int, msg: str, sub_fraction: float = 0.0):
                    if progress.is_cancelled:
                        return
                    progress.current_chunk_idx = chunk_idx
                    progress.total_chunks = total_chunks
                    progress.status_message = f"[{f_idx}/{total_files}] {msg}"
                    file_fraction = (f_idx - 1) / total_files
                    base_chunk_frac = (chunk_idx - 1) / total_chunks
                    active_chunk_frac = (1.0 / total_chunks) * max(0.05, sub_fraction)
                    total_file_progress = (base_chunk_frac + active_chunk_frac) * (1.0 / total_files)
                    progress.percent_complete = round((file_fraction + total_file_progress) * 100, 1)
                    if progress_callback:
                        progress_callback(progress)

                result = self.transcription_manager.transcribe_audio_report(
                    report=report,
                    progress_callback=chunk_progress,
                    is_cancelled_check=lambda: progress.is_cancelled
                )

                if progress.is_cancelled:
                    break

                # 3. Generate Individual Documents
                # Word .docx
                self.doc_generator.generate_docx(result, item_output_dir / f"{clean_stem}_Report.docx")
                # PDF .pdf
                self.doc_generator.generate_pdf(result, item_output_dir / f"{clean_stem}_Report.pdf")
                # Markdown .md
                self.doc_generator.generate_markdown(result, item_output_dir / f"{clean_stem}_Report.md")
                # TXT files (Native, English, Romanized)
                self.doc_generator.generate_raw_txt(result, item_output_dir)
                # Subtitles (SRT and VTT)
                self.doc_generator.generate_subtitles(result, item_output_dir)
                # Metadata JSON & Paths
                result.metadata["output_dir"] = str(item_output_dir)
                result.metadata["clean_stem"] = clean_stem
                (item_output_dir / f"{clean_stem}_metadata.json").write_text(
                    json.dumps(result.to_dict(), indent=2, ensure_ascii=False),
                    encoding="utf-8"
                )

                # Remove any stale error log from a previous run
                stale_err = item_output_dir / "ERROR_LOG.txt"
                if stale_err.exists():
                    stale_err.unlink(missing_ok=True)

                all_results.append(result)
                progress.results = all_results

            except Exception as e:
                # Log error and continue to next file
                err_file = item_output_dir / "ERROR_LOG.txt"
                err_file.write_text(f"Failed processing {audio_file.name}:\n{str(e)}", encoding="utf-8")

        # 4. Generate Master Combined Documents for entire batch
        progress.status_message = "Generating Master Combined Documents (Word, PDF, Markdown, TXT)..."
        progress.percent_complete = 95.0
        if progress_callback:
            progress_callback(progress)

        if all_results:
            self.doc_generator.generate_master_combined_documents(
                batch_name=batch_title,
                results=all_results,
                output_dir=batch_dir
            )

        # 5. Create Master ZIP Archive and Artisans-Only ZIP Archive
        progress.status_message = "Bundling output and Artisan dossiers into ZIP archives..."
        
        # 5a. Artisans-Only ZIP
        artisans_dir = batch_dir / "Artisans_Dossiers"
        if artisans_dir.exists():
            art_zip_path = batch_dir / "Artisans_Complete_Dossiers.zip"
            with zipfile.ZipFile(art_zip_path, 'w', zipfile.ZIP_DEFLATED) as azip:
                for root, _, files_in_dir in os.walk(artisans_dir):
                    for file_in_dir in files_in_dir:
                        if not file_in_dir.endswith(".zip"):
                            full_p = Path(root) / file_in_dir
                            rel_p = full_p.relative_to(artisans_dir)
                            azip.write(full_p, arcname=str(rel_p))

        # 5b. Full Master Batch ZIP
        zip_path = batch_dir.parent / f"{batch_dir.name}.zip"
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files_in_dir in os.walk(batch_dir):
                for file_in_dir in files_in_dir:
                    full_p = Path(root) / file_in_dir
                    rel_p = full_p.relative_to(batch_dir.parent)
                    zipf.write(full_p, arcname=str(rel_p))

        progress.is_completed = True
        progress.percent_complete = 100.0
        progress.status_message = f"Batch processing completed! Processed {len(all_results)}/{total_files} files."
        if progress_callback:
            progress_callback(progress)

        return batch_dir, all_results
