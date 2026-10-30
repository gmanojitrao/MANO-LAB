/**
 * MANO-LAB Central Application & Experiment Registry
 */

const MANO_APPS = [
  {
    id: "audio-transcription",
    name: "Audio Transcription",
    tagline: "Speech-to-text with bilingual dialogue & speaker detection",
    description: "Converts audio recordings into accurate text with speaker diarization, native script preservation (Hindi, Bengali, etc.), and side-by-side English translation.",
    category: "Productivity",
    route: "apps/audio-transcription/",
    status: "Available",
    featured: true,
    emoji: "🎙️",
    accentColor: "#c8ff00",
    tags: ["Speech-to-Text", "Diarization", "Bilingual", "Dossier Generator"],
    badge: "Flagship App"
  },
  {
    id: "cyber-snake",
    name: "Cyber Snake",
    tagline: "Neon arcade snake with speed combos & particle sparks",
    description: "Classic snake reimagined with vibrant neon trails, eating combos, speed bursts, on-screen D-pad for mobile, and local high-score tracking.",
    category: "Games",
    route: "apps/cyber-snake/",
    status: "Available",
    featured: true,
    emoji: "🐍",
    accentColor: "#c8ff00",
    tags: ["Arcade", "Snake", "High Scores", "Retro"],
    badge: "Retro Arcade"
  },
  {
    id: "neon-breakout",
    name: "Neon Breakout",
    tagline: "Smash neon bricks with ball trails & explosion physics",
    description: "Fast-paced arcade brick breaker with responsive paddle, combo counters, bouncy particle physics, retro sound FX, and lives tracking.",
    category: "Games",
    route: "apps/neon-breakout/",
    status: "Available",
    featured: true,
    emoji: "🕹️",
    accentColor: "#f43f5e",
    tags: ["Breakout", "Brick Breaker", "Combos", "Arcade"],
    badge: "Action Game"
  },
  {
    id: "game-2048",
    name: "2048 Neon",
    tagline: "Slide glowing neon tiles to reach the 2048 tile",
    description: "The addictive sliding puzzle with smooth neon animations, swipe gestures for phone, arrow key controls, merge sound FX, and best score memory.",
    category: "Games",
    route: "apps/game-2048/",
    status: "Available",
    featured: true,
    emoji: "🎲",
    accentColor: "#fbbf24",
    tags: ["Puzzle", "2048", "High Score", "Brain Game"],
    badge: "Classic Puzzle"
  },
  {
    id: "cyber-flap",
    name: "Cyber Flap",
    tagline: "Fly through glowing cyber gates with one-tap thrusters",
    description: "A fast, neon obstacle flyer. Tap screen or hit Space to fire thrusters, dodge electric gate pillars, and compete for the top high score.",
    category: "Games",
    route: "apps/cyber-flap/",
    status: "Available",
    featured: true,
    emoji: "🚀",
    accentColor: "#38bdf8",
    tags: ["Flappy", "One-Tap", "Reaction", "Arcade"],
    badge: "High Score"
  },
  {
    id: "synth-pad",
    name: "SynthPad",
    tagline: "Interactive musical keyboard & beat pad synthesizer",
    description: "Play live synth notes with your computer keys (A-K), trigger 4 punchy drum pads (Kick, Snare, Hi-Hat, Zap), and watch live 60FPS oscilloscope waveforms.",
    category: "Creative & Music",
    route: "apps/synth-pad/",
    status: "Available",
    featured: true,
    emoji: "🎹",
    accentColor: "#a855f7",
    tags: ["Synthesizer", "Keyboard", "Drum Pads", "Oscilloscope"],
    badge: "Super Fun"
  },
  {
    id: "palette-studio",
    name: "Palette Studio",
    tagline: "Hit Spacebar to roll gorgeous color palettes instantly",
    description: "An interactive color playground. Shuffle random harmonic palettes, lock colors you love, and click any color to copy its HEX code instantly.",
    category: "Creative & Music",
    route: "apps/palette-studio/",
    status: "Available",
    featured: true,
    emoji: "🎨",
    accentColor: "#f43f5e",
    tags: ["Colors", "Design", "Hex Codes", "Interactive"],
    badge: "Interactive Toy"
  },
  {
    id: "focus-ambient",
    name: "Focus Ambient",
    tagline: "Generative soundscapes & minimalist Pomodoro timer",
    description: "Mix gentle rain, crackling fireplace, ocean waves, and 40Hz binaural focus beats in real-time. Built entirely with the WebAudio API.",
    category: "Audio & Focus",
    route: "apps/focus-ambient/",
    status: "Available",
    featured: true,
    emoji: "🎧",
    accentColor: "#38bdf8",
    tags: ["Rain", "Fireplace", "Soundscapes", "Pomodoro"],
    badge: "Procedural Audio"
  },
  {
    id: "image-forge",
    name: "Image Forge",
    tagline: "Fast client-side image resizer, compressor & converter",
    description: "Drop any photo to crop, resize, adjust quality, and convert between WebP, PNG, and JPEG with zero server uploads. 100% private.",
    category: "Utilities",
    route: "apps/image-forge/",
    status: "Available",
    featured: false,
    emoji: "⚡",
    accentColor: "#fbbf24",
    tags: ["Image Compressor", "WebP", "Resize", "Zero-Upload"],
    badge: "100% Private"
  },
  {
    id: "qr-studio",
    name: "QR Studio",
    tagline: "Generate stylish custom QR codes in one click",
    description: "Type any link or text to generate a clean, high-resolution QR code with custom colors and instant PNG download.",
    category: "Utilities",
    route: "apps/qr-studio/",
    status: "Available",
    featured: false,
    emoji: "📱",
    accentColor: "#34d399",
    tags: ["QR Code", "Vector", "Instant Export", "Offline"],
    badge: "Useful Tool"
  },
  {
    id: "markdown-studio",
    name: "Markdown Studio",
    tagline: "Distraction-free markdown writing & live preview",
    description: "Clean split-view note editor with live formatting, word counter, reading time estimator, and one-click file download.",
    category: "Productivity",
    route: "apps/markdown-studio/",
    status: "Available",
    featured: false,
    emoji: "📝",
    accentColor: "#38bdf8",
    tags: ["Markdown", "Notes", "Writing", "Live Preview"],
    badge: "Distraction-Free"
  },
  {
    id: "text-tools",
    name: "Text Morph",
    tagline: "Clean, format, beautify JSON, and transform text",
    description: "Quick utilities to format messy JSON, deduplicate lines, convert case, encode/decode Base64, and count words with live stats.",
    category: "Utilities",
    route: "apps/text-tools/",
    status: "Available",
    featured: false,
    emoji: "🔤",
    accentColor: "#c084fc",
    tags: ["JSON Beautifier", "Word Counter", "Base64", "Formatter"],
    badge: "Developer Tool"
  }
];

const MANO_CATEGORIES = [
  { id: "all", label: "All Apps & Games" },
  { id: "Games", label: "🎮 Games" },
  { id: "Productivity", label: "🎙️ Productivity" },
  { id: "Creative & Music", label: "🎨 Creative & Music" },
  { id: "Audio & Focus", label: "🎧 Audio & Focus" },
  { id: "Utilities", label: "🛠️ Utilities" }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MANO_APPS, MANO_CATEGORIES };
} else {
  window.MANO_APPS = MANO_APPS;
  window.MANO_CATEGORIES = MANO_CATEGORIES;
}
