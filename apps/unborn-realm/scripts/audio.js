/**
 * PROJECT: THE UNBORN REALM (ORIGIN-001)
 * audio.js - Procedural Non-Earth Synthesizer
 * 
 * Generates continuous synthetic harmonic atmospheres tailored to each dimension
 * using pure Web Audio API oscillators, biquad filters, and convolution delays.
 * Zero external audio files required.
 */

class RealmAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = true;
    this.currentDimension = 'MANIFEST';
    this.nodes = [];
    this.activeDrones = [];
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    if (!this.ctx) return false;

    this.isMuted = !this.isMuted;
    const now = this.ctx.currentTime;

    if (this.isMuted) {
      this.masterGain.gain.setTargetAtTime(0.0001, now, 0.4);
    } else {
      if (this.activeDrones.length === 0) {
        this.startAtmosphere(this.currentDimension);
      }
      this.masterGain.gain.setTargetAtTime(0.25, now, 0.8);
    }
    return !this.isMuted;
  }

  setDimensionAtmosphere(dimId) {
    this.currentDimension = dimId;
    if (!this.ctx || this.isMuted) return;
    this.startAtmosphere(dimId);
  }

  clearDrones() {
    for (let d of this.activeDrones) {
      try {
        d.gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.5);
        setTimeout(() => {
          try { d.osc.stop(); d.osc.disconnect(); } catch (err) {}
        }, 800);
      } catch (e) {}
    }
    this.activeDrones = [];
  }

  startAtmosphere(dimId) {
    if (!this.ctx) return;
    this.clearDrones();

    const now = this.ctx.currentTime;

    // Harmonic frequency maps tailored to dimensions
    const DIM_FREQS = {
      UNFORMED: [54, 108, 162.4, 216.7], // Detuned, nascent low register
      WEAVE: [144, 216, 288, 432, 576],  // Filament fifths & octaves, bright
      MANIFEST: [108, 216, 324, 432],    // Solid crystalline 432Hz fundamental
      ECHO: [81, 121.5, 243, 364.5],     // Sub-sediment warmth
      UNSEEN: [93.2, 139.8, 186.4, 372.8]// Microtonal tritone anomalies
    };

    const freqs = DIM_FREQS[dimId] || DIM_FREQS.MANIFEST;

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Osc type
      if (dimId === 'UNFORMED') {
        osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250 + idx * 80, now);
      } else if (dimId === 'WEAVE') {
        osc.type = 'sine';
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.5, now);
        filter.Q.setValueAtTime(2.0, now);
      } else if (dimId === 'MANIFEST') {
        osc.type = idx === 0 ? 'sine' : 'triangle';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
      } else if (dimId === 'ECHO') {
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);
      } else { // UNSEEN
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'sine';
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(140, now);
      }

      osc.frequency.setValueAtTime(freq, now);

      // Subtle LFO drift
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.04 + idx * 0.03, now);
      lfoGain.gain.setValueAtTime(1.5, now);
      lfo.connect(osc.frequency);
      lfo.start();

      const targetGain = (0.08 / freqs.length) * (idx === 0 ? 1.6 : 1.0);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.setTargetAtTime(targetGain, now + 0.1, 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.activeDrones.push({ osc, gain, lfo });
    });
  }

  /**
   * Plays synthetic chord when an entity is inspected or interacts
   */
  playEntityResonance(category) {
    if (!this.ctx || this.isMuted) return;
    this.ensureContext();

    const now = this.ctx.currentTime;
    const baseFreqs = {
      Auraliths: [216, 432, 648],
      Veskari: [288, 384, 576],
      Oroth: [108, 162, 216],
      Nemori: [432, 648, 864],
      Ilyr: [256, 362, 512]
    }[category] || [216, 432];

    baseFreqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 / baseFreqs.length, now + 0.05 + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + i * 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.6);
    });
  }

  /**
   * Synthesizes procedural VARETH phonetic utterance
   */
  vocalizeGlyphPhonetic(phonetic) {
    if (!this.ctx || this.isMuted) return;
    this.ensureContext();

    const now = this.ctx.currentTime;
    // Map vowels and consonants into resonant formant peaks
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const pitch = 180 + (phonetic.charCodeAt(0) % 20) * 12;
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.3, now + 0.3);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450 + (phonetic.length * 80), now);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.RealmAudioEngine = RealmAudioEngine;
}
