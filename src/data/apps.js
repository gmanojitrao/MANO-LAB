/**
 * MANO-LAB Application Registry
 * Curated Collection: Flagship AI Transcription, Focus Soundscapes, and Classic Games.
 */

const MANO_APPS = [
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
    accentColor: "#3b82f6",
    tags: ["Speech-to-Text", "Diarization", "Bilingual", "Dossier Export"],
    badge: "Flagship Application"
  },
  {
    id: "axioma",
    name: "AXIOMA: The Autonomous Civilization",
    tagline: "Enter a non-biological virtual universe where sentient geometric beings live and evolve",
    description: "A civilization that never existed in our reality. Free from carbon, gravity, sunlight, and mortality. Witness self-organizing conscious polyhedra that graze on quantum entropy, converse via moiré light interference, synthesize new life through harmonic resonance, and erect celestial spires in a continuous tensor lattice. Step in as the Creator or silent observer.",
    category: "Virtual Cosmos",
    route: "apps/axioma/",
    status: "Available",
    featured: true,
    emoji: "🌌",
    accentColor: "#38bdf8",
    tags: ["Autonomous Civilization", "Artificial Life", "Non-Earth Reality", "God Mode"],
    badge: "Transcendental Cosmos"
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
    accentColor: "#ec4899",
    tags: ["Living Art", "Light Weaving", "Generative", "4K Export"],
    badge: "Original Art Form"
  },
  {
    id: "focus-ambient",
    name: "Focus Ambient",
    tagline: "Generative soundscapes & minimalist Pomodoro timer",
    description: "Procedural acoustic environments. Mix gentle rain, crackling fireplace, ocean surf, and 40Hz binaural focus frequencies in real-time with zero external audio files.",
    category: "Productivity",
    route: "apps/focus-ambient/",
    status: "Available",
    featured: true,
    emoji: "🎧",
    accentColor: "#10b981",
    tags: ["Rain", "Fireplace", "Soundscapes", "Pomodoro"],
    badge: "Acoustic Tool"
  },
  {
    id: "turbo-typist",
    name: "Turbo Typist",
    tagline: "High-speed typing competition on a 3D speedway track",
    description: "Floor the gas pedal with your keyboard! Type with speed and accuracy to accelerate your GT supercar, ignite nitro flames, overtake AI rivals, and claim the championship podium.",
    category: "Classic Games",
    route: "apps/turbo-typist/",
    status: "Available",
    featured: true,
    emoji: "🏎️",
    accentColor: "#ef4444",
    tags: ["Typing Racer", "WPM Speedometer", "Nitro Boost", "Championship"],
    badge: "New Racing Game"
  },
  {
    id: "snake",
    name: "Classic Snake",
    tagline: "The iconic retro grid arcade game",
    description: "Clean, responsive implementation of the classic arcade favorite. Guide the snake, gather apples, avoid boundaries, and compete for top personal high scores.",
    category: "Classic Games",
    route: "apps/snake/",
    status: "Available",
    featured: false,
    emoji: "🐍",
    accentColor: "#22c55e",
    tags: ["Retro Arcade", "High Score", "Responsive"],
    badge: "Arcade Classic"
  },
  {
    id: "breakout",
    name: "Brick Breaker",
    tagline: "Paddle-and-ball brick destruction arcade",
    description: "Smooth paddle physics, multi-tier rainbow brick walls, score multipliers, and 3-life challenge. Playable with mouse, touch, or arrow keys.",
    category: "Classic Games",
    route: "apps/breakout/",
    status: "Available",
    featured: false,
    emoji: "🕹️",
    accentColor: "#3b82f6",
    tags: ["Brick Breaker", "Paddle Physics", "Arcade"],
    badge: "Arcade Classic"
  },
  {
    id: "game-2048",
    name: "Classic 2048",
    tagline: "The beloved number sliding puzzle",
    description: "Authentic Gabriele Cirulli design with warm beige tiles, smooth sliding animations, touch swipe support for mobile, and automatic high-score preservation.",
    category: "Classic Games",
    route: "apps/game-2048/",
    status: "Available",
    featured: false,
    emoji: "🎲",
    accentColor: "#edc22e",
    tags: ["Puzzle", "Number Slide", "Brain Game"],
    badge: "Arcade Classic"
  },
  {
    id: "flappy-bird",
    name: "Flappy Bird",
    tagline: "The timeless one-tap obstacle flight game",
    description: "Tap the screen or hit Spacebar to flap wings, glide through green pipe columns, and beat your best streak. Simple, clean, and endlessly replayable.",
    category: "Classic Games",
    route: "apps/flappy-bird/",
    status: "Available",
    featured: false,
    emoji: "🐥",
    accentColor: "#facc15",
    tags: ["One-Tap", "Reaction", "Instant Restart"],
    badge: "Arcade Classic"
  }
];

const MANO_CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "Virtual Cosmos", label: "🌌 Virtual Cosmos" },
  { id: "Speech & AI", label: "🎙️ Speech & AI" },
  { id: "Creative & Art", label: "✨ Creative & Art" },
  { id: "Productivity", label: "🎧 Productivity" },
  { id: "Classic Games", label: "🕹️ Classic Games" }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MANO_APPS, MANO_CATEGORIES };
} else {
  window.MANO_APPS = MANO_APPS;
  window.MANO_CATEGORIES = MANO_CATEGORIES;
}
