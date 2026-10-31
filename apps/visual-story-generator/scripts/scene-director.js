/**
 * VISUAL STORY GENERATOR - MANO LAB
 * scene-director.js - Cinematic Camera Director, Multi-Character Staging, Parallax 8-Environment Engine & Real-time Compositor
 */

class SceneDirector {
  constructor(canvas, characterRig1, audioStudio, characterRig2 = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audioStudio;

    // Multi-character support
    this.characters = [characterRig1];
    if (characterRig2) {
      this.characters.push(characterRig2);
    } else {
      // Create second character defaulting to MYSTIC_SAGE
      const char2 = new CharacterRig('MYSTIC_SAGE');
      char2.worldX = 110;
      char2.targetX = 110;
      char2.facing = -1; // Facing left towards char1
      this.characters.push(char2);
    }

    // Default staging: dual-mode disabled initially (single hero focus), toggleable
    this.isDualMode = false;
    this.activeSpeakerIndex = 0; // 0 = Char 1 speaks, 1 = Char 2 speaks

    // Initial character positions
    this.characters[0].worldX = 0;
    this.characters[0].targetX = 0;
    this.characters[0].facing = 1;

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
      targetX: 0,
      targetY: 0,
      targetScale: 1.0,
      targetRot: 0
    };

    // Environment Engine: 8 Atmospheric Living Worlds
    // 'GOLDEN_TEMPLE', 'SACRED_ASHRAMA', 'COSMIC_VOID', 'VOLCANIC_WAR', 
    // 'HIMALAYAN_SUMMIT', 'ROYAL_DARBAR', 'KURUKSHETRA_BATTLEFIELD', 'ENCHANTED_FOREST'
    this.currentEnv = 'GOLDEN_TEMPLE';
    this.targetEnv = null;
    this.envTransitionProgress = 1.0;
    this.envTransitionSpeed = 1.5; // seconds

    // Subtitle & Dialogue State
    this.activeSpeakerName = 'Rudra';
    this.activeSubtitle = 'एक ही माँ के दो बेटे... शेषनाग और वासुकि!';
    this.highlightWords = ['एक', 'ही', 'माँ', 'के', 'दो', 'बेटे...', 'शेषनाग', 'और', 'वासुकि!'];
    this.activeWordIndex = 0;
    this.subtitleProgress = 0;

    // Dynamic Weather / Atmospheric Particles (embers, snow, fireflies, cosmic dust)
    this.particles = [];
    this.initParticles(75);

    this.time = 0;
  }

  get char1() { return this.characters[0]; }
  get char2() { return this.characters[1]; }

  setDualMode(enabled) {
    this.isDualMode = !!enabled;
    if (this.isDualMode) {
      // Stage both characters face-to-face
      this.characters[0].moveTo(-110, 140);
      this.characters[0].facing = 1;
      this.characters[1].moveTo(110, 140);
      this.characters[1].facing = -1;
      this.camera.targetScale = 0.95;
      this.camera.targetY = -15;
    } else {
      // Solo hero mode: center character 1
      this.characters[0].moveTo(0, 140);
      this.characters[0].facing = 1;
      this.activeSpeakerIndex = 0;
      this.setShotMode(this.shotMode);
    }
  }

  setActiveSpeaker(index, speakerName = '') {
    this.activeSpeakerIndex = index;
    if (speakerName) {
      this.activeSpeakerName = speakerName;
    } else {
      const activeChar = this.characters[index];
      this.activeSpeakerName = activeChar?.profile?.name || (index === 0 ? 'Speaker 1' : 'Speaker 2');
    }
  }

  setShotMode(mode) {
    this.shotMode = mode;
    switch (mode) {
      case 'HERO_CLOSEUP':
        this.camera.targetScale = this.isDualMode ? 1.45 : 1.95;
        this.camera.targetY = 140;
        this.camera.targetX = this.isDualMode ? (this.activeSpeakerIndex === 0 ? 90 : -90) : 0;
        this.camera.targetRot = 0;
        break;
      case 'DUTCH_LOW_ANGLE':
        this.camera.targetScale = this.isDualMode ? 1.15 : 1.35;
        this.camera.targetY = 40;
        this.camera.targetX = 0;
        this.camera.targetRot = -0.04;
        break;
      case 'WIDE_ESTABLISHING':
        this.camera.targetScale = this.isDualMode ? 0.78 : 0.85;
        this.camera.targetY = -80;
        this.camera.targetX = 0;
        this.camera.targetRot = 0;
        break;
      default: // MEDIUM_ACTION
        this.camera.targetScale = this.isDualMode ? 0.95 : 1.25;
        this.camera.targetY = this.isDualMode ? -15 : 20;
        this.camera.targetX = 0;
        this.camera.targetRot = 0;
        break;
    }
  }

  setEnvironment(theme) {
    if (this.currentEnv === theme) return;
    this.targetEnv = theme;
    this.envTransitionProgress = 0.0;
  }

  setSubtitle(text, speakerName = '') {
    this.activeSubtitle = text || '';
    if (speakerName) this.activeSpeakerName = speakerName;
    this.highlightWords = this.activeSubtitle.trim().split(/\s+/).filter(Boolean);
    this.activeWordIndex = 0;
    this.subtitleProgress = 0;
  }

  initParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 1.5 + Math.random() * 3.5,
        speedY: 0.4 + Math.random() * 1.6,
        speedX: (Math.random() - 0.5) * 1.0,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.7
      });
    }
  }

  /**
   * Main Scene Tick & Compositor Loop
   */
  render(dt) {
    this.time += dt;

    // 1. Audio metrics & Lip-Sync distribution
    const metrics = this.audio ? this.audio.getLipSyncMetrics() : { amplitude: 0, frequency: 0, isVoicePlaying: false };

    // Update characters
    // Active speaker gets full amplitude and frequency for lip-sync and expressive gestures
    // Inactive character stays in listening stance (breathing, subtle blinking, listening tilt)
    if (this.characters[0]) {
      const isSpeaking = this.activeSpeakerIndex === 0 && metrics.amplitude > 0.02;
      this.characters[0].update(
        dt,
        isSpeaking ? metrics.amplitude : 0.01,
        isSpeaking ? metrics.frequency : 0.0
      );
    }
    if (this.isDualMode && this.characters[1]) {
      const isSpeaking = this.activeSpeakerIndex === 1 && metrics.amplitude > 0.02;
      this.characters[1].update(
        dt,
        isSpeaking ? metrics.amplitude : 0.01,
        isSpeaking ? metrics.frequency : 0.0
      );
    }

    // 2. Environment cross-fade update
    if (this.targetEnv) {
      this.envTransitionProgress += dt / this.envTransitionSpeed;
      if (this.envTransitionProgress >= 1.0) {
        this.currentEnv = this.targetEnv;
        this.targetEnv = null;
        this.envTransitionProgress = 1.0;
      }
    }

    // 3. Smooth Camera Interpolation
    this.camera.scale += (this.camera.targetScale - this.camera.scale) * 0.08;
    this.camera.y += (this.camera.targetY - this.camera.y) * 0.08;
    this.camera.x += (this.camera.targetX - this.camera.x) * 0.08;
    this.camera.rot += (this.camera.targetRot - this.camera.rot) * 0.08;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // 4. Render Background Environment (with cross-fade if transitioning)
    if (this.targetEnv && this.envTransitionProgress < 1.0) {
      // Render base current environment
      this.renderSpecificEnvironment(ctx, this.currentEnv, 1.0);
      // Overlay transitioning target environment with alpha
      ctx.save();
      ctx.globalAlpha = Math.min(1.0, Math.max(0.0, this.envTransitionProgress));
      this.renderSpecificEnvironment(ctx, this.targetEnv, 1.0);
      ctx.restore();
    } else {
      this.renderSpecificEnvironment(ctx, this.currentEnv, 1.0);
    }

    // 5. Camera Transform for Staged Characters
    ctx.save();
    ctx.translate(w / 2 + this.camera.x, h * 0.58 + this.camera.y);
    ctx.scale(this.camera.scale, this.camera.scale);
    ctx.rotate(this.camera.rot);

    // Stage ground shadow / divine presence podiums
    this.renderStageShadows(ctx);

    // Render Character 1 (Always present)
    if (this.characters[0]) {
      const isSpeaking = this.activeSpeakerIndex === 0;
      if (isSpeaking && this.isDualMode) {
        this.renderSpeakerFocusRing(ctx, this.characters[0].worldX, 160);
      }
      this.characters[0].render(ctx, 1.0);
    }

    // Render Character 2 (In Dual Mode)
    if (this.isDualMode && this.characters[1]) {
      const isSpeaking = this.activeSpeakerIndex === 1;
      if (isSpeaking) {
        this.renderSpeakerFocusRing(ctx, this.characters[1].worldX, 160);
      }
      this.characters[1].render(ctx, 1.0);
    }

    ctx.restore();

    // 6. Atmospheric VFX Particles (Embers / Snow / Fireflies / Dust)
    this.renderAtmosphericVFX(ctx, dt);

    // 7. Cinematic Vignette & Lighting Rim
    this.renderCinematicVignette(ctx);

    // 8. Lower-Third Dynamic Subtitles with Karaoke Highlighting
    this.renderCinematicSubtitles(ctx, metrics, dt);
  }

  renderStageShadows(ctx) {
    ctx.save();
    // Character 1 shadow
    const x1 = this.characters[0].worldX;
    const g1 = ctx.createRadialGradient(x1, 160, 10, x1, 160, 130);
    g1.addColorStop(0, 'rgba(0,0,0,0.65)');
    g1.addColorStop(0.6, 'rgba(0,0,0,0.3)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.ellipse(x1, 160, 120, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Character 2 shadow
    if (this.isDualMode && this.characters[1]) {
      const x2 = this.characters[1].worldX;
      const g2 = ctx.createRadialGradient(x2, 160, 10, x2, 160, 130);
      g2.addColorStop(0, 'rgba(0,0,0,0.65)');
      g2.addColorStop(0.6, 'rgba(0,0,0,0.3)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.ellipse(x2, 160, 120, 26, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  renderSpeakerFocusRing(ctx, x, y) {
    ctx.save();
    const pulse = 1.0 + Math.sin(this.time * 6.0) * 0.12;
    const ringGrad = ctx.createRadialGradient(x, y, 40, x, y, 140 * pulse);
    ringGrad.addColorStop(0, 'rgba(250, 204, 21, 0.25)');
    ringGrad.addColorStop(0.7, 'rgba(234, 179, 8, 0.08)');
    ringGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, 135 * pulse, 30 * pulse, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * 8 DYNAMIC LIVING ENVIRONMENTS
   */
  renderSpecificEnvironment(ctx, theme, alpha = 1.0) {
    const w = this.width;
    const h = this.height;

    switch (theme) {
      case 'SACRED_ASHRAMA':
        this.renderAshramaEnv(ctx, w, h);
        break;
      case 'COSMIC_VOID':
        this.renderCosmicVoidEnv(ctx, w, h);
        break;
      case 'VOLCANIC_WAR':
        this.renderVolcanicWarEnv(ctx, w, h);
        break;
      case 'HIMALAYAN_SUMMIT':
        this.renderHimalayanSummitEnv(ctx, w, h);
        break;
      case 'ROYAL_DARBAR':
        this.renderRoyalDarbarEnv(ctx, w, h);
        break;
      case 'KURUKSHETRA_BATTLEFIELD':
        this.renderKurukshetraEnv(ctx, w, h);
        break;
      case 'ENCHANTED_FOREST':
        this.renderEnchantedForestEnv(ctx, w, h);
        break;
      case 'GOLDEN_TEMPLE':
      default:
        this.renderGoldenTempleEnv(ctx, w, h);
        break;
    }
  }

  // 1. GOLDEN TEMPLE
  renderGoldenTempleEnv(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1c1032');
    grad.addColorStop(0.35, '#431407');
    grad.addColorStop(0.75, '#78350f');
    grad.addColorStop(1, '#0c0a09');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Radiant Golden Sun Halo
    const sunY = h * 0.32;
    const sunGrad = ctx.createRadialGradient(w / 2, sunY, 15, w / 2, sunY, 200);
    sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
    sunGrad.addColorStop(0.4, 'rgba(234, 179, 8, 0.22)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w / 2, sunY, 200, 0, Math.PI * 2);
    ctx.fill();

    // Sacred Temple Spires & Carved Pillars
    ctx.fillStyle = 'rgba(15, 12, 22, 0.85)';
    // Left temple shikhara
    ctx.beginPath();
    ctx.moveTo(10, h * 0.75);
    ctx.lineTo(80, h * 0.25);
    ctx.lineTo(150, h * 0.75);
    ctx.fill();
    // Right temple shikhara
    ctx.beginPath();
    ctx.moveTo(w - 150, h * 0.75);
    ctx.lineTo(w - 80, h * 0.28);
    ctx.lineTo(w - 10, h * 0.75);
    ctx.fill();

    // Golden Temple Plinth Floor
    const plinthGrad = ctx.createLinearGradient(0, h * 0.68, 0, h);
    plinthGrad.addColorStop(0, '#2d1b08');
    plinthGrad.addColorStop(1, '#090501');
    ctx.fillStyle = plinthGrad;
    ctx.fillRect(0, h * 0.68, w, h * 0.32);
  }

  // 2. SACRED ASHRAMA
  renderAshramaEnv(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#061a14');
    grad.addColorStop(0.4, '#14382c');
    grad.addColorStop(0.75, '#854d0e');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Sacred Dawn Surya
    const sunY = h * 0.28;
    const dawn = ctx.createRadialGradient(w * 0.45, sunY, 10, w * 0.45, sunY, 160);
    dawn.addColorStop(0, 'rgba(253, 186, 116, 0.6)');
    dawn.addColorStop(0.5, 'rgba(234, 88, 12, 0.2)');
    dawn.addColorStop(1, 'transparent');
    ctx.fillStyle = dawn;
    ctx.beginPath();
    ctx.arc(w * 0.45, sunY, 160, 0, Math.PI * 2);
    ctx.fill();

    // Banyan tree canopy silhouette
    ctx.fillStyle = 'rgba(10, 24, 18, 0.88)';
    ctx.beginPath();
    ctx.arc(100, 120, 180, 0, Math.PI * 2);
    ctx.arc(w - 60, 80, 140, 0, Math.PI * 2);
    ctx.fill();

    // Hermitage grass & holy river bank
    const ground = ctx.createLinearGradient(0, h * 0.7, 0, h);
    ground.addColorStop(0, '#1c1917');
    ground.addColorStop(0.7, '#0c1a14');
    ground.addColorStop(1, '#022c22');
    ctx.fillStyle = ground;
    ctx.fillRect(0, h * 0.7, w, h * 0.3);

    // Sacred Havan Kund (Fire Altar) in midground
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(w * 0.5 - 45, h * 0.74);
    ctx.lineTo(w * 0.5 + 45, h * 0.74);
    ctx.lineTo(w * 0.5 + 35, h * 0.79);
    ctx.lineTo(w * 0.5 - 35, h * 0.79);
    ctx.closePath();
    ctx.fill();

    // Fire flame flicker
    const flameH = 30 + Math.sin(this.time * 12.0) * 8;
    const fireGrad = ctx.createRadialGradient(w * 0.5, h * 0.74, 2, w * 0.5, h * 0.74 - flameH * 0.5, 30);
    fireGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
    fireGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.7)');
    fireGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = fireGrad;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.74 - flameH * 0.4, 18, flameH, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. COSMIC VOID
  renderCosmicVoidEnv(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.45, '#1e1b4b');
    grad.addColorStop(0.85, '#090514');
    grad.addColorStop(1, '#030712');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Swirling Nebula Spiral
    ctx.save();
    ctx.translate(w / 2, h * 0.35);
    ctx.rotate(this.time * 0.04);
    const neb = ctx.createRadialGradient(0, 0, 20, 0, 0, 240);
    neb.addColorStop(0, 'rgba(192, 132, 252, 0.4)');
    neb.addColorStop(0.4, 'rgba(56, 189, 248, 0.22)');
    neb.addColorStop(0.7, 'rgba(129, 140, 248, 0.1)');
    neb.addColorStop(1, 'transparent');
    ctx.fillStyle = neb;
    ctx.beginPath();
    ctx.ellipse(0, 0, 230, 95, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Celestial Cosmic Ocean (Kshir Sagar) Floor
    const waveY = h * 0.72;
    const oceanGrad = ctx.createLinearGradient(0, waveY, 0, h);
    oceanGrad.addColorStop(0, 'rgba(30, 58, 138, 0.75)');
    oceanGrad.addColorStop(0.4, '#0f172a');
    oceanGrad.addColorStop(1, '#020617');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, waveY, w, h - waveY);
  }

  // 4. VOLCANIC WAR
  renderVolcanicWarEnv(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#09090b');
    grad.addColorStop(0.45, '#3b0707');
    grad.addColorStop(0.8, '#7f1d1d');
    grad.addColorStop(1, '#180303');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Volcanic Crags & War Fortresses
    ctx.fillStyle = '#0f0202';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.lineTo(90, h * 0.3);
    ctx.lineTo(170, h * 0.68);
    ctx.lineTo(w - 180, h * 0.62);
    ctx.lineTo(w - 80, h * 0.32);
    ctx.lineTo(w, h * 0.65);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Glowing Lava Fissure across bottom
    const lavaGrad = ctx.createLinearGradient(0, h * 0.8, 0, h);
    lavaGrad.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
    lavaGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.9)');
    lavaGrad.addColorStop(0.7, '#7f1d1d');
    lavaGrad.addColorStop(1, '#1c0404');
    ctx.fillStyle = lavaGrad;
    ctx.fillRect(0, h * 0.8, w, h * 0.2);
  }

  // 5. HIMALAYAN SUMMIT (Kailash)
  renderHimalayanSummitEnv(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#030712');
    grad.addColorStop(0.35, '#0f172a');
    grad.addColorStop(0.75, '#1e293b');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Majestic Snowy Mountain Peak (Kailash silhouette)
    ctx.fillStyle = '#091322';
    ctx.beginPath();
    ctx.moveTo(w * 0.5 - 190, h * 0.72);
    ctx.lineTo(w * 0.5, h * 0.22);
    ctx.lineTo(w * 0.5 + 190, h * 0.72);
    ctx.closePath();
    ctx.fill();

    // Snow cap highlight
    ctx.fillStyle = 'rgba(241, 245, 249, 0.82)';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.22);
    ctx.lineTo(w * 0.5 - 65, h * 0.38);
    ctx.lineTo(w * 0.5 + 65, h * 0.38);
    ctx.closePath();
    ctx.fill();

    // Glacial Ice ground
    const snowGround = ctx.createLinearGradient(0, h * 0.7, 0, h);
    snowGround.addColorStop(0, '#1e293b');
    snowGround.addColorStop(0.5, '#0f172a');
    snowGround.addColorStop(1, '#020617');
    ctx.fillStyle = snowGround;
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
  }

  // 6. ROYAL DARBAR
  renderRoyalDarbarEnv(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1e1104');
    grad.addColorStop(0.4, '#451a03');
    grad.addColorStop(0.75, '#78350f');
    grad.addColorStop(1, '#0b0805');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Ornate Royal Archway
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.35, 170, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Palace Columns
    ctx.fillStyle = '#291807';
    ctx.fillRect(20, h * 0.2, 35, h * 0.58);
    ctx.fillRect(w - 55, h * 0.2, 35, h * 0.58);

    // Flaming Torches on Columns
    [37, w - 37].forEach(tx => {
      const tg = ctx.createRadialGradient(tx, h * 0.38, 2, tx, h * 0.38, 24);
      tg.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      tg.addColorStop(0.5, 'rgba(249, 115, 22, 0.6)');
      tg.addColorStop(1, 'transparent');
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.arc(tx, h * 0.38, 24, 0, Math.PI * 2);
      ctx.fill();
    });

    // Polished Darbar Marble Floor
    const floor = ctx.createLinearGradient(0, h * 0.7, 0, h);
    floor.addColorStop(0, '#381e09');
    floor.addColorStop(1, '#0e0803');
    ctx.fillStyle = floor;
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
  }

  // 7. KURUKSHETRA BATTLEFIELD
  renderKurukshetraEnv(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1c0f08');
    grad.addColorStop(0.35, '#7c2d12');
    grad.addColorStop(0.75, '#ea580c');
    grad.addColorStop(1, '#180702');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Dramatic Blood-Red Setting Sun
    const sunY = h * 0.42;
    const sunGrad = ctx.createRadialGradient(w * 0.55, sunY, 8, w * 0.55, sunY, 140);
    sunGrad.addColorStop(0, 'rgba(254, 202, 202, 0.8)');
    sunGrad.addColorStop(0.35, 'rgba(239, 68, 68, 0.45)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w * 0.55, sunY, 140, 0, Math.PI * 2);
    ctx.fill();

    // War Chariot Silhouettes & Battlefield Standards
    ctx.fillStyle = '#0d0402';
    // Chariot left
    ctx.beginPath();
    ctx.moveTo(30, h * 0.72);
    ctx.lineTo(90, h * 0.58);
    ctx.lineTo(130, h * 0.72);
    ctx.fill();
    // Trident war pennant right
    ctx.fillRect(w - 70, h * 0.44, 4, h * 0.28);
    ctx.beginPath();
    ctx.moveTo(w - 70, h * 0.45);
    ctx.lineTo(w - 110, h * 0.5);
    ctx.lineTo(w - 70, h * 0.55);
    ctx.closePath();
    ctx.fill();

    // Sacred Soil / Battlefield Earth
    const ground = ctx.createLinearGradient(0, h * 0.7, 0, h);
    ground.addColorStop(0, '#291409');
    ground.addColorStop(1, '#0a0402');
    ctx.fillStyle = ground;
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
  }

  // 8. ENCHANTED FOREST
  renderEnchantedForestEnv(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#021312');
    grad.addColorStop(0.4, '#042f2e');
    grad.addColorStop(0.8, '#064e3b');
    grad.addColorStop(1, '#021a14');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Radiant Full Silver Moon
    const moonY = h * 0.22;
    const moonGrad = ctx.createRadialGradient(w * 0.7, moonY, 12, w * 0.7, moonY, 120);
    moonGrad.addColorStop(0, 'rgba(204, 251, 241, 0.85)');
    moonGrad.addColorStop(0.4, 'rgba(45, 212, 191, 0.25)');
    moonGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(w * 0.7, moonY, 120, 0, Math.PI * 2);
    ctx.fill();

    // Ancient magical tree silhouettes
    ctx.fillStyle = '#021815';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.75);
    ctx.lineTo(70, 0);
    ctx.lineTo(120, 0);
    ctx.lineTo(100, h * 0.75);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w - 90, h * 0.75);
    ctx.lineTo(w - 110, 0);
    ctx.lineTo(w - 50, 0);
    ctx.lineTo(w, h * 0.75);
    ctx.fill();

    // Mossy Sacred Glade Ground
    const forestGround = ctx.createLinearGradient(0, h * 0.7, 0, h);
    forestGround.addColorStop(0, '#042f2e');
    forestGround.addColorStop(1, '#021312');
    ctx.fillStyle = forestGround;
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
  }

  /**
   * Foreground Atmospheric Particle VFX
   */
  renderAtmosphericVFX(ctx, dt) {
    ctx.save();

    for (let p of this.particles) {
      p.phase += dt * 2.0;

      // Behavior tuned to active environment
      if (this.currentEnv === 'HIMALAYAN_SUMMIT') {
        // Snowflakes falling down
        p.y += p.speedY * 1.5;
        p.x += Math.sin(p.phase) * 1.2;
        if (p.y > this.height) { p.y = -10; p.x = Math.random() * this.width; }
        ctx.fillStyle = `rgba(241, 245, 249, ${p.alpha * 0.8})`;
      } else if (this.currentEnv === 'ENCHANTED_FOREST') {
        // Glowing Turquoise Fireflies drifting upwards
        p.y -= p.speedY * 0.6;
        p.x += Math.cos(p.phase) * 0.8;
        if (p.y < -10) { p.y = this.height + 10; p.x = Math.random() * this.width; }
        const pulse = 0.4 + Math.sin(p.phase * 2.0) * 0.4;
        ctx.fillStyle = `rgba(45, 212, 191, ${pulse})`;
      } else if (this.currentEnv === 'COSMIC_VOID') {
        // Cosmic stardust drifting
        p.y -= p.speedY * 0.4;
        p.x += Math.sin(p.phase) * 0.5;
        if (p.y < -10) { p.y = this.height + 10; p.x = Math.random() * this.width; }
        ctx.fillStyle = `rgba(192, 132, 252, ${p.alpha * 0.7})`;
      } else {
        // Rising divine golden or crimson embers
        p.y -= p.speedY * 1.4;
        p.x += Math.sin(p.phase) * 0.8;
        if (p.y < -10) { p.y = this.height + 10; p.x = Math.random() * this.width; }
        const color = this.currentEnv === 'VOLCANIC_WAR' ? 'rgba(239, 68, 68, ' : 'rgba(250, 204, 21, ';
        ctx.fillStyle = color + p.alpha + ')';
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Cinematic Vignette
   */
  renderCinematicVignette(ctx) {
    const w = this.width;
    const h = this.height;
    ctx.save();
    const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.45, w / 2, h / 2, w * 0.95);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(0.7, 'rgba(0, 0, 0, 0.35)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  /**
   * Lower-Third Dynamic Subtitles with Karaoke Word Highlighting
   */
  renderCinematicSubtitles(ctx, metrics, dt) {
    if (!this.activeSubtitle) return;

    // Advance word highlight when voice is actively speaking
    if (metrics.amplitude > 0.05 && this.highlightWords.length > 0) {
      this.subtitleProgress += dt * 3.5;
      this.activeWordIndex = Math.min(
        this.highlightWords.length - 1,
        Math.floor(this.subtitleProgress)
      );
    }

    const w = this.width;
    const h = this.height;
    const boxY = h - 170;

    ctx.save();

    // Speaker Name Tag Pill
    if (this.activeSpeakerName) {
      ctx.font = '700 12px "Montserrat", sans-serif';
      const nameText = `● ${this.activeSpeakerName.toUpperCase()}`;
      const nameWidth = ctx.measureText(nameText).width;

      // Pill Background
      ctx.fillStyle = 'rgba(24, 24, 27, 0.92)';
      ctx.beginPath();
      ctx.roundRect((w - nameWidth - 28) / 2, boxY - 32, nameWidth + 28, 24, 12);
      ctx.fill();

      // Pill Border
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pill Text
      ctx.fillStyle = '#facc15';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nameText, w / 2, boxY - 20);
    }

    // Subtitle Container Card
    ctx.fillStyle = 'rgba(9, 10, 15, 0.88)';
    ctx.beginPath();
    ctx.roundRect(24, boxY, w - 48, 100, 16);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Render Subtitle Text (Wrapped & Karaoke-highlighted)
    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const words = this.highlightWords;
    if (words.length <= 6) {
      // Single line layout
      this.renderSubtitleLine(ctx, words, 0, words.length, w / 2, boxY + 50);
    } else {
      // Dual line layout
      const mid = Math.ceil(words.length / 2);
      this.renderSubtitleLine(ctx, words, 0, mid, w / 2, boxY + 36);
      this.renderSubtitleLine(ctx, words, mid, words.length, w / 2, boxY + 68);
    }

    ctx.restore();
  }

  renderSubtitleLine(ctx, words, startIdx, endIdx, centerX, y) {
    const lineWords = words.slice(startIdx, endIdx);
    const lineText = lineWords.join(' ');
    const totalWidth = ctx.measureText(lineText).width;
    let startX = centerX - totalWidth / 2;

    ctx.textAlign = 'left';

    for (let i = startIdx; i < endIdx; i++) {
      const word = words[i];
      const wordWidth = ctx.measureText(word + ' ').width;

      if (i === this.activeWordIndex) {
        // Active speaking word: Golden glow + scale bounce
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
      } else if (i < this.activeWordIndex) {
        // Already spoken word: Bright white
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
      } else {
        // Upcoming word: Dim white/silver
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.shadowBlur = 0;
      }

      ctx.fillText(word, startX, y);
      startX += wordWidth;
    }
  }
}

// Global window registration
if (typeof window !== 'undefined') {
  window.SceneDirector = SceneDirector;
}
if (typeof global !== 'undefined') {
  global.SceneDirector = SceneDirector;
}
