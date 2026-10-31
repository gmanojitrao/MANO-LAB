/**
 * VISUAL STORY GENERATOR - MANO LAB
 * audio-engine.js - Procedural Cinematic Score, Sound FX, & AI Voiceover Narration
 */

class StoryAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.destinationNode = null; // For video recording capture

    this.isBgmPlaying = false;
    this.bgmTheme = 'mythic-epic';
    this.activeBgmNodes = [];
    this.bgmTimer = null;

    // Speech Synthesis state
    this.synth = window.speechSynthesis || null;
    this.availableVoices = [];
    this.selectedVoice = null;
    this.pitch = 0.95; // Slightly deeper narrator tone
    this.rate = 1.0;
    this.currentWordCallback = null;
    this.isSpeaking = false;

    this.initVoices();
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master audio path
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Dedicated media stream destination for canvas recording
      this.destinationNode = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.connect(this.destinationNode);
    } catch (e) {
      console.warn('Web Audio API initialization note:', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initVoices() {
    if (!this.synth) return;
    const populate = () => {
      this.availableVoices = this.synth.getVoices();
      // Prefer Hindi or Indian English or deep male narrator voices
      const preferred = this.availableVoices.find(v => 
        v.lang === 'hi-IN' || v.lang === 'en-IN' || v.name.includes('Hindi') || v.name.includes('India')
      ) || this.availableVoices.find(v => v.lang.startsWith('en')) || this.availableVoices[0];
      
      this.selectedVoice = preferred;
    };

    populate();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = populate;
    }
  }

  getVoices() {
    return this.availableVoices;
  }

  setVoice(voiceURI) {
    const v = this.availableVoices.find(item => item.voiceURI === voiceURI);
    if (v) this.selectedVoice = v;
  }

  /**
   * Speak narration line with synchronized real-time word boundary callback
   */
  speakNarration(text, lang = 'hi-IN', onWord = null, onEnd = null) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stopNarration();
    this.ensureContext();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.pitch = this.pitch;
    utterance.rate = this.rate;

    // Track word boundaries for live karaoke caption synchronization
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const charIndex = e.charIndex;
        if (onWord) onWord(charIndex);
      }
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.isSpeaking = true;
    this.synth.speak(utterance);
  }

  stopNarration() {
    if (this.synth && (this.synth.speaking || this.synth.pending)) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Procedural Cinematic Background Score Generator
   */
  startBgm(theme = 'mythic-epic') {
    this.ensureContext();
    this.stopBgm();
    this.bgmTheme = theme;
    this.isBgmPlaying = true;

    const now = this.ctx.currentTime;
    this.activeBgmNodes = [];

    if (theme === 'mythic-epic') {
      // 1. Deep Cosmic Tanpura Drone (Fundamental 108Hz + Overtones)
      const droneOsc = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(108, now); // Sacred Indian fundamental pitch

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      droneGain.gain.setValueAtTime(0.001, now);
      droneGain.gain.linearRampToValueAtTime(0.22, now + 1.5);

      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.bgmGain);
      droneOsc.start(now);
      this.activeBgmNodes.push(droneOsc, droneGain);

      // Fifth overtone (Pa - 162Hz)
      const fifthOsc = this.ctx.createOscillator();
      const fifthGain = this.ctx.createGain();
      fifthOsc.type = 'triangle';
      fifthOsc.frequency.setValueAtTime(162, now);
      fifthGain.gain.setValueAtTime(0.001, now);
      fifthGain.gain.linearRampToValueAtTime(0.12, now + 2.0);

      fifthOsc.connect(fifthGain);
      fifthGain.connect(this.bgmGain);
      fifthOsc.start(now);
      this.activeBgmNodes.push(fifthOsc, fifthGain);

      // 2. Rhythmic Damru / Epic War Drum Loop
      let step = 0;
      this.bgmTimer = setInterval(() => {
        if (!this.isBgmPlaying) return;
        step++;
        // Downbeat on step 1, syncopated damru doublet on step 3 & 4
        if (step % 4 === 1) {
          this.playDrumHit(65, 0.5, 0.45); // Deep sub kick
        } else if (step % 4 === 3) {
          this.playDamruSnap(340, 0.15, 0.25);
        } else if (step % 8 === 0) {
          this.playCymbalWash();
        }
      }, 550); // ~110 BPM cinematic pacing
    } else {
      // Cosmic Drone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(72, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 1.2);
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(now);
      this.activeBgmNodes.push(osc, gain);
    }
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    for (let node of this.activeBgmNodes) {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    }
    this.activeBgmNodes = [];
  }

  playDrumHit(pitch, decay, vol) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch * 2, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, now + decay);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decay);

    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(now);
    osc.stop(now + decay);
  }

  playDamruSnap(pitch, decay, vol) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.linearRampToValueAtTime(pitch * 1.5, now + decay * 0.5);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decay);

    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(now);
    osc.stop(now + decay);
  }

  playCymbalWash() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // High passed white noise burst
    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5000, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  /**
   * Sound FX for scene transitions and impact beats
   */
  playWhoosh() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.6);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(1600, now + 0.3);
    filter.Q.setValueAtTime(3.0, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  playImpact() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sub Boom
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.8);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.9);
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.StoryAudioEngine = StoryAudioEngine;
}
