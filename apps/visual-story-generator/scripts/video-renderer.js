/**
 * VISUAL STORY GENERATOR - MANO LAB
 * video-renderer.js - 2.5D Motion Canvas, Scene Compositor, Viral Subtitles & Video Exporter
 */

class StoryVideoRenderer {
  constructor(canvas, audioEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audioEngine;

    // 9:16 Vertical Dimensions (standard 540x960 base resolution, scales crisply)
    this.width = 540;
    this.height = 960;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Playback state
    this.currentStory = null;
    this.currentSceneIndex = 0;
    this.sceneTime = 0;
    this.isPlaying = false;
    this.lastFrameTime = performance.now();
    this.activeWordIndex = 0;

    // Subtitle style config
    this.subtitleConfig = {
      fontFamily: '"Montserrat", "Plus Jakarta Sans", sans-serif',
      fontSize: 26,
      activeColor: '#facc15', // Vibrant Viral Gold
      inactiveColor: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 5,
      yPosPercent: 0.76 // Lower third
    };

    // Particle systems
    this.particles = [];
    this.initParticles(80);

    // MediaRecorder for exporting videos
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.onRecordingComplete = null;

    // Cached image objects for custom uploaded scene art
    this.sceneImages = {};
  }

  initParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 1.5 + Math.random() * 3.5,
        speedY: 0.4 + Math.random() * 1.2,
        speedX: (Math.random() - 0.5) * 0.6,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? 'rgba(250, 204, 21, ' : 'rgba(255, 255, 255, '
      });
    }
  }

  loadStory(story) {
    this.currentStory = story;
    this.currentSceneIndex = 0;
    this.sceneTime = 0;
    this.activeWordIndex = 0;
    this.renderFrame(0);
  }

  getCurrentScene() {
    if (!this.currentStory || !this.currentStory.scenes) return null;
    return this.currentStory.scenes[this.currentSceneIndex] || null;
  }

  setUploadedImage(sceneIndex, imgElement) {
    this.sceneImages[sceneIndex] = imgElement;
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastFrameTime = performance.now();

    // Start background music
    this.audio.startBgm(this.currentStory.theme || 'mythic-epic');

    // Trigger first scene narration
    this.triggerSceneNarration();

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  pause() {
    this.isPlaying = false;
    this.audio.stopBgm();
    this.audio.stopNarration();
  }

  jumpToScene(index) {
    if (!this.currentStory) return;
    this.currentSceneIndex = Math.max(0, Math.min(this.currentStory.scenes.length - 1, index));
    this.sceneTime = 0;
    this.activeWordIndex = 0;
    this.audio.playWhoosh();
    if (this.isPlaying) {
      this.triggerSceneNarration();
    }
    this.renderFrame(0);
  }

  triggerSceneNarration() {
    const scene = this.getCurrentScene();
    if (!scene) return;

    const textToSpeak = scene.narrationHindi || scene.narrationEnglish;
    const words = textToSpeak.split(/\s+/);

    this.activeWordIndex = 0;

    // Track word positions
    this.audio.speakNarration(
      textToSpeak,
      'hi-IN',
      (charIndex) => {
        // Calculate which word corresponds to charIndex
        const sub = textToSpeak.substring(0, charIndex).trim();
        const currentW = sub.length > 0 ? sub.split(/\s+/).length : 0;
        this.activeWordIndex = Math.min(words.length - 1, currentW);
      },
      () => {
        // Narration finished, advance scene slightly after speech
      }
    );
  }

  loop(timestamp) {
    if (!this.isPlaying) return;

    const dt = Math.min(0.1, (timestamp - this.lastFrameTime) / 1000);
    this.lastFrameTime = timestamp;

    this.sceneTime += dt;
    const scene = this.getCurrentScene();

    if (scene && this.sceneTime >= scene.duration) {
      // Advance to next scene or loop back
      if (this.currentSceneIndex < this.currentStory.scenes.length - 1) {
        this.currentSceneIndex++;
        this.sceneTime = 0;
        this.activeWordIndex = 0;
        this.audio.playWhoosh();
        this.triggerSceneNarration();
      } else {
        // End of story
        if (this.isRecording) {
          this.stopRecording();
        }
        this.pause();
        return;
      }
    }

    this.renderFrame(dt);
    requestAnimationFrame(this.loop);
  }

  /**
   * Main Render Pipeline
   */
  renderFrame(dt) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const scene = this.getCurrentScene();

    if (!scene) {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);
      return;
    }

    const t = Math.min(1.0, this.sceneTime / (scene.duration || 6)); // 0 to 1

    ctx.save();

    // 1. Apply 2.5D Camera Movement
    this.applyCameraTransform(ctx, scene.cameraMotion, t);

    // 2. Render Scene Visual (Image or Procedural Canvas Artwork)
    if (this.sceneImages[this.currentSceneIndex]) {
      this.renderImageBackground(ctx, this.sceneImages[this.currentSceneIndex]);
    } else {
      this.renderProceduralArtwork(ctx, scene.bgStyle, t);
    }

    ctx.restore();

    // 3. Render Atmospheric Overlay FX (Rays, Embers, Smoke)
    this.renderParticlesAndVFX(ctx, scene.vfx, dt, t);

    // 4. Render Cinematic Vignette & Color Grading
    this.renderVignette(ctx);

    // 5. Render Scene Progress Tracker (Top Bar)
    this.renderTimelineHeader(ctx, scene, t);

    // 6. Render Viral Kinetic Subtitles (Lower Third)
    this.renderViralSubtitles(ctx, scene);
  }

  /**
   * 2.5D Camera Transformation Matrix (Ken Burns Zoom, Pan, Shake)
   */
  applyCameraTransform(ctx, motionType, t) {
    const cx = this.width / 2;
    const cy = this.height / 2;
    ctx.translate(cx, cy);

    let scale = 1.0;
    let dx = 0;
    let dy = 0;

    switch (motionType) {
      case 'ZOOM_IN':
        scale = 1.0 + t * 0.22;
        break;
      case 'ZOOM_OUT':
        scale = 1.25 - t * 0.22;
        break;
      case 'PAN_UP':
        scale = 1.15;
        dy = 40 - t * 80;
        break;
      case 'PAN_LEFT':
        scale = 1.15;
        dx = 50 - t * 100;
        break;
      case 'SHAKE_PULSE':
        scale = 1.1 + Math.sin(t * 16) * 0.05;
        dx = (Math.random() - 0.5) * 6;
        dy = (Math.random() - 0.5) * 6;
        break;
      default:
        scale = 1.0 + t * 0.12;
        break;
    }

    ctx.scale(scale, scale);
    ctx.translate(dx, dy);
    ctx.translate(-cx, -cy);
  }

  renderImageBackground(ctx, img) {
    // Aspect fill image onto canvas
    const imgRatio = img.width / img.height;
    const canvasRatio = this.width / this.height;
    let dw, dh, dx, dy;

    if (imgRatio > canvasRatio) {
      dh = this.height;
      dw = this.height * imgRatio;
      dx = (this.width - dw) / 2;
      dy = 0;
    } else {
      dw = this.width;
      dh = this.width / imgRatio;
      dx = 0;
      dy = (this.height - dh) / 2;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  /**
   * Procedural Generative High-Detail Scene Artwork
   */
  renderProceduralArtwork(ctx, bgStyle, t) {
    const w = this.width;
    const h = this.height;

    // Default: Cosmic / Mythic Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);

    if (bgStyle === 'cosmic_clouds') {
      // Golden Cosmic Sheshnag Scene
      grad.addColorStop(0, '#1c1032');
      grad.addColorStop(0.5, '#431407');
      grad.addColorStop(1, '#05020a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Swirling Golden Nebula
      this.drawNebulaGlow(ctx, w / 2, h * 0.4, 240, 'rgba(234, 179, 8, 0.35)');

      // Serpent Coils silhouette
      this.drawSerpentSilhouette(ctx, w / 2, h * 0.45, 120, '#facc15', t);
    } 
    else if (bgStyle === 'mountain_fire') {
      // Snow Peaks & Penance Fire
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.6, '#1e1b4b');
      grad.addColorStop(1, '#450a0a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sacred Himalayan mountain peaks
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.moveTo(-40, h * 0.75);
      ctx.lineTo(w * 0.4, h * 0.35);
      ctx.lineTo(w * 0.8, h * 0.6);
      ctx.lineTo(w + 50, h * 0.38);
      ctx.lineTo(w + 50, h);
      ctx.lineTo(-40, h);
      ctx.fill();

      // Penance sacred fire glow
      this.drawNebulaGlow(ctx, w * 0.5, h * 0.7, 180, 'rgba(249, 115, 22, 0.45)');
    }
    else if (bgStyle === 'ocean_of_milk') {
      // Kshirasagara / Celestial Ocean of Milk
      grad.addColorStop(0, '#082f49');
      grad.addColorStop(0.5, '#0e7490');
      grad.addColorStop(1, '#ecfeff');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      this.drawNebulaGlow(ctx, w * 0.5, h * 0.3, 200, 'rgba(255, 255, 255, 0.6)');
      // Multi-headed Adishesha silhouette
      this.drawMultiHeadSerpent(ctx, w * 0.5, h * 0.5, t);
    }
    else if (bgStyle === 'churning_ocean') {
      // Violent churning Samudra Manthan
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.4, '#172554');
      grad.addColorStop(0.8, '#064e3b'); // Emerald poison mist
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      this.drawNebulaGlow(ctx, w * 0.5, h * 0.55, 220, 'rgba(16, 185, 129, 0.4)');
      // Mount Mandara pillar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(w * 0.42, h * 0.2, w * 0.16, h * 0.6);
    }
    else if (bgStyle === 'shiva_aura') {
      // Mahadev Shiva Serene Blue Aura
      grad.addColorStop(0, '#030712');
      grad.addColorStop(0.4, '#0f172a');
      grad.addColorStop(0.7, '#1e3a8a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Third eye / Crescent moon glow
      this.drawNebulaGlow(ctx, w * 0.5, h * 0.38, 200, 'rgba(56, 189, 248, 0.45)');
      this.drawShivaEmblem(ctx, w * 0.5, h * 0.42, t);
    }
    else {
      // Generic deep cosmic
      grad.addColorStop(0, '#090514');
      grad.addColorStop(0.5, '#1e1035');
      grad.addColorStop(1, '#05020a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      this.drawNebulaGlow(ctx, w * 0.5, h * 0.4, 200, 'rgba(168, 85, 247, 0.35)');
    }
  }

  drawNebulaGlow(ctx, x, y, radius, color) {
    const radial = ctx.createRadialGradient(x, y, 10, x, y, radius);
    radial.addColorStop(0, color);
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSerpentSilhouette(ctx, x, y, size, strokeColor, t) {
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 24;

    // Undulating sine curve for divine serpent body
    ctx.beginPath();
    for (let i = -100; i <= 100; i += 4) {
      const px = x + i * 1.6;
      const py = y + Math.sin((i * 0.05) + (t * 4)) * (size * 0.45);
      if (i === -100) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Serpent Head with glowing eyes
    const headX = x + 160;
    const headY = y + Math.sin(100 * 0.05 + t * 4) * (size * 0.45);
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(headX, headY, 18, 0, Math.PI * 2);
    ctx.fill();

    // Eye glow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(headX + 5, headY - 4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawMultiHeadSerpent(ctx, x, y, t) {
    ctx.save();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 8;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 20;

    // 5 Radiant Hoods
    const hoods = [-40, -20, 0, 20, 40];
    hoods.forEach((offset, idx) => {
      ctx.beginPath();
      ctx.moveTo(x, y + 100);
      const hx = x + offset * 2.5;
      const hy = y - 40 - Math.abs(offset) * 0.5 + Math.sin(t * 3 + idx) * 8;
      ctx.quadraticCurveTo(x + offset, y + 20, hx, hy);
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(hx, hy, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  drawShivaEmblem(ctx, x, y, t) {
    ctx.save();
    // Crescent Moon
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(x - 30, y - 60, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x - 24, y - 66, 18, 0, Math.PI * 2);
    ctx.fill();

    // Third eye vertical light slit
    ctx.fillStyle = '#f97316';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.ellipse(x, y - 30, 6, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vasuki Serpent around the neck
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 10;
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(x, y + 30, 50, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Atmospheric Particles (Golden Embers, Divine Rays)
   */
  renderParticlesAndVFX(ctx, vfxType, dt, t) {
    ctx.save();

    // Floating Embers
    for (let p of this.particles) {
      p.y -= p.speedY;
      p.x += p.speedX + Math.sin(p.phase + t * 4) * 0.4;

      if (p.y < 0) {
        p.y = this.height;
        p.x = Math.random() * this.width;
      }

      const alpha = 0.3 + 0.6 * (1 - p.y / this.height);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Volumetric Divine Rays
    if (vfxType === 'DIVINE_RAYS') {
      const rayGrad = ctx.createLinearGradient(0, 0, this.width, this.height * 0.7);
      rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
      rayGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.08)');
      rayGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(this.width * 0.5, 0);
      ctx.lineTo(this.width * 0.1, this.height);
      ctx.lineTo(this.width * 0.9, this.height);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Dark cinematic edge vignette
   */
  renderVignette(ctx) {
    const w = this.width;
    const h = this.height;
    const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.7);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.75)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  /**
   * Top Scene Progress Indicator
   */
  renderTimelineHeader(ctx, scene, t) {
    const w = this.width;
    const totalScenes = this.currentStory.scenes.length;
    const pad = 12;
    const barWidth = (w - pad * 2 - (totalScenes - 1) * 6) / totalScenes;
    const barY = 24;

    for (let i = 0; i < totalScenes; i++) {
      const bx = pad + i * (barWidth + 6);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(bx, barY, barWidth, 4);

      if (i < this.currentSceneIndex) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx, barY, barWidth, 4);
      } else if (i === this.currentSceneIndex) {
        ctx.fillStyle = '#facc15';
        ctx.fillRect(bx, barY, barWidth * t, 4);
      }
    }

    // Top Title Branding
    ctx.font = '600 12px "Montserrat", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText((this.currentStory.title || '').toUpperCase(), pad, barY + 22);

    ctx.font = '700 11px "Montserrat", sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'right';
    ctx.fillText(`SCENE ${this.currentSceneIndex + 1}/${totalScenes}`, w - pad, barY + 22);
  }

  /**
   * Viral Kinetic Subtitles (Karaoke word-by-word highlighted text)
   */
  renderViralSubtitles(ctx, scene) {
    const text = scene.narrationHindi || scene.narrationEnglish || '';
    if (!text) return;

    const words = text.split(/\s+/);
    const cfg = this.subtitleConfig;

    ctx.save();
    ctx.font = `800 ${cfg.fontSize}px ${cfg.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Break words into chunks of 3-4 words per line for viral mobile readability
    const chunkSize = 4;
    const currentChunkIndex = Math.floor(this.activeWordIndex / chunkSize);
    const startWord = currentChunkIndex * chunkSize;
    const endWord = Math.min(words.length, startWord + chunkSize);
    const visibleWords = words.slice(startWord, endWord);

    const centerY = this.height * cfg.yPosPercent;

    // Measure total line width to center each word cleanly
    let totalLineWidth = 0;
    const spaceWidth = ctx.measureText(' ').width;
    const wordWidths = visibleWords.map(w => {
      const mw = ctx.measureText(w).width;
      totalLineWidth += mw;
      return mw;
    });
    totalLineWidth += spaceWidth * (visibleWords.length - 1);

    let startX = (this.width - totalLineWidth) / 2;

    // Draw dark glassmorphic backing box behind subtitles
    const boxPadX = 18;
    const boxPadY = 12;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.roundRect(
      startX - boxPadX,
      centerY - cfg.fontSize / 2 - boxPadY,
      totalLineWidth + boxPadX * 2,
      cfg.fontSize + boxPadY * 2,
      10
    );
    ctx.fill();

    // Render individual words with active bounce highlight
    visibleWords.forEach((word, idx) => {
      const globalWordIdx = startWord + idx;
      const isCurrent = (globalWordIdx === this.activeWordIndex);

      ctx.save();
      const wx = startX + wordWidths[idx] / 2;

      if (isCurrent) {
        // Active word bounce & glow pop
        ctx.translate(wx, centerY);
        ctx.scale(1.12, 1.12);
        ctx.fillStyle = cfg.activeColor;
        ctx.shadowColor = cfg.activeColor;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = cfg.strokeColor;
        ctx.lineWidth = cfg.strokeWidth + 1;
        ctx.strokeText(word, 0, 0);
        ctx.fillText(word, 0, 0);
      } else {
        ctx.fillStyle = cfg.inactiveColor;
        ctx.strokeStyle = cfg.strokeColor;
        ctx.lineWidth = cfg.strokeWidth;
        ctx.strokeText(word, wx, centerY);
        ctx.fillText(word, wx, centerY);
      }

      ctx.restore();
      startX += wordWidths[idx] + spaceWidth;
    });

    ctx.restore();
  }

  /**
   * Video Recording Engine (Export to WebM / MP4)
   */
  startRecording() {
    if (this.isRecording) return;
    this.isRecording = true;
    this.recordedChunks = [];

    // Combine canvas video stream + WebAudio destination stream
    const canvasStream = this.canvas.captureStream(30); // 30 FPS crisp recording
    const audioStream = this.audio.destinationNode ? this.audio.destinationNode.stream : null;

    let combinedStream = canvasStream;
    if (audioStream && audioStream.getAudioTracks().length > 0) {
      combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);
    }

    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4'
    ];
    let chosenMime = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';

    this.mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: chosenMime,
      videoBitsPerSecond: 4000000 // 4 Mbps high quality
    });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: chosenMime });
      this.isRecording = false;
      if (this.onRecordingComplete) {
        this.onRecordingComplete(blob);
      }
    };

    this.mediaRecorder.start(250); // Collect chunk every 250ms

    // Start playback from scene 0
    this.jumpToScene(0);
    this.play();
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.StoryVideoRenderer = StoryVideoRenderer;
}
