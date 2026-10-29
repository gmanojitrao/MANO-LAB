# OmniScribe AI Studio (MANO-LAB)

> **High-Fidelity AI Audio Transcription, Speaker Diarization, Multi-Folder Artisan Synthesis, and Side-by-Side Bilingual Dossier Generation.**

Deployed on **Cloudflare Pages** & powered by **FastAPI + Google Gemini / Groq Whisper / OpenAI**.

---

## 🌟 Key Features

1. **Native Script & Pure English Diarization**
   - Transcribes spoken audio preserving authentic regional languages (Hindi, Bengali, Maithili, etc.) in native script.
   - Provides a clean, genuine English translation side-by-side with zero omissions or additions.
   - Accurately detects and attributes speakers (`Interviewer` vs. `Artisan / Interviewee`).

2. **Cross-Folder Artisan Grouping**
   - Scans 100+ nested folders and automatically consolidates all interview sections belonging to the same artisan.
   - Generates unified field dossiers per artisan across sessions and interviewers.

3. **Master Consolidated Field Reports**
   - Multi-format exports: Word (`.docx`), PDF (`.pdf`), Markdown (`.md`), and Plain Text (`.txt`).
   - One-click downloads for individual artisan dossiers and complete master archives (`.zip`).

4. **Modern Responsive UI (Light & Dark Mode)**
   - Side-by-side bilingual reading modal.
   - Real-time progress tracking with automatic background polling.
   - Drag-and-drop support for folders and individual audio files.

5. **Cloudflare Pages Ready**
   - Instant deployment to Cloudflare Pages directly from this repository root (`index.html`).
   - Built-in remote backend routing (`API_BASE`) to connect to your local server or Cloudflare Tunnel.

---

## 🚀 Quick Start (Local Run)

### 1. Install Dependencies
Ensure you have Python 3.10+ and FFmpeg installed.
```bash
pip install -r requirements.txt
```

### 2. Configure API Keys
Copy `.env.example` to `.env` or enter your keys directly in the Web UI Settings:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Launch the Server
Double-click `start_omniscribe.bat` or run:
```bash
python server.py
```
Open your browser at `http://127.0.0.1:8000`.

---

## ☁️ Cloudflare Pages Deployment

This repository is structured for **zero-configuration deployment on Cloudflare Pages**:
- **Build Output Directory:** `/` (Root directory where `index.html` is located)
- **Framework Preset:** `None`

### Connecting Cloudflare Pages to Your Backend
When using the web interface hosted on Cloudflare Pages (e.g. `https://mano-lab.pages.dev`), configure your backend URL:
1. Click the **Settings (Gear Icon)** in the top navigation bar.
2. Under **Backend Server URL**, enter your server address:
   - For local use on the same machine: `http://127.0.0.1:8000`
   - For remote access: your Cloudflare Tunnel URL (e.g. `https://api.yourdomain.com`)
3. Click **Save Keys & Settings**.

---

## 🛠 Project Architecture

```
MANO-LAB/
├── index.html               # Production frontend for Cloudflare Pages
├── static/
│   └── index.html           # Local static asset copy for FastAPI
├── server.py                # FastAPI REST API & background worker server
├── transcription_engine.py  # Gemini, Groq, Whisper engines & diarization logic
├── artisan_organizer.py     # Cross-folder entity clustering & section collation
├── document_generator.py    # ReportLab PDF & python-docx dossier builders
├── audio_processor.py       # Audio inspection, conversion, denoising & chunking
├── batch_orchestrator.py    # Multi-file batch queue manager
├── config.py                # System settings & environment validation
├── omniscribe_cli.py        # Command-line interface
├── start_omniscribe.bat     # Windows one-click launcher
├── requirements.txt         # Python package dependencies
├── _headers                 # Cloudflare Pages CORS & security headers
└── .gitignore               # Strict exclusion of raw audio, caches & secrets
```

---

## 📄 License
MIT License. Created by [gmanojitrao](https://github.com/gmanojitrao).
