# MANO-LAB — Digital Laboratory Framework

> **"Small ideas. Real experiments."**
> A curated digital laboratory of interactive web applications, acoustic tools, generative toys, and productivity utilities.

[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-f38020?logo=cloudflare&logoColor=white)](https://mano-lab.pages.dev)
[![Engine](https://img.shields.io/badge/Engine-Python%20%2F%20FastAPI-009688?logo=fastapi&logoColor=white)](#local-development)
[![Architecture](https://img.shields.io/badge/Architecture-Static--First%20Micro--Apps-c8ff00?logoColor=black)](#how-it-works)

---

## 🌟 Overview

MANO-LAB is built on a **static-first, modular micro-app framework** deployable directly to Cloudflare Pages edge CDN. Each application lives in its own self-contained directory under `/apps/`, while heavy computing (such as AI audio transcription, spectral denoising, and PDF dossier synthesis) connects to a local or remote Python engine.

---

## 🔬 Featured Application: Audio Transcription Studio

The first flagship application integrated into MANO-LAB is the **Audio Transcription Studio** (`apps/audio-transcription/`):
- **Speaker Diarization:** Distinguishes between Interviewers and Artisans/Interviewees.
- **Bilingual Preservation:** Side-by-side view featuring original native regional script (Hindi, Bengali, Maithili) and genuine English translation.
- **Cross-Folder Entity Aggregation:** Gathers multiple interview sections of the same artisan across 100+ folders into unified dossiers.
- **Multi-Format Exports:** 1-click downloads for Word (`.docx`), ReportLab PDF (`.pdf`), Markdown (`.md`), and raw text files.

---

## 📁 Repository Structure

```
MANO-LAB/
├── index.html                   # MANO-LAB Digital Laboratory Homepage
├── 404.html                     # Branded 404 error page for Cloudflare Pages
├── apps/
│   └── audio-transcription/     # Flagship Audio Transcription Studio
│       └── index.html           # Standalone transcription interface
├── src/
│   ├── data/
│   │   └── apps.js              # Central App & Experiment Registry (single source of truth)
│   ├── styles/
│   │   └── main.css             # Editorial dark charcoal & electric lime stylesheet
│   └── scripts/
│       └── lab.js               # Search, category filters, and directory controller
├── public/
│   └── assets/                  # Branding and static imagery
├── server.py                    # FastAPI server (serves homepage, apps & processing APIs)
├── start_lab.bat                # Windows 1-click launcher for MANO-LAB
├── start_omniscribe.bat         # Direct launcher for audio engine
├── transcription_engine.py      # Gemini, Groq, and Whisper diarization engine
├── audio_processor.py           # FFmpeg audio conversion, denoising & chunking
├── artisan_organizer.py         # Cross-folder artisan grouping & collation
├── document_generator.py        # PDF & Word dossier generator
├── config.py                    # Environment & configuration settings
├── requirements.txt             # Python dependencies
├── _headers                     # Cloudflare Pages CORS & security headers
└── .gitignore                   # Excludes raw audio, caches & environment secrets
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
Ensure you have Python 3.10+ and FFmpeg installed:
```bash
pip install -r requirements.txt
```

### 2. Configure API Keys
Create a `.env` file (or set keys directly in the Audio Transcription Web Settings):
```env
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
OPENAI_API_KEY=your_openai_key_here
```

### 3. Launch the Laboratory
Double-click `start_lab.bat` or run:
```bash
python server.py
```
- **Laboratory Homepage:** `http://127.0.0.1:8000/`
- **Audio Transcription Studio:** `http://127.0.0.1:8000/apps/audio-transcription/`

---

## ➕ How to Add a New App to MANO-LAB

MANO-LAB uses a **repeatable 2-step registration system**. You never need to touch the homepage HTML:

### Step 1: Create Your App Directory
Create a new folder under `apps/` with its own `index.html`:
```
apps/
  └── my-new-tool/
      └── index.html
```

### Step 2: Register in `src/data/apps.js`
Open `src/data/apps.js` and add an entry to the `MANO_APPS` array:
```javascript
{
  id: "my-new-tool",
  name: "My New Tool",
  tagline: "Ultra-fast utility for creative tasks",
  description: "Detailed description of what this experiment does.",
  category: "Creative Tools", // e.g. Productivity, Audio, Creative Tools, Experiments
  route: "apps/my-new-tool/",
  status: "Available",        // Available, Coming Soon, or Experimental
  featured: false,
  dateAdded: "2026-10-30",
  icon: "tool",
  version: "1.0",
  tags: ["Utility", "Canvas", "Fast"],
  accentColor: "#ccff00"
}
```

That's it! The homepage search, category filters, and card directory will automatically render your new app.

---

## ☁️ Cloudflare Pages Deployment

This repository is configured for zero-friction deployment on **Cloudflare Pages**:
- **Build preset:** None
- **Build output directory:** `/` (root directory)
- **Live URL:** [https://mano-lab.pages.dev/](https://mano-lab.pages.dev/)

---

## 📄 License
MIT License. Created by [Manojit Rao](https://github.com/gmanojitrao).
