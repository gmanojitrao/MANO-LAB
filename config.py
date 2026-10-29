"""
OmniScribe - Configuration and Environment Settings
Robust, Multi-Engine Audio Transcription Tool
"""

import os
import shutil
import sys
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent
DEFAULT_OUTPUT_DIR = BASE_DIR / "transcriptions_output"
DEFAULT_TEMP_DIR = BASE_DIR / "temp_processing"
ENV_FILE_PATH = BASE_DIR / ".env"

# Ensure essential directories exist
DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
DEFAULT_TEMP_DIR.mkdir(parents=True, exist_ok=True)

def find_ffmpeg_binary() -> tuple[str, str]:
    """
    Locates ffmpeg and ffprobe binaries on Windows or other OS.
    Checks PATH, Gyan.FFmpeg in WinGet, standard Windows paths, etc.
    Returns (ffmpeg_path, ffprobe_path)
    """
    # 1. System PATH
    ffmpeg = shutil.which("ffmpeg")
    ffprobe = shutil.which("ffprobe")
    if ffmpeg and ffprobe:
        return ffmpeg, ffprobe

    # 2. Check WinGet Packages
    local_app_data = os.environ.get("LOCALAPPDATA", "")
    if local_app_data:
        winget_dir = Path(local_app_data) / "Microsoft" / "WinGet" / "Packages"
        if winget_dir.exists():
            for root, _, files in os.walk(winget_dir):
                if "ffmpeg.exe" in files:
                    found_ffmpeg = os.path.join(root, "ffmpeg.exe")
                    found_ffprobe = os.path.join(root, "ffprobe.exe")
                    if os.path.exists(found_ffmpeg) and os.path.exists(found_ffprobe):
                        bin_dir = str(Path(found_ffmpeg).parent)
                        if bin_dir not in os.environ["PATH"]:
                            os.environ["PATH"] = bin_dir + os.pathsep + os.environ["PATH"]
                        return found_ffmpeg, found_ffprobe

    # 3. Check common paths
    common_paths = [
        Path("C:/ffmpeg/bin"),
        Path("C:/Program Files/ffmpeg/bin"),
        Path(local_app_data) / "Programs" / "ffmpeg" / "bin",
    ]
    for c_path in common_paths:
        f = c_path / "ffmpeg.exe"
        p = c_path / "ffprobe.exe"
        if f.exists() and p.exists():
            bin_dir = str(c_path)
            if bin_dir not in os.environ["PATH"]:
                os.environ["PATH"] = bin_dir + os.pathsep + os.environ["PATH"]
            return str(f), str(p)

    return ("ffmpeg", "ffprobe")

FFMPEG_PATH, FFPROBE_PATH = find_ffmpeg_binary()

# Configure pydub to use the discovered ffmpeg
try:
    import pydub
    from pydub import AudioSegment
    AudioSegment.converter = FFMPEG_PATH
    AudioSegment.ffmpeg = FFMPEG_PATH
    AudioSegment.ffprobe = FFPROBE_PATH
except ImportError:
    pass

# Supported media extensions (Audio + Video containers)
SUPPORTED_AUDIO_EXTENSIONS = {
    ".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg", ".opus", 
    ".wma", ".aiff", ".aif", ".alac", ".pcm"
}

SUPPORTED_VIDEO_EXTENSIONS = {
    ".mp4", ".mkv", ".mov", ".webm", ".avi", ".ts", ".wmv", ".flv", ".3gp"
}

ALL_SUPPORTED_EXTENSIONS = SUPPORTED_AUDIO_EXTENSIONS.union(SUPPORTED_VIDEO_EXTENSIONS)

def load_dotenv():
    """Simple, reliable .env file loader without third-party requirement."""
    if ENV_FILE_PATH.exists():
        with open(ENV_FILE_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip("'\"")
                if k and k not in os.environ:
                    os.environ[k] = v

load_dotenv()

# API Keys and Engine Defaults
class Config:
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
    
    DEFAULT_ENGINE = os.environ.get("OMNISCRIBE_ENGINE", "gemini")
    DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite"  # Active 2026 ultra-fast model
    DEFAULT_GROQ_MODEL = "whisper-large-v3"
    DEFAULT_OPENAI_MODEL = "whisper-1"
    
    # Audio preprocessing parameters
    TARGET_SAMPLE_RATE = 16000
    TARGET_CHANNELS = 1  # Mono
    DEFAULT_DENOISE_MODE = "auto"  # 'auto', 'mild', 'aggressive', 'none'
    
    # Chunking parameters (in minutes)
    DEFAULT_CHUNK_DURATION_MINUTES = 10  # Auto split if longer than 10 mins
    SILENCE_THRESHOLD_DB = -38
    MIN_SILENCE_LEN_MS = 600  # Split on silences longer than 600ms
    OVERLAP_MS = 250
    
    SERVER_HOST = "127.0.0.1"
    SERVER_PORT = 8000

    @classmethod
    def save_api_key(cls, provider: str, key: str):
        """Save API key to .env file and environment."""
        provider = provider.upper()
        env_var = f"{provider}_API_KEY"
        os.environ[env_var] = key
        
        # Read existing .env
        lines = []
        if ENV_FILE_PATH.exists():
            with open(ENV_FILE_PATH, "r", encoding="utf-8") as f:
                lines = f.readlines()
        
        found = False
        new_lines = []
        for line in lines:
            if line.strip().startswith(f"{env_var}="):
                new_lines.append(f"{env_var}={key}\n")
                found = True
            else:
                new_lines.append(line)
        if not found:
            new_lines.append(f"{env_var}={key}\n")
            
        with open(ENV_FILE_PATH, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
            
        if provider == "GEMINI":
            cls.GEMINI_API_KEY = key
        elif provider == "GROQ":
            cls.GROQ_API_KEY = key
        elif provider == "OPENAI":
            cls.OPENAI_API_KEY = key
