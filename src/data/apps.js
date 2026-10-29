/**
 * MANO-LAB Central Application & Experiment Registry
 * 
 * To register a new app or experiment:
 * 1. Create a dedicated folder under /apps/[your-app-name]/ with an index.html
 * 2. Add an entry to the MANO_APPS array below
 * 3. The homepage directory and search will automatically render the card!
 */

const MANO_APPS = [
  {
    id: "audio-transcription",
    name: "Audio Transcription",
    tagline: "High-Fidelity Regional Speech Diarization",
    description: "Converts audio recordings into accurate text with speaker diarization, native script preservation (Hindi, Bengali, etc.), and side-by-side English translation.",
    category: "Productivity",
    route: "apps/audio-transcription/",
    status: "Available",
    featured: true,
    dateAdded: "2026-10-29",
    icon: "mic",
    version: "2.0",
    tags: ["Speech-to-Text", "Diarization", "Bilingual", "Dossier Generator"],
    accentColor: "#ccff00",
    capabilities: [
      "Interviewer vs. Artisan Speaker Recognition",
      "Native Script & Genuine English Columns",
      "Consolidated Word (DOCX) & PDF Exports",
      "Automated Noise Reduction & Multi-Folder Batching"
    ],
    links: {
      open: "apps/audio-transcription/",
      source: "https://github.com/gmanojitrao/MANO-LAB/tree/main/apps/audio-transcription"
    }
  },
  {
    id: "spectra-synth",
    name: "SpectraSynth Audio Lab",
    tagline: "Real-time FFT Spectral Synthesizer & Oscilloscope",
    description: "An interactive browser-based acoustic workbench for frequency modulation, harmonic series visualization, and live waveform sculpting.",
    category: "Audio",
    route: "apps/spectra-synth/",
    status: "Coming Soon",
    featured: false,
    dateAdded: "2026-11-05",
    icon: "activity",
    version: "0.9b",
    tags: ["WebAudio", "DSP", "FFT Analyzer", "Synthesizer"],
    accentColor: "#38bdf8",
    capabilities: [
      "Polyphonic WebAudio Oscillator Engine",
      "High-Resolution 60FPS Waterfall Spectrogram",
      "Custom Microtonal Tuning Presets"
    ],
    links: {
      open: "#",
      source: "#"
    }
  },
  {
    id: "prompt-canvas",
    name: "PromptCanvas Studio",
    tagline: "Visual Flowchart & Prompt Architecture Workbench",
    description: "Node-based visual playground to chain, test, and benchmark multi-stage LLM prompts, fallback behaviors, and schema validators.",
    category: "Creative Tools",
    route: "apps/prompt-canvas/",
    status: "Coming Soon",
    featured: false,
    dateAdded: "2026-11-12",
    icon: "layout",
    version: "0.1a",
    tags: ["LLM Tooling", "Workflow", "Node Graph", "Evaluation"],
    accentColor: "#f43f5e",
    capabilities: [
      "Visual Directed Acyclic Graph (DAG) Editor",
      "JSON Schema Output Validation Testing",
      "Local-First Browser Cache Execution"
    ],
    links: {
      open: "#",
      source: "#"
    }
  },
  {
    id: "chrono-flow",
    name: "ChronoFlow Chronometer",
    tagline: "High-Precision Interval Matrix & Deep Work Tracker",
    description: "Minimalist, keyboard-driven productivity timer incorporating logarithmic work blocks, ambient acoustic masking, and session export.",
    category: "Productivity",
    route: "apps/chrono-flow/",
    status: "Coming Soon",
    featured: false,
    dateAdded: "2026-11-20",
    icon: "clock",
    version: "0.5a",
    tags: ["Productivity", "Deep Work", "Minimalist", "Offline"],
    accentColor: "#a855f7",
    capabilities: [
      "Adaptive Micro-Break Calculations",
      "Zero-Distraction Dark Mode Canvas",
      "CSV & Markdown Activity Export"
    ],
    links: {
      open: "#",
      source: "#"
    }
  },
  {
    id: "neural-cellular",
    name: "Cellular Automata Lab",
    tagline: "Continuous Emergence & Pattern Sandbox",
    description: "Interactive simulation laboratory exploring Conway variants, reaction-diffusion Turing patterns, and emergent grid morphogenesis.",
    category: "Experiments",
    route: "apps/cellular-automata/",
    status: "Experimental",
    featured: false,
    dateAdded: "2026-11-28",
    icon: "grid",
    version: "0.2a",
    tags: ["Generative", "Canvas", "Simulation", "Math"],
    accentColor: "#10b981",
    capabilities: [
      "GPU-Accelerated 2D Fluid-Grid Renderer",
      "Interactive Brush & Perturbation Physics",
      "Preset Genetic Code State Library"
    ],
    links: {
      open: "#",
      source: "#"
    }
  }
];

// Categories definition for directory filtering
const MANO_CATEGORIES = [
  { id: "all", label: "All Items", count: 5 },
  { id: "Productivity", label: "Productivity", count: 2 },
  { id: "Audio", label: "Audio & Acoustics", count: 1 },
  { id: "Creative Tools", label: "Creative Tools", count: 1 },
  { id: "Experiments", label: "Experiments", count: 1 }
];

// Export for ES modules and browser global window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MANO_APPS, MANO_CATEGORIES };
} else {
  window.MANO_APPS = MANO_APPS;
  window.MANO_CATEGORIES = MANO_CATEGORIES;
}
