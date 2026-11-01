/**
 * VISUAL STORY GENERATOR - MANO LAB
 * scene-director.js - Cinematic Camera Director, Multi-Character Staging, Parallax 8-Environment Engine & Real-time Compositor
 */

class SceneDirector {

  static detectEnvironmentFromPrompt(prompt = '') {
    const text = (prompt || '').toLowerCase();
    if (text.includes('kurukshetra') || text.includes('karna') || text.includes('battlefield') || text.includes('war') || text.includes('mahabharata')) {
      return 'KURUKSHETRA';
    }
    if (text.includes('ayodhya') || text.includes('ram') || text.includes('rama') || text.includes('palace') || text.includes('temple') || text.includes('ramayana')) {
      return 'AYODHYA_PALACE';
    }
    if (text.includes('1950') || text.includes('1950s') || text.includes('vintage') || text.includes('gentleman') || text.includes('street') || text.includes('noir') || text.includes('rain')) {
      return 'VINTAGE_1950S_STREET';
    }
    if (text.includes('coffee') || text.includes('cafe')) {
      return 'COFFEE_SHOP';
    }
    if (text.includes('office') || text.includes('work') || text.includes('meeting')) {
      return 'MODERN_OFFICE';
    }
    if (text.includes('park') || text.includes('walk') || text.includes('nature')) {
      return 'SUNNY_PARK';
    }
    if (text.includes('sunset') || text.includes('city') || text.includes('skyline')) {
      return 'CITY_SUNSET';
    }
    if (text.includes('cyber') || text.includes('future') || text.includes('tech')) {
      return 'CYBER_TECH';
    }
    return 'PODCAST_STUDIO';
  }

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
      const char2 = new CharacterRig('MAYA');
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

    // Environment Engine: 8 Modern Neutral & Relatable Worlds
    // 'PODCAST_STUDIO', 'COZY_LOUNGE', 'CITY_SUNSET', 'SUNNY_PARK',
    // 'MODERN_OFFICE', 'COFFEE_SHOP', 'MINIMALIST_STAGE', 'CYBER_TECH'
    this.currentEnv = 'PODCAST_STUDIO';
    this.targetEnv = null;
    this.envTransitionProgress = 1.0;
    this.envTransitionSpeed = 1.5; // seconds

    // Subtitle & Dialogue State
    this.activeSpeakerName = 'Alex';
    this.activeSubtitle = 'Welcome to StoryStudio! Let\'s create something amazing together.';
    this.highlightWords = ['Welcome', 'to', 'StoryStudio!', 'Let\'s', 'create', 'something', 'amazing', 'together.'];
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
      // Modern Neutral Environments
      case 'PODCAST_STUDIO':
        this.renderPodcastStudioEnv(ctx, w, h);
        break;
      case 'COZY_LOUNGE':
        this.renderCozyLoungeEnv(ctx, w, h);
        break;
      case 'CITY_SUNSET':
        this.renderCitySunsetEnv(ctx, w, h);
        break;
      case 'SUNNY_PARK':
        this.renderSunnyParkEnv(ctx, w, h);
        break;
      case 'MODERN_OFFICE':
        this.renderModernOfficeEnv(ctx, w, h);
        break;
      case 'COFFEE_SHOP':
        this.renderCoffeeShopEnv(ctx, w, h);
        break;
      case 'MINIMALIST_STAGE':
        this.renderMinimalistStageEnv(ctx, w, h);
        break;
      case 'CYBER_TECH':
        this.renderCyberTechEnv(ctx, w, h);
        break;

      // Legacy Environments
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
      case 'KURUKSHETRA':
      case 'KURUKSHETRA_BATTLEFIELD':
        this.renderKurukshetraEnv(ctx, w, h);
        break;
      case 'AYODHYA_PALACE':
      case 'AYODHYA':
        this.renderAyodhyaPalaceEnv(ctx, w, h);
        break;
      case 'VINTAGE_1950S_STREET':
      case 'VINTAGE_STREET':
      case '1950S_STREET':
        this.renderVintage1950sStreetEnv(ctx, w, h);
        break;
      case 'ENCHANTED_FOREST':
        this.renderEnchantedForestEnv(ctx, w, h);
        break;
      case 'GOLDEN_TEMPLE':
      default:
        this.renderPodcastStudioEnv(ctx, w, h);
        break;
    }
  }

  // --- MODERN NEUTRAL ENVIRONMENTS ---

  // 1. Modern Podcast / Creator Studio
  renderPodcastStudioEnv(ctx, w, h) {
    // Deep slate modern studio backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a0f1d');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Warm Ambient Neon Backlight Tube
    const neonGrad = ctx.createRadialGradient(w / 2, h * 0.38, 20, w / 2, h * 0.38, 240);
    neonGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
    neonGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.14)');
    neonGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = neonGrad;
    ctx.fillRect(0, 0, w, h);

    // Acoustic Sound Hexagon Panels on Wall
    ctx.fillStyle = 'rgba(30, 41, 59, 0.65)';
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.lineWidth = 1.5;

    const hexRadius = 32;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 7; c++) {
        const hx = c * 85 + (r % 2 === 0 ? 0 : 42);
        const hy = 160 + r * 68;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const px = hx + Math.cos(a) * hexRadius;
          const py = hy + Math.sin(a) * hexRadius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    // Studio Desk (Modern Walnut / Charcoal)
    const deskY = h * 0.72;
    const deskGrad = ctx.createLinearGradient(0, deskY, 0, h);
    deskGrad.addColorStop(0, '#1e293b');
    deskGrad.addColorStop(0.15, '#0f172a');
    deskGrad.addColorStop(1, '#020617');
    ctx.fillStyle = deskGrad;
    ctx.fillRect(0, deskY, w, h - deskY);

    // Beveled Desk Top Edge
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, deskY);
    ctx.lineTo(w, deskY);
    ctx.stroke();

    // Broadcast Microphone Silhouette with Red On-Air LED
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(w * 0.48 - 14, deskY - 95, 28, 55, 12);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Red ON-AIR Tally Glow
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(w * 0.48, deskY - 80, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 2. Cozy Modern Living Room / Lounge
  renderCozyLoungeEnv(ctx, w, h) {
    // Warm interior wall
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1c1917');
    grad.addColorStop(0.5, '#292524');
    grad.addColorStop(1, '#0c0a09');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Large Urban Window (Twilight Sky & City Bokeh Lights)
    const winX = w * 0.12;
    const winY = h * 0.16;
    const winW = w * 0.76;
    const winH = h * 0.45;

    // Window twilight sky
    const skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(0.6, '#1e1b4b');
    skyGrad.addColorStop(1, '#312e81');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX, winY, winW, winH);

    // City skyline silhouettes & glowing bokeh lights
    ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
    const bokehCoords = [
      [winX + 40, winY + 80, 4], [winX + 90, winY + 120, 3], [winX + 160, winY + 60, 5],
      [winX + 220, winY + 140, 3.5], [winX + 280, winY + 95, 4.5], [winX + 340, winY + 130, 3]
    ];
    for (let [bx, by, br] of bokehCoords) {
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    // Window Frame
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 8;
    ctx.strokeRect(winX, winY, winW, winH);
    ctx.beginPath();
    ctx.moveTo(winX + winW / 2, winY);
    ctx.lineTo(winX + winW / 2, winY + winH);
    ctx.moveTo(winX, winY + winH * 0.55);
    ctx.lineTo(winX + winW, winY + winH * 0.55);
    ctx.stroke();

    // Modern Floor Lamp (Warm Golden Conical Light)
    const lampX = w * 0.88;
    const lampGrad = ctx.createRadialGradient(lampX, h * 0.38, 10, lampX, h * 0.55, 180);
    lampGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
    lampGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lampGrad;
    ctx.beginPath();
    ctx.arc(lampX, h * 0.55, 180, 0, Math.PI * 2);
    ctx.fill();

    // Lamp Stem
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lampX, h * 0.38);
    ctx.lineTo(lampX, h * 0.85);
    ctx.stroke();

    // Wooden Floor
    const floorY = h * 0.76;
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
    floorGrad.addColorStop(0, '#451a03');
    floorGrad.addColorStop(1, '#1c1917');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, w, h - floorY);
  }

  // 3. City Skyline Sunset
  renderCitySunsetEnv(ctx, w, h) {
    // Golden hour sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(0.3, '#6d28d9');
    grad.addColorStop(0.55, '#db2777');
    grad.addColorStop(0.75, '#f59e0b');
    grad.addColorStop(0.9, '#fef08a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Glowing Sunset Sun
    const sunY = h * 0.58;
    const sunGrad = ctx.createRadialGradient(w * 0.5, sunY, 15, w * 0.5, sunY, 120);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.3, '#fef08a');
    sunGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.4)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w * 0.5, sunY, 120, 0, Math.PI * 2);
    ctx.fill();

    // Modern Skyscraper Silhouettes
    ctx.fillStyle = '#0f172a';
    const buildings = [
      [20, 220, 60], [70, 320, 75], [135, 180, 50], [175, 360, 80],
      [245, 260, 65], [300, 390, 85], [375, 200, 55], [420, 310, 70], [480, 240, 55]
    ];
    for (let [bx, bh, bw] of buildings) {
      ctx.fillRect(bx, h * 0.72 - bh, bw, bh);
      // Window lights
      ctx.fillStyle = 'rgba(254, 240, 138, 0.6)';
      for (let wy = h * 0.72 - bh + 15; wy < h * 0.72 - 10; wy += 22) {
        ctx.fillRect(bx + 10, wy, 8, 8);
        if (bw > 60) ctx.fillRect(bx + 30, wy, 8, 8);
      }
      ctx.fillStyle = '#0f172a';
    }

    // Street / Rooftop Floor
    const groundY = h * 0.72;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, groundY, w, h - groundY);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, groundY, w, 4);
  }

  // 4. Sunny Park / Green Nature
  renderSunnyParkEnv(ctx, w, h) {
    // Bright daytime blue sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    skyGrad.addColorStop(0, '#0284c7');
    skyGrad.addColorStop(0.5, '#38bdf8');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Warm Sun in Corner
    const sunGrad = ctx.createRadialGradient(w * 0.82, h * 0.18, 10, w * 0.82, h * 0.18, 90);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.4, '#fef08a');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w * 0.82, h * 0.18, 90, 0, Math.PI * 2);
    ctx.fill();

    // Soft Drifting Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.arc(100, 140, 35, 0, Math.PI * 2);
    ctx.arc(140, 130, 45, 0, Math.PI * 2);
    ctx.arc(180, 140, 35, 0, Math.PI * 2);
    ctx.fill();

    // Distant Green Hills
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.quadraticCurveTo(w * 0.35, h * 0.52, w * 0.7, h * 0.62);
    ctx.quadraticCurveTo(w * 0.88, h * 0.58, w, h * 0.64);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Lush Foreground Lawn Hill
    const lawnGrad = ctx.createLinearGradient(0, h * 0.65, 0, h);
    lawnGrad.addColorStop(0, '#15803d');
    lawnGrad.addColorStop(0.5, '#166534');
    lawnGrad.addColorStop(1, '#14532d');
    ctx.fillStyle = lawnGrad;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.74);
    ctx.quadraticCurveTo(w * 0.5, h * 0.68, w, h * 0.73);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Framing Green Trees with Dappled Leaves
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.arc(0, h * 0.2, 110, 0, Math.PI * 2);
    ctx.arc(w, h * 0.25, 120, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Modern Minimalist Office / Workspace
  renderModernOfficeEnv(ctx, w, h) {
    // Clean corporate glass workspace
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.6, '#1e293b');
    grad.addColorStop(1, '#090d16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Floor-to-ceiling glass wall view
    const winX = w * 0.08;
    const winY = h * 0.12;
    const winW = w * 0.84;
    const winH = h * 0.52;

    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(winX, winY, winW, winH);

    // Distant corporate towers
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(winX + 30, winY + 80, 80, winH - 80);
    ctx.fillRect(winX + 130, winY + 40, 110, winH - 40);
    ctx.fillRect(winX + 260, winY + 100, 90, winH - 100);

    // Frosted glass horizontal design bands
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(winX, winY + winH * 0.45, winW, 14);
    ctx.fillRect(winX, winY + winH * 0.52, winW, 8);

    // Glass frame mullions
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(winX, winY, winW, winH);
    ctx.beginPath();
    ctx.moveTo(winX + winW * 0.33, winY);
    ctx.lineTo(winX + winW * 0.33, winY + winH);
    ctx.moveTo(winX + winW * 0.66, winY);
    ctx.lineTo(winX + winW * 0.66, winY + winH);
    ctx.stroke();

    // Office Floor (Polished Charcoal Tile)
    const floorY = h * 0.72;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, floorY, w, h - floorY);

    // Floor reflections
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.0;
    for (let ty = floorY; ty < h; ty += 40) {
      ctx.beginPath();
      ctx.moveTo(0, ty);
      ctx.lineTo(w, ty);
      ctx.stroke();
    }
  }

  // 6. Cozy Coffee Shop / Urban Café
  renderCoffeeShopEnv(ctx, w, h) {
    // Warm rustic brick wall
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#271b16');
    grad.addColorStop(0.5, '#3e2723');
    grad.addColorStop(1, '#1b120c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Exposed Brick Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1.5;
    for (let by = 80; by < h * 0.72; by += 26) {
      ctx.beginPath();
      ctx.moveTo(0, by);
      ctx.lineTo(w, by);
      ctx.stroke();
    }

    // Chalkboard Coffee Menu in Center Wall
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4;
    const mbW = 180;
    const mbH = 110;
    ctx.strokeRect(w / 2 - mbW / 2, 150, mbW, mbH);
    ctx.fillRect(w / 2 - mbW / 2, 150, mbW, mbH);

    // Menu text hints
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '600 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('COFFEE & CONVERSATION', w / 2, 180);
    ctx.font = '400 10px sans-serif';
    ctx.fillText('Espresso • Pour Over • Matcha', w / 2, 210);

    // Vintage Hanging Edison Bulb Pendants
    const bulbs = [w * 0.22, w * 0.78];
    for (let bx of bulbs) {
      // Cord
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(bx, 0);
      ctx.lineTo(bx, 240);
      ctx.stroke();

      // Warm radial glow
      const bulbGlow = ctx.createRadialGradient(bx, 248, 4, bx, 248, 65);
      bulbGlow.addColorStop(0, '#ffffff');
      bulbGlow.addColorStop(0.3, '#fde047');
      bulbGlow.addColorStop(0.7, 'rgba(245, 158, 11, 0.35)');
      bulbGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = bulbGlow;
      ctx.beginPath();
      ctx.arc(bx, 248, 65, 0, Math.PI * 2);
      ctx.fill();

      // Glass bulb
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(bx, 246, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Espresso Bar Counter Floor
    const barY = h * 0.74;
    const barGrad = ctx.createLinearGradient(0, barY, 0, h);
    barGrad.addColorStop(0, '#593019');
    barGrad.addColorStop(1, '#1b120c');
    ctx.fillStyle = barGrad;
    ctx.fillRect(0, barY, w, h - barY);
  }

  // 7. Minimalist Studio Stage (Clean & Universal)
  renderMinimalistStageEnv(ctx, w, h) {
    // Deep modern studio gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#030712');
    grad.addColorStop(0.4, '#0f172a');
    grad.addColorStop(0.8, '#1e293b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Overhead Spotlight Cone Illuminating Floor
    const spotX = w / 2;
    const spotGrad = ctx.createRadialGradient(spotX, h * 0.65, 30, spotX, h * 0.65, 260);
    spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
    spotGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.12)');
    spotGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.ellipse(spotX, h * 0.68, 240, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Studio Stage Floor Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.74);
    ctx.lineTo(w, h * 0.74);
    ctx.stroke();
  }

  // 8. Modern Cyber Tech Space
  renderCyberTechEnv(ctx, w, h) {
    // Dark futuristic cyber backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.5, '#0b0f19');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Perspective digital floor grid
    const gridY = h * 0.65;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.lineWidth = 1.5;

    // Horizontal receding grid lines
    for (let gy = gridY; gy < h; gy += 25) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }

    // Perspective vertical fan rays
    for (let x = -100; x <= w + 100; x += 55) {
      ctx.beginPath();
      ctx.moveTo(w / 2, gridY - 40);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Cyber Cyan / Magenta Ambient Neon Orbs
    const orbGrad = ctx.createRadialGradient(w * 0.5, gridY - 60, 10, w * 0.5, gridY - 60, 200);
    orbGrad.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
    orbGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.12)');
    orbGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = orbGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // --- HISTORICAL & FANTASY ENVIRONMENTS (PRESERVED) ---

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

  // 9. AYODHYA SACRED PALACE & TEMPLE HORIZON (Lord Ram / Ramayana)
  renderAyodhyaPalaceEnv(ctx, w, h) {
    // Serene Dawn Sky over River Sarayu
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#1e1b4b');
    skyGrad.addColorStop(0.3, '#312e81');
    skyGrad.addColorStop(0.65, '#fde047');
    skyGrad.addColorStop(0.85, '#fbcfe8');
    skyGrad.addColorStop(1, '#fed7aa');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Radiant Morning Sun Motes
    const sunGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, 180);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    sunGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.6)');
    sunGrad.addColorStop(0.8, 'rgba(251, 191, 36, 0.2)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.45, 180, 0, Math.PI * 2);
    ctx.fill();

    // Distant Ayodhya Golden Temple Spire (Shikhara) Silhouettes
    ctx.fillStyle = '#ca8a04';
    // Center Great Temple Shikhara
    ctx.beginPath();
    ctx.moveTo(w * 0.44, h * 0.65);
    ctx.lineTo(w * 0.5, h * 0.32);
    ctx.lineTo(w * 0.56, h * 0.65);
    ctx.closePath();
    ctx.fill();
    // Temple Kalash finial
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.31, 5, 0, Math.PI * 2);
    ctx.fill();

    // Side Pavilions
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.65);
    ctx.lineTo(w * 0.26, h * 0.42);
    ctx.lineTo(w * 0.32, h * 0.65);
    ctx.moveTo(w * 0.68, h * 0.65);
    ctx.lineTo(w * 0.74, h * 0.42);
    ctx.lineTo(w * 0.8, h * 0.65);
    ctx.fill();

    // Marble Pavilion Pillars & Arches
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, h * 0.62, w, 18);
    // Left & Right Carved Marble Pillars
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(15, h * 0.15, 36, h * 0.55);
    ctx.fillRect(w - 51, h * 0.15, 36, h * 0.55);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(15, h * 0.15, 36, h * 0.55);
    ctx.strokeRect(w - 51, h * 0.15, 36, h * 0.55);

    // Marigold Garland Drapes
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.18, 120, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Marble Floor with Lotus Petals
    const floorGrad = ctx.createLinearGradient(0, h * 0.7, 0, h);
    floorGrad.addColorStop(0, '#f8fafc');
    floorGrad.addColorStop(0.5, '#e2e8f0');
    floorGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, h * 0.7, w, h * 0.3);

    // Floating Pink Lotus Blossoms on Sarayu Shore
    ctx.fillStyle = '#f43f5e';
    for (let lx = 60; lx < w - 40; lx += 110) {
      ctx.beginPath();
      ctx.ellipse(lx, h * 0.76, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 10. 1950S MID-CENTURY MISTY URBAN STREET (1950s Gentleman / Noir)
  renderVintage1950sStreetEnv(ctx, w, h) {
    // Wet Rainy Night City Boulevard
    const streetSky = ctx.createLinearGradient(0, 0, 0, h);
    streetSky.addColorStop(0, '#020617');
    streetSky.addColorStop(0.4, '#0f172a');
    streetSky.addColorStop(0.7, '#1e293b');
    streetSky.addColorStop(1, '#020617');
    ctx.fillStyle = streetSky;
    ctx.fillRect(0, 0, w, h);

    // Mid-Century Brick Townhouse Silhouettes
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, h * 0.28, w * 0.38, h * 0.42);
    ctx.fillRect(w * 0.62, h * 0.25, w * 0.38, h * 0.45);

    // Windowpanes with Warm Amber Interior Light
    ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
    for (let wy = h * 0.32; wy < h * 0.62; wy += 45) {
      ctx.fillRect(20, wy, 24, 32);
      ctx.fillRect(w * 0.22, wy, 24, 32);
      ctx.fillRect(w - 45, wy, 24, 32);
      ctx.fillRect(w - 95, wy, 24, 32);
    }

    // Vintage Cast Iron Gas Streetlamp (Left & Right)
    [-1, 1].forEach(side => {
      const lx = side === -1 ? w * 0.22 : w * 0.78;
      const ly = h * 0.45;

      // Glowing Amber Gaslight Radius
      const lampGlow = ctx.createRadialGradient(lx, ly, 6, lx, ly, 110);
      lampGlow.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
      lampGlow.addColorStop(0.4, 'rgba(245, 158, 11, 0.35)');
      lampGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = lampGlow;
      ctx.beginPath();
      ctx.arc(lx, ly, 110, 0, Math.PI * 2);
      ctx.fill();

      // Cast-Iron Lamp Post
      ctx.fillStyle = '#020617';
      ctx.fillRect(lx - 2.5, ly, 5, h * 0.28);
      // Lantern Housing
      ctx.beginPath();
      ctx.roundRect(lx - 10, ly - 18, 20, 22, 4);
      ctx.fill();
    });

    // Rainy Asphalt Boulevard Floor with Warm Reflections
    const groundGrad = ctx.createLinearGradient(0, h * 0.7, 0, h);
    groundGrad.addColorStop(0, '#1e293b');
    groundGrad.addColorStop(0.4, '#0f172a');
    groundGrad.addColorStop(1, '#020617');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, h * 0.7, w, h * 0.3);

    // Wet Reflective Puddles
    ctx.fillStyle = 'rgba(253, 224, 71, 0.16)';
    ctx.beginPath();
    ctx.ellipse(w * 0.25, h * 0.82, 65, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.75, h * 0.84, 75, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sidewalk Cobblestone Curb
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.lineTo(w, h * 0.72);
    ctx.stroke();
  }

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
      if (this.currentEnv === 'SUNNY_PARK') {
        // Gentle golden sunlight specks
        p.y += p.speedY * 0.4;
        p.x += Math.sin(p.phase) * 0.5;
        if (p.y > this.height) { p.y = -10; p.x = Math.random() * this.width; }
        ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha * 0.35})`;
      } else if (this.currentEnv === 'CITY_SUNSET') {
        // Floating warm dusk particles
        p.y -= p.speedY * 0.5;
        p.x += Math.sin(p.phase) * 0.5;
        if (p.y < -10) { p.y = this.height + 10; p.x = Math.random() * this.width; }
        ctx.fillStyle = `rgba(251, 146, 60, ${p.alpha * 0.35})`;
      } else if (this.currentEnv === 'CYBER_TECH') {
        // Digital data particles
        p.y -= p.speedY * 0.8;
        if (p.y < -10) { p.y = this.height + 10; p.x = Math.random() * this.width; }
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.5})`;
      } else if (this.currentEnv === 'HIMALAYAN_SUMMIT') {
        p.y += p.speedY * 1.5;
        p.x += Math.sin(p.phase) * 1.2;
        if (p.y > this.height) { p.y = -10; p.x = Math.random() * this.width; }
        ctx.fillStyle = `rgba(241, 245, 249, ${p.alpha * 0.8})`;
      } else {
        // Soft, non-distracting ambient dust specks in indoor light
        p.y -= p.speedY * 0.25;
        p.x += Math.sin(p.phase) * 0.3;
        if (p.y < -10) { p.y = this.height + 10; p.x = Math.random() * this.width; }
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.16})`;
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SceneDirector };
}
