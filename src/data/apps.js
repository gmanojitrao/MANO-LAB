/**
 * MANO-LAB Application Registry
 * Active Curated Public Suite: Audio Transcription, Aether-Weave, ManoDrop, SlideCraft, DocLens, and Visual Story Generator (Dev).
 * Note: Preserved applications remain in the codebase.
 */

// Master registry preserving all applications
const ALL_MANO_APPS = [
  {
    id: "audio-transcription",
    name: "Audio Transcription Studio",
    tagline: "Multilingual speech intelligence with speaker diarization & dossier export",
    description: "Enterprise-grade speech-to-text platform. Automatically separates Interviewer and Subject voices, preserves native regional scripts side-by-side with genuine English translation, and aggregates folder sessions into Word and PDF dossiers.",
    category: "Speech & AI",
    route: "apps/audio-transcription/",
    status: "Available",
    featured: true,
    emoji: "🎙️",
    accentColor: "#c25e38",
    tags: ["Speech-to-Text", "Diarization", "Bilingual", "Dossier Export"],
    badge: "Flagship Application"
  },
  {
    id: "p2p-transfer",
    name: "ManoDrop: Encrypted P2P Transfer",
    tagline: "Browser-to-browser encrypted file transfer with unlimited file size",
    description: "Direct peer-to-peer WebRTC file transfer with end-to-end DTLS-SRTP encryption. No size limits, zero server storage, live speed metrics, and instant room code connection.",
    category: "Productivity & Utilities",
    route: "apps/p2p-transfer/",
    status: "Available",
    featured: true,
    emoji: "⚡",
    accentColor: "#2e7d5b",
    tags: ["Encrypted", "WebRTC P2P", "Zero Server Storage", "Unlimited Size"],
    badge: "Encrypted P2P"
  },
  {
    id: "aether-weave",
    name: "Aether-Weave",
    tagline: "The living art form: weave breathing harmonic light ribbons in void space",
    description: "An original dynamic art medium born from nothing. Not paint on canvas, but multi-dimensional vibrating filaments of refractive light that undulate, intertwine with quantum gossamer bridges, shift with thin-film optical dispersion, and sing with crystalline acoustic resonance.",
    category: "Creative & Art",
    route: "apps/aether-weave/",
    status: "Available",
    featured: true,
    emoji: "✨",
    accentColor: "#c25e38",
    tags: ["Living Art", "Light Weaving", "Generative", "4K Export"],
    badge: "Original Art Form"
  },
  // Private Corner / Owner Apps (Preserved in codebase):
  {
    id: "dossier-reader",
    name: "DocLens: Dossier Reader",
    tagline: "Client-side PDF & text reader with dossier intelligence and narration",
    description: "Zero-cloud private document intelligence reader. Render PDFs, text, and markdown with instant full-text search, reading themes, automated metrics, scratchpad, and text-to-speech audio narration.",
    category: "Private",
    route: "apps/dossier-reader/",
    status: "Private Dev",
    featured: false,
    hidden: true,
    private: true,
    emoji: "📖",
    accentColor: "#2e7d5b",
    tags: ["Local PDF", "Dossier Summary", "TTS Narration", "Private Notes"],
    badge: "Private Suite"
  },
  {
    id: "slide-deck",
    name: "SlideCraft Studio",
    tagline: "WYSIWYG 16:9 presentation studio with Google Slides & PowerPoint tools",
    description: "Private slide deck editor with real-time canvas editing, multiple themes, and offline presentation.",
    category: "Private",
    route: "apps/slide-deck/",
    status: "Private Dev",
    featured: false,
    hidden: true,
    private: true,
    emoji: "📽️",
    accentColor: "#b45309"
  },
  {
    id: "visual-story-generator",
    name: "Visual Story Studio",
    tagline: "2.5D rigged character animation, real-time lip-sync & studio voice mastering",
    description: "Turn stories into cinematic animated 9:16 vertical shorts. Features sculpted rigged character archetypes with procedural breathing, eye blinking, dynamic audio-driven mouth lip-sync, in-browser studio microphone recording with warm mastering DSP, and 60 FPS video export.",
    category: "Private",
    route: "apps/visual-story-generator/",
    status: "Private Dev",
    featured: false,
    hidden: true,
    private: true,
    emoji: "🎬",
    accentColor: "#b45309",
    tags: ["Rigged Characters", "Real Lip-Sync", "Studio Voice", "9:16 Video Export"],
    badge: "Animation Studio"
  },
  // Preserved & hidden:
  {
    id: "lounge",
    name: "Private Room",
    tagline: "Private chat and multiplayer racing",
    description: "Private room with real-time P2P WebRTC chat and multiplayer Turbo Typist racing.",
    category: "Private",
    route: "apps/lounge/",
    status: "Hidden",
    featured: false,
    hidden: true
  },
  {
    id: "unborn-realm",
    name: "THE UNBORN REALM",
    tagline: "Persistent autonomous synthetic universe (ORIGIN-001)",
    description: "Non-Earth existence simulation across five dimensions.",
    category: "Virtual Cosmos",
    route: "apps/unborn-realm/",
    status: "Hidden",
    featured: false,
    hidden: true
  },
  {
    id: "axioma",
    name: "AXIOMA: The Autonomous Civilization",
    tagline: "Autonomous virtual civilization",
    description: "Virtual non-biological universe.",
    category: "Virtual Cosmos",
    route: "apps/axioma/",
    status: "Hidden",
    featured: false,
    hidden: true
  },
  {
    id: "focus-ambient",
    name: "Focus Ambient",
    tagline: "Generative soundscapes & Pomodoro timer",
    description: "Procedural acoustic environments.",
    category: "Productivity",
    route: "apps/focus-ambient/",
    status: "Hidden",
    featured: false,
    hidden: true
  },
  {
    id: "turbo-typist",
    name: "Turbo Typist",
    tagline: "High-speed typing competition",
    description: "Typing speedway racer.",
    category: "Classic Games",
    route: "apps/turbo-typist/",
    status: "Hidden",
    featured: false,
    hidden: true
  },
  {
    id: "snake",
    name: "Classic Snake",
    tagline: "Retro grid arcade game",
    description: "Classic snake game.",
    category: "Classic Games",
    route: "apps/snake/",
    status: "Hidden",
    featured: false,
    hidden: true
  },
  {
    id: "breakout",
    name: "Brick Breaker",
    tagline: "Paddle-and-ball arcade",
    description: "Classic brick breaker.",
    category: "Classic Games",
    route: "apps/breakout/",
    status: "Hidden",
    featured: false,
    hidden: true
  },
  {
    id: "game-2048",
    name: "Classic 2048",
    tagline: "Number sliding puzzle",
    description: "Classic 2048 puzzle.",
    category: "Classic Games",
    route: "apps/game-2048/",
    status: "Hidden",
    featured: false,
    hidden: true
  },
  {
    id: "flappy-bird",
    name: "Flappy Bird",
    tagline: "One-tap obstacle flight",
    description: "Classic flappy bird.",
    category: "Classic Games",
    route: "apps/flappy-bird/",
    status: "Hidden",
    featured: false,
    hidden: true
  }
];

// Active visible applications for the public homepage
const MANO_APPS = ALL_MANO_APPS.filter(app => !app.hidden);

// Private Corner / Owner Apps Suite
const PRIVATE_APPS = ALL_MANO_APPS.filter(app => app.hidden || app.private);

const MANO_CATEGORIES = [
  { id: "all", label: "All Creations" },
  { id: "Speech & AI", label: "🎙️ Speech & AI" },
  { id: "Creative & Art", label: "✨ Creative & Art" },
  { id: "Productivity & Utilities", label: "⚡ Productivity & Utilities" }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MANO_APPS, PRIVATE_APPS, MANO_CATEGORIES, ALL_MANO_APPS };
} else {
  window.MANO_APPS = MANO_APPS;
  window.PRIVATE_APPS = PRIVATE_APPS;
  window.MANO_CATEGORIES = MANO_CATEGORIES;
  window.ALL_MANO_APPS = ALL_MANO_APPS;
}
