"""
OmniScribe - FastAPI Server
Powers the Modern Web Dashboard, handles folder scanning, file uploads,
real-time batch transcription progress, and document downloads.
"""

import asyncio
import json
import os
import re
import shutil
import sys
import urllib.parse
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

def make_dl_url(p: Any) -> Optional[str]:
    if not p:
        return None
    return f"/api/download?path={urllib.parse.quote(str(p))}"

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from fastapi import BackgroundTasks, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from audio_processor import AudioProcessor
from batch_orchestrator import BatchOrchestrator, BatchProgress
from config import (
    ALL_SUPPORTED_EXTENSIONS,
    DEFAULT_OUTPUT_DIR,
    DEFAULT_TEMP_DIR,
    FFMPEG_PATH,
    Config,
)
from transcription_engine import TranscriptionManager

app = FastAPI(title="OmniScribe AI Audio Transcription Studio", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active jobs tracking in memory
ACTIVE_JOBS: Dict[str, BatchProgress] = {}
JOB_OUTPUT_DIRS: Dict[str, Path] = {}


class ScanFolderRequest(BaseModel):
    folder_path: str
    recursive: bool = True


class SaveKeysRequest(BaseModel):
    gemini_key: Optional[str] = None
    groq_key: Optional[str] = None
    openai_key: Optional[str] = None


class StartBatchRequest(BaseModel):
    files: List[str]
    batch_title: Optional[str] = None
    engine: str = "gemini"
    denoise_mode: str = "auto"
    chunk_duration_mins: float = 10.0


def mask_key(k: str) -> str:
    if not k:
        return ""
    if len(k) <= 8:
        return "****"
    return k[:4] + "..." + k[-4:]


@app.get("/api/system-status")
def get_system_status():
    """Returns runtime readiness: FFmpeg, API keys, engines."""
    manager = TranscriptionManager()
    try:
        active_engine, _ = manager.get_active_engine()
    except Exception:
        active_engine = "local"

    return {
        "ffmpeg_path": FFMPEG_PATH,
        "ffmpeg_ready": bool(FFMPEG_PATH and os.path.exists(FFMPEG_PATH)),
        "active_engine": active_engine,
        "keys_configured": {
            "gemini": mask_key(Config.GEMINI_API_KEY),
            "groq": mask_key(Config.GROQ_API_KEY),
            "openai": mask_key(Config.OPENAI_API_KEY)
        },
        "default_output_dir": str(DEFAULT_OUTPUT_DIR),
        "supported_extensions": list(ALL_SUPPORTED_EXTENSIONS)
    }


@app.post("/api/save-keys")
def save_keys(req: SaveKeysRequest):
    """Saves API keys to .env and runtime."""
    if req.gemini_key is not None:
        Config.save_api_key("GEMINI", req.gemini_key.strip())
    if req.groq_key is not None:
        Config.save_api_key("GROQ", req.groq_key.strip())
    if req.openai_key is not None:
        Config.save_api_key("OPENAI", req.openai_key.strip())

    return {"status": "success", "message": "API Keys saved successfully"}


@app.post("/api/scan-folder")
def scan_folder(req: ScanFolderRequest):
    """Scans a local folder on the machine for all media files."""
    raw = req.folder_path.strip() if req.folder_path else ""
    # Strip any leading and trailing quotes (double quotes, single quotes, backticks)
    raw = raw.strip('"\'`').strip()
    
    # Strip file:// or file:/// URL prefixes if copied from browser
    if raw.startswith("file:///"):
        raw = raw[8:]
    elif raw.startswith("file://"):
        raw = raw[7:]
        
    # URL-decode any percent-encoded characters (like %20 for spaces)
    raw = urllib.parse.unquote(raw)
    
    # Expand user home (~) or environment variables
    raw = os.path.expanduser(os.path.expandvars(raw))

    if not raw:
        raise HTTPException(status_code=400, detail="Please enter a valid folder path.")

    folder = Path(raw).resolve()

    # If the user pasted a path directly to an audio file instead of a folder:
    if folder.exists() and folder.is_file():
        if folder.suffix.lower() in ALL_SUPPORTED_EXTENSIONS:
            size = folder.stat().st_size
            return {
                "folder_path": str(folder.parent),
                "total_files": 1,
                "total_size_mb": round(size / (1024 * 1024), 2),
                "files": [{
                    "name": folder.name,
                    "path": str(folder),
                    "size_mb": round(size / (1024 * 1024), 2),
                    "extension": folder.suffix.lower()
                }]
            }
        else:
            # Fall back to parent folder
            folder = folder.parent

    if not folder.exists() or not folder.is_dir():
        clean_display = req.folder_path.strip().strip('"\'`')
        raise HTTPException(
            status_code=400,
            detail=f"Directory does not exist on your computer: {clean_display}. Please check the path and try again."
        )

    files = BatchOrchestrator.scan_folder_for_media(folder, recursive=req.recursive)

    file_info = []
    total_bytes = 0
    for f in files:
        try:
            size = f.stat().st_size
            total_bytes += size
            file_info.append({
                "name": f.name,
                "path": str(f),
                "size_mb": round(size / (1024 * 1024), 2),
                "extension": f.suffix.lower()
            })
        except Exception:
            continue

    return {
        "folder_path": str(folder),
        "total_files": len(file_info),
        "total_size_mb": round(total_bytes / (1024 * 1024), 2),
        "files": file_info
    }


@app.post("/api/upload-files")
async def upload_files(files: List[UploadFile] = File(...)):
    """Receives uploaded audio/video files from the browser and stores them in temp."""
    upload_session_id = uuid.uuid4().hex[:8]
    upload_dir = DEFAULT_TEMP_DIR / f"upload_{upload_session_id}"
    upload_dir.mkdir(parents=True, exist_ok=True)

    saved_files = []
    for f in files:
        raw_name = f.filename or "audio_file.mp3"
        clean_name = Path(raw_name.replace('\\', '/')).name
        if not clean_name:
            clean_name = f"audio_{uuid.uuid4().hex[:6]}.mp3"

        dest = upload_dir / clean_name
        if dest.exists():
            dest = upload_dir / f"{uuid.uuid4().hex[:4]}_{clean_name}"

        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(f.file, buffer)

        size = dest.stat().st_size
        saved_files.append({
            "name": clean_name,
            "path": str(dest),
            "size_mb": round(size / (1024 * 1024), 2),
            "extension": dest.suffix.lower()
        })

    return {
        "status": "success",
        "total_uploaded": len(saved_files),
        "files": saved_files
    }


def run_batch_in_background(job_id: str, req: StartBatchRequest):
    """Executes the batch processing pipeline in a background thread."""
    orchestrator = BatchOrchestrator(
        engine_name=req.engine,
        denoise_mode=req.denoise_mode,
        chunk_duration_mins=req.chunk_duration_mins,
        gemini_key=Config.GEMINI_API_KEY,
        groq_key=Config.GROQ_API_KEY,
        openai_key=Config.OPENAI_API_KEY
    )

    def on_progress(p: BatchProgress):
        ACTIVE_JOBS[job_id] = p

    try:
        file_paths = [Path(p) for p in req.files]
        batch_title = req.batch_title or f"Batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        batch_folder_name = re.sub(r'[^\w\-_\.]', '_', batch_title)
        JOB_OUTPUT_DIRS[job_id] = orchestrator.output_base_dir / batch_folder_name
        batch_dir, results = orchestrator.process_batch(
            files=file_paths,
            batch_title=batch_title,
            progress_callback=on_progress
        )
        JOB_OUTPUT_DIRS[job_id] = batch_dir
    except Exception as e:
        prog = ACTIVE_JOBS.get(job_id, BatchProgress())
        prog.error = str(e)
        prog.status_message = f"Error: {str(e)}"
        prog.is_completed = True
        ACTIVE_JOBS[job_id] = prog


@app.post("/api/start-batch")
def start_batch(req: StartBatchRequest, background_tasks: BackgroundTasks):
    """Starts a batch transcription job in the background."""
    if not req.files:
        raise HTTPException(status_code=400, detail="No files provided for transcription.")

    # Check key requirement for cloud engines
    engine_lower = req.engine.lower()
    if engine_lower == "gemini" and not Config.GEMINI_API_KEY:
        raise HTTPException(
            status_code=400,
            detail="Google Gemini API Key is missing! Click 'API Keys' at the top right to paste your free Gemini key, or switch the Transcription Engine dropdown to 'Local Whisper' to run offline."
        )
    elif engine_lower == "groq" and not Config.GROQ_API_KEY:
        raise HTTPException(
            status_code=400,
            detail="Groq API Key is missing! Click 'API Keys' to enter your Groq key, or choose 'Local Whisper'."
        )
    elif engine_lower == "openai" and not Config.OPENAI_API_KEY:
        raise HTTPException(
            status_code=400,
            detail="OpenAI API Key is missing! Click 'API Keys' to enter your OpenAI key, or choose 'Local Whisper'."
        )

    job_id = uuid.uuid4().hex[:12]
    ACTIVE_JOBS[job_id] = BatchProgress(
        total_files=len(req.files),
        status_message="Initializing transcription engine & audio pipeline..."
    )

    background_tasks.add_task(run_batch_in_background, job_id, req)
    return {"status": "started", "job_id": job_id}


@app.post("/api/cancel-batch/{job_id}")
def cancel_batch(job_id: str):
    """Cancels an in-flight batch transcription job immediately."""
    if job_id in ACTIVE_JOBS:
        p = ACTIVE_JOBS[job_id]
        p.is_cancelled = True
        p.is_completed = True
        p.status_message = "Transcription batch cancelled by user."
        return {"status": "success", "message": "Job cancelled"}
    raise HTTPException(status_code=404, detail="Job ID not found")


@app.get("/api/job-status/{job_id}")
def get_job_status(job_id: str):
    """Polls real-time progress of a batch transcription job."""
    if job_id not in ACTIVE_JOBS:
        raise HTTPException(status_code=404, detail="Job ID not found")

    p = ACTIVE_JOBS[job_id]
    batch_dir = JOB_OUTPUT_DIRS.get(job_id)

    # Master files URLs if batch is done
    master_downloads = {}
    artisans_data = {}
    if p.is_completed and batch_dir and batch_dir.exists():
        zip_file = batch_dir.parent / f"{batch_dir.name}.zip"
        art_zip = batch_dir / "Artisans_Complete_Dossiers.zip"
        docx_file = batch_dir / "Master_Combined_Transcript.docx"
        md_file = batch_dir / "Master_Combined_Transcript.md"
        pdf_file = batch_dir / "Master_Combined_Transcript.pdf"
        txt_file = batch_dir / "Master_Combined_Transcript.txt"
        summary_file = batch_dir / "Master_Batch_Summary.json"

        if zip_file.exists():
            master_downloads["zip"] = make_dl_url(zip_file)
        if art_zip.exists():
            master_downloads["artisans_zip"] = make_dl_url(art_zip)
        if docx_file.exists():
            master_downloads["docx"] = make_dl_url(docx_file)
        if md_file.exists():
            master_downloads["md"] = make_dl_url(md_file)
        if pdf_file.exists():
            master_downloads["pdf"] = make_dl_url(pdf_file)
        if txt_file.exists():
            master_downloads["txt"] = make_dl_url(txt_file)

        if summary_file.exists():
            try:
                s_data = json.loads(summary_file.read_text(encoding="utf-8"))
                artisans_data = s_data.get("artisans", {})
            except Exception:
                pass

    # Format result items with their individual download links
    formatted_results = []
    for r in p.results:
        r_dict = r.to_dict()
        clean_stem = (r.metadata.get("clean_stem") if r.metadata else None) or re.sub(r'[^\w\-_\.]', '_', Path(r.filename).stem)
        item_dir = Path(r.metadata["output_dir"]) if (r.metadata and r.metadata.get("output_dir")) else None
        if not item_dir or not item_dir.exists():
            if batch_dir and batch_dir.exists():
                for sub in batch_dir.iterdir():
                    if sub.is_dir() and (clean_stem in sub.name or Path(r.filename).stem in sub.name):
                        item_dir = sub
                        break

        if item_dir and item_dir.exists():
            r_dict["downloads"] = {
                "docx": make_dl_url(item_dir / (clean_stem + '_Report.docx')),
                "pdf": make_dl_url(item_dir / (clean_stem + '_Report.pdf')),
                "md": make_dl_url(item_dir / (clean_stem + '_Report.md')),
                "native_txt": make_dl_url(item_dir / '01_Native_Transcription.txt'),
                "english_txt": make_dl_url(item_dir / '02_English_Translation.txt'),
                "romanized_txt": make_dl_url(item_dir / '03_Hinglish_Banglish_Romanized.txt'),
                "srt_native": make_dl_url(item_dir / 'Subtitles_Native.srt'),
                "srt_english": make_dl_url(item_dir / 'Subtitles_English.srt')
            }
        formatted_results.append(r_dict)

    return {
        "job_id": job_id,
        "current_file_idx": p.current_file_idx,
        "total_files": p.total_files,
        "current_filename": p.current_filename,
        "status_message": p.status_message,
        "percent_complete": p.percent_complete,
        "is_completed": p.is_completed,
        "error": p.error,
        "results": formatted_results,
        "master_downloads": master_downloads,
        "artisans": artisans_data,
        "batch_dir": str(batch_dir) if batch_dir else None
    }


@app.get("/api/download")
def download_file(path: str):
    """Direct file download endpoint for DOCX, PDF, ZIP, TXT, SRT, etc."""
    unquoted = urllib.parse.unquote(path)
    target_file = Path(unquoted).resolve()
    if not target_file.exists() or not target_file.is_file():
        raise HTTPException(status_code=404, detail="Requested file does not exist")

    return FileResponse(
        path=str(target_file),
        filename=target_file.name,
        media_type="application/octet-stream"
    )


@app.get("/api/completed-batches")
def list_completed_batches():
    """Lists all completed batches in the output directory."""
    batches = []
    if DEFAULT_OUTPUT_DIR.exists():
        for item in sorted(DEFAULT_OUTPUT_DIR.iterdir(), key=lambda p: p.stat().st_mtime if p.exists() else 0, reverse=True):
            if item.is_dir():
                summary_file = item / "Master_Batch_Summary.json"
                docx_file = item / "Master_Combined_Transcript.docx"
                pdf_file = item / "Master_Combined_Transcript.pdf"
                zip_file = DEFAULT_OUTPUT_DIR / f"{item.name}.zip"

                sub_count = len([s for s in item.iterdir() if s.is_dir()])
                if sub_count > 0 or docx_file.exists():
                    batches.append({
                        "batch_name": item.name,
                        "folder_path": str(item),
                        "has_summary": summary_file.exists(),
                        "has_docx": docx_file.exists(),
                        "has_pdf": pdf_file.exists(),
                        "has_zip": zip_file.exists(),
                        "files_count": sub_count,
                        "downloads": {
                            "zip": make_dl_url(zip_file) if zip_file.exists() else None,
                            "docx": make_dl_url(docx_file) if docx_file.exists() else None,
                            "pdf": make_dl_url(pdf_file) if pdf_file.exists() else None,
                            "md": make_dl_url(item / 'Master_Combined_Transcript.md') if (item / "Master_Combined_Transcript.md").exists() else None,
                        }
                    })
    return {"batches": batches}


@app.get("/api/load-batch/{batch_name}")
def load_batch(batch_name: str):
    """Loads results and transcripts from a completed batch directory."""
    batch_dir = DEFAULT_OUTPUT_DIR / batch_name
    if not batch_dir.exists() or not batch_dir.is_dir():
        raise HTTPException(status_code=404, detail="Batch folder not found")

    summary_file = batch_dir / "Master_Batch_Summary.json"
    results = []
    artisans = {}
    if summary_file.exists():
        try:
            data = json.loads(summary_file.read_text(encoding="utf-8"))
            results = data.get("results", [])
            artisans = data.get("artisans", {})
        except Exception:
            pass

    # Ensure all artisan dossier download links are clean and URL-encoded
    artisans_dir = batch_dir / "Artisans_Dossiers"
    if artisans:
        for art_name, art_obj in artisans.items():
            art_slug = re.sub(r'[^\w\-_\.]', '_', art_name).strip('_')
            art_obj["downloads"] = {
                "docx": make_dl_url(artisans_dir / f"{art_slug}_Complete_Dossier.docx"),
                "pdf": make_dl_url(artisans_dir / f"{art_slug}_Complete_Dossier.pdf"),
                "md": make_dl_url(artisans_dir / f"{art_slug}_Complete_Dossier.md"),
                "txt": make_dl_url(artisans_dir / f"{art_slug}_Complete_Dossier.txt")
            }

    if not results:
        for sub in sorted(batch_dir.iterdir()):
            if sub.is_dir():
                meta = list(sub.glob("*_metadata.json"))
                if meta:
                    try:
                        results.append(json.loads(meta[0].read_text(encoding="utf-8")))
                    except Exception:
                        pass

    for r in results:
        clean_stem = (r.get("metadata", {}).get("clean_stem")) or re.sub(r'[^\w\-_\.]', '_', Path(r.get("filename", "")).stem)
        item_dir = Path(r.get("metadata", {}).get("output_dir", ""))
        if not item_dir or not item_dir.exists():
            for sub in batch_dir.iterdir():
                if sub.is_dir() and (clean_stem in sub.name or Path(r.get("filename", "")).stem in sub.name):
                    item_dir = sub
                    break

        if item_dir and item_dir.exists():
            r["downloads"] = {
                "docx": make_dl_url(item_dir / (clean_stem + '_Report.docx')),
                "pdf": make_dl_url(item_dir / (clean_stem + '_Report.pdf')),
                "md": make_dl_url(item_dir / (clean_stem + '_Report.md')),
                "native_txt": make_dl_url(item_dir / '01_Native_Transcription.txt'),
                "english_txt": make_dl_url(item_dir / '02_English_Translation.txt'),
                "romanized_txt": make_dl_url(item_dir / '03_Hinglish_Banglish_Romanized.txt'),
                "srt_native": make_dl_url(item_dir / 'Subtitles_Native.srt'),
                "srt_english": make_dl_url(item_dir / 'Subtitles_English.srt')
            }

    if not artisans and results:
        try:
            from artisan_organizer import group_results_by_artisan
            from document_generator import DocumentGenerator
            doc_gen = DocumentGenerator()
            artisans_dir = batch_dir / "Artisans_Dossiers"
            for art_name, art_secs in group_results_by_artisan(results).items():
                art_dur = sum(s.get("duration_seconds", 0.0) if isinstance(s, dict) else getattr(s, "duration_seconds", 0.0) for s in art_secs)
                art_slug = re.sub(r'[^\w\-_\.]', '_', art_name).strip('_')
                artisans[art_name] = {
                    "artisan_name": art_name,
                    "sections_count": len(art_secs),
                    "total_duration_seconds": art_dur,
                    "total_duration_formatted": doc_gen.format_duration_static(art_dur),
                    "sections": [
                        {
                            "section_name": s.get("section_name", "") if isinstance(s, dict) else getattr(s, "section_name", ""),
                            "filename": s.get("filename", "") if isinstance(s, dict) else getattr(s, "filename", ""),
                            "duration_formatted": s.get("duration_formatted", "") if isinstance(s, dict) else getattr(s, "duration_formatted", ""),
                            "language": s.get("language_detected", "") if isinstance(s, dict) else getattr(s, "language_detected", "")
                        }
                        for s in art_secs
                    ],
                    "downloads": {
                        "docx": make_dl_url(artisans_dir / f'{art_slug}_Complete_Dossier.docx'),
                        "pdf": make_dl_url(artisans_dir / f'{art_slug}_Complete_Dossier.pdf'),
                        "md": make_dl_url(artisans_dir / f'{art_slug}_Complete_Dossier.md'),
                        "txt": make_dl_url(artisans_dir / f'{art_slug}_Complete_Dossier.txt')
                    }
                }
        except Exception:
            pass

    zip_file = DEFAULT_OUTPUT_DIR / f"{batch_dir.name}.zip"
    art_zip = batch_dir / "Artisans_Complete_Dossiers.zip"
    docx_file = batch_dir / "Master_Combined_Transcript.docx"
    md_file = batch_dir / "Master_Combined_Transcript.md"
    pdf_file = batch_dir / "Master_Combined_Transcript.pdf"
    txt_file = batch_dir / "Master_Combined_Transcript.txt"

    master_downloads = {}
    if zip_file.exists(): master_downloads["zip"] = make_dl_url(zip_file)
    if art_zip.exists(): master_downloads["artisans_zip"] = make_dl_url(art_zip)
    if docx_file.exists(): master_downloads["docx"] = make_dl_url(docx_file)
    if md_file.exists(): master_downloads["md"] = make_dl_url(md_file)
    if pdf_file.exists(): master_downloads["pdf"] = make_dl_url(pdf_file)
    if txt_file.exists(): master_downloads["txt"] = make_dl_url(txt_file)

    return {
        "batch_name": batch_name,
        "batch_dir": str(batch_dir),
        "total_files": len(results),
        "total_artisans": len(artisans),
        "artisans": artisans,
        "results": results,
        "master_downloads": master_downloads
    }


# ==============================================================================
# Serve Frontend Web Dashboard & MANO-LAB Digital Laboratory Framework
# ==============================================================================
ROOT_DIR = Path(__file__).resolve().parent
STATIC_DIR = ROOT_DIR / "static"
APPS_DIR = ROOT_DIR / "apps"
SRC_DIR = ROOT_DIR / "src"
PUBLIC_DIR = ROOT_DIR / "public"

# Mount static asset directories
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

if SRC_DIR.exists():
    app.mount("/src", StaticFiles(directory=str(SRC_DIR)), name="src")

if PUBLIC_DIR.exists():
    app.mount("/public", StaticFiles(directory=str(PUBLIC_DIR)), name="public")

if APPS_DIR.exists():
    app.mount("/apps", StaticFiles(directory=str(APPS_DIR), html=True), name="apps")


@app.get("/", response_class=HTMLResponse)
def index_page():
    """Serves the MANO-LAB Digital Laboratory Homepage."""
    homepage = ROOT_DIR / "index.html"
    if homepage.exists():
        return HTMLResponse(content=homepage.read_text(encoding="utf-8"))
    
    # Fallback to static index if root index doesn't exist
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return HTMLResponse(content=index_file.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>MANO-LAB Loading...</h1>")


@app.get("/apps/audio-transcription", response_class=HTMLResponse)
@app.get("/apps/audio-transcription/", response_class=HTMLResponse)
def audio_transcription_page():
    """Serves the standalone Audio Transcription Studio."""
    app_file = APPS_DIR / "audio-transcription" / "index.html"
    if app_file.exists():
        return HTMLResponse(content=app_file.read_text(encoding="utf-8"))
    
    fallback = STATIC_DIR / "index.html"
    if fallback.exists():
        return HTMLResponse(content=fallback.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>Audio Transcription Studio Loading...</h1>")


if __name__ == "__main__":
    import uvicorn
    print(f"[*] Starting MANO-LAB Server on http://{Config.SERVER_HOST}:{Config.SERVER_PORT}")
    print(f"[*] Homepage: http://{Config.SERVER_HOST}:{Config.SERVER_PORT}/")
    print(f"[*] Audio Transcription Studio: http://{Config.SERVER_HOST}:{Config.SERVER_PORT}/apps/audio-transcription/")
    uvicorn.run(app, host=Config.SERVER_HOST, port=Config.SERVER_PORT)
