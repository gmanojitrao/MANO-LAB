/**
 * VISUAL STORY GENERATOR - MANO LAB
 * scene-director.js - Cinematic Camera Director, Parallax Environment & Real-time Compositor
 */

class SceneDirector {
  constructor(canvas, characterRig, audioStudio) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.character = characterRig;
    this.audio = audioStudio;

    // 9:16 Vertical Viewport (540x960)
    this.width = 540;
    this.height = 960;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Camera Shot Mode: 'HERO_CLOSEUP', 'MEDIUM_ACTION', 'DUTCH_LOW_ANGLE', 'WIDE_ESTABLISHING'
    this.shotMode = 'MEDIUM_ACTION';
    this.camera = {
      x: 0,
      y: 0,
      scale: 1.0,
      rot: 0,
      targetScale: 1.0,
      targetY: 0
    };

    // Environment Theme: 'GOLDEN_TEMPLE', 'COSMIC_VOID', 'VOLCANIC_WAR', 'HIMALAYAN_SUMMIT'
    this.envTheme = 'GOLDEN_TEMPLE';

    // Subtitle state
    this.activeSubtitle = 'एक ही माँ के दो बेटे... शेषनाग और वासुकि!';
    this.highlightWords = ['एक', 'ही', 'माँ', 'के', 'दो', 'बेटे...', 'शेषनाग', 'और', 'वासुकि!'];
    this.activeWordIndex = 0;

    // Ambient floating embers & dust particles
    this.particles = [];
    this.initParticles(60);

    this.time = 0;
  }

  initParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 1.5 + Math.random() * 3.5,
        speedY: 0.5 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.8,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? 'rgba(250, 204, 21, ' : 'rgba(249, 115, 22, '
      });
    }
  }

  setShotMode(mode) {
    this.shotMode = mode;
    switch (mode) {
      case 'HERO_CLOSEUP':
        this.camera.targetScale = 1.95;
        this.camera.targetY = 160;
        break;
      case 'DUTCH_LOW_ANGLE':
        this.camera.targetScale = 1.35;
        this.camera.targetY = 40;
        this.camera.rot = -0.05;
        break;
      case 'WIDE_ESTABLISHING':
        this.camera.targetScale = 0.85;
        this.camera.targetY = -80;
        this.camera.rot = 0;
        break;
      default: // MEDIUM_ACTION
        this.camera.targetScale = 1.25;
        this.camera.targetY = 20;
        this.camera.rot = 0;
        break;
    }
  }

  setEnvironment(theme) {
    this.envTheme = theme;
  }

  /**
   * Main Scene Tick & Compositor Loop
   */
  render(dt) {
    this.time += dt;

    // 1. Get real-time lip-sync audio metrics
    const metrics = this.audio.getLipSyncMetrics();

    // 2. Update character skeletal physics and lip-sync
    this.character.update(dt, metrics.amplitude, metrics.frequency);

    // 3. Smooth Camera Interpolation
    this.camera.scale += (this.camera.targetScale - this.camera.scale) * 0.08;
    this.camera.y += (this.camera.targetY - this.camera.y) * 0.08;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // 4. Render Parallax Layer 1: Sky / Cosmic Atmosphere
    this.renderBackgroundSky(ctx);

    // 5. Render Parallax Layer 2: Midground Architectural Monoliths
    this.renderMidgroundArchitecture(ctx);

    // 6. Camera Transform for Character Layer
    ctx.save();
    ctx.translate(w / 2, h * 0.55 + this.camera.y);
    ctx.scale(this.camera.scale, this.camera.scale);
    ctx.rotate(this.camera.rot);

    // Render Real Character Rig
    this.character.render(ctx, 0, 0, 1.0);

    ctx.restore();

    // 7. Render Foreground Atmospheric Particles (Embers & Volumetric God-Rays)
    this.renderAtmosphericVFX(ctx, dt);

    // 8. Render Cinematic Edge Vignette
    this.renderCinematicVignette(ctx);

    // 9. Render Lower-Third Highlighted Subtitles
    this.renderCinematicSubtitles(ctx, metrics);
  }

  renderBackgroundSky(ctx) {
    const w = this.width;
    const h = this.height;
    const grad = ctx.createLinearGradient(0, 0, 0, h);

    if (this.envTheme === 'GOLDEN_TEMPLE') {
      grad.addColorStop(0, '#1c1032');
      grad.addColorStop(0.4, '#431407');
      grad.addColorStop(0.8, '#78350f');
      grad.addColorStop(1, '#0c0a09');
    } else if (this.envTheme === 'COSMIC_VOID') {
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#090514');
    } else if (this.envTheme === 'VOLCANIC_WAR') {
      grad.addColorStop(0, '#18181b');
      grad.addColorStop(0.5, '#450a0a');
      grad.addColorStop(1, '#7f1d1d');
    } else { // HIMALAYAN_SUMMIT
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#0284c7');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Celestial Sun / Halo in Background
    const sunY = h * 0.32;
    const sunGrad = ctx.createRadialGradient(w / 2, sunY, 10, w / 2, sunY, 180);
    sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    sunGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.15)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w / 2, sunY, 180, 0, Math.PI * 2);
    ctx.fill();
  }

  renderMidgroundArchitecture(ctx) {
    const w = this.width;
    const h = this.height;
    ctx.save();

    // Silhouettes of ancient temple spires / mountain monoliths
    ctx.fillStyle = 'rgba(15, 12, 22, 0.75)';

    // Left Spire
    ctx.beginPath();
    ctx.moveTo(20, h * 0.7);
    ctx.lineTo(80, h * 0.28);
    ctx.lineTo(140, h * 0.7);
    ctx.fill();

    // Right Spire
    ctx.beginPath();
    ctx.moveTo(w - 140, h * 0.7);
    ctx.lineTo(w - 80, h * 0.32);
    ctx.lineTo(w - 20, h * 0.7);
    ctx.fill();

    ctx.restore();
  }

  renderAtmosphericVFX(ctx, dt) {
    ctx.save();

    // Volumetric Divine God-Rays
    const rayGrad = ctx.createLinearGradient(0, 0, this.width, this.height * 0.6);
    rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.18)');
    rayGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.05)');
    rayGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(this.width * 0.5, 0);
    ctx.lineTo(this.width * 0.05, this.height);
    ctx.lineTo(this.width * 0.95, this.height);
    ctx.closePath();
    ctx.fill();

    // Floating Embers rising through scene
    for (let p of this.particles) {
      p.y -= p.speedY;
      p.x += p.speedX + Math.sin(p.phase + this.time * 3) * 0.5;

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }

      const alpha = 0.4 + 0.6 * (1 - p.y / this.height);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderCinematicVignette(ctx) {
    const w = this.width;
    const h = this.height;
    const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.75);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  renderCinematicSubtitles(ctx, metrics) {
    if (!this.activeSubtitle) return;

    const words = this.highlightWords;
    if (words.length === 0) return;

    // Advance active word index as audio speaks
    if (metrics.isSpeaking) {
      this.activeWordIndex = Math.min(words.length - 1, Math.floor((this.time * 2.2) % words.length));
    }

    ctx.save();
    const fontSize = 26;
    ctx.font = `800 ${fontSize}px "Montserrat", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerY = this.height * 0.82;

    // Display 3-4 word window around current active word
    const windowSize = 4;
    const startIdx = Math.max(0, Math.min(words.length - windowSize, this.activeWordIndex - 1));
    const visibleWords = words.slice(startIdx, startIdx + windowSize);

    // Measure total width
    const spaceW = ctx.measureText(' ').width;
    const widths = visibleWords.map(w => ctx.measureText(w).width);
    const totalW = widths.reduce((a, b) => a + b, 0) + spaceW * (visibleWords.length - 1);

    let curX = (this.width - totalW) / 2;

    // Dark glass backing box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.roundRect(curX - 16, centerY - fontSize / 2 - 12, totalW + 32, fontSize + 24, 12);
    ctx.fill();

    // Render words with gold active bounce
    visibleWords.forEach((word, i) => {
      const globalIdx = startIdx + i;
      const isActive = (globalIdx === this.activeWordIndex);

      ctx.save();
      const wx = curX + widths[i] / 2;

      if (isActive) {
        ctx.translate(wx, centerY);
        ctx.scale(1.15, 1.15);
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6;
        ctx.strokeText(word, 0, 0);
        ctx.fillText(word, 0, 0);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(word, wx, centerY);
        ctx.fillText(word, wx, centerY);
      }

      ctx.restore();
      curX += widths[i] + spaceW;
    });

    ctx.restore();
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.SceneDirector = SceneDirector;
}
