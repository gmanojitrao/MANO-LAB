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

## 🔬 Curated Application Suite

MANO-LAB focuses on high-utility tools and timeless arcade games:

### 🎙️ Flagship Application
1. **Audio Transcription Studio (`apps/audio-transcription/`):** Enterprise-grade multilingual speech-to-text studio with automatic speaker diarization, bilingual Indic script preservation (Hindi, Bengali, Maithili), and instant dossier generation in Word (`.docx`), PDF, and Markdown.

### 🌌 Autonomous Virtual Universe
2. **AXIOMA (`apps/axioma/`):** An autonomous virtual civilization that never existed. Free from carbon, gravity, sunlight, and mortality. Features self-organizing conscious polyhedra that graze on quantum entropy, converse via moiré light interference, synthesize new life through harmonic resonance, and erect celestial spires across a continuous tensor lattice. Complete with live thought telemetry feed, entity inspector, and God-mode creator powers.

### ✨ Original Art Form (Born from Nothing)
3. **Aether-Weave (`apps/aether-weave/`):** An original living art medium. Paint not with static pigment, but with multi-dimensional vibrating ribbons of refractive light that breathe, entangle with magnetic gossamer bridges, shift with thin-film optical dispersion, sing with 432Hz crystalline acoustic resonance, and export to pristine 4K wallpapers.

### 🎧 Acoustic Focus
4. **Focus Ambient (`apps/focus-ambient/`):** Procedural WebAudio soundscape generator (rain, fireplace, ocean waves, 40Hz binaural beats) with integrated Pomodoro focus timer.

### 🏎️ Racing & Typing Competition
5. **Turbo Typist (`apps/turbo-typist/`):** High-speed typing racer on a 3D perspective speedway track. Accelerate your GT supercar by typing fast and accurately, trigger nitro exhaust flames on streaks, overtake AI rivals, and claim the championship podium with live WPM telemetry.

### 🕹️ Classic Arcade Games
6. **Classic Snake (`apps/snake/`):** The iconic retro grid game with apple gathering, smooth responsive controls, and high-score tracking.
7. **Brick Breaker (`apps/breakout/`):** Multi-tier rainbow brick destruction with smooth paddle physics, 3-life challenge, and combo scoring.
8. **Classic 2048 (`apps/game-2048/`):** Authentic Gabriele Cirulli number sliding puzzle with warm beige tiles, touch swipe support, and score memory.
9. **Flappy Bird (`apps/flappy-bird/`):** The timeless one-tap obstacle flight game with daytime sky, green pipes, and instant restart.

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
