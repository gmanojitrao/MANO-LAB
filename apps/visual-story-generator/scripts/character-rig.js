/**
 * VISUAL STORY GENERATOR - MANO LAB
 * character-rig.js - High-Definition 2.5D Rigged Character Animation & Lip-Sync Engine
 * 
 * Features:
 * - Skeletal hierarchy (Root, Spine, Chest, Neck, Head, Jaw, Eyes, Brows, Arms, Cape)
 * - Anatomically sculpted, multi-layer shaded character archetypes
 * - Procedural breathing, head turns, and natural eye-blinking
 * - Real-time lip-sync mouth phonemes (REST, OPEN, ROUND, WIDE, FIERCE)
 * - Spring-damper secondary physics for flowing hair and cloth
 * - Dynamic lighting and rim-light shaders rendered in 2D canvas
 */

class CharacterRig {
  constructor() {
    // Current archetype: 'WARRIOR_KING', 'MYSTIC_SAGE', 'SHADOW_LORD', 'CELESTIAL_QUEEN'
    this.archetype = 'WARRIOR_KING';

    // Skeletal transforms (angles, offsets)
    this.bones = {
      rootX: 0,
      rootY: 0,
      breathScaleY: 1.0,
      spineAngle: 0,
      chestAngle: 0,
      neckAngle: 0,
      headAngle: 0,
      headOffsetX: 0,
      headOffsetY: 0,
      jawOpen: 0,          // 0 (closed) to 1 (wide open)
      mouthWidth: 1.0,     // 0.7 (pursed O) to 1.3 (wide E)
      mouthShape: 'REST',  // 'REST', 'A', 'O', 'E', 'FIERCE'
      eyeBlink: 0,         // 0 (open) to 1 (fully closed)
      eyeLookX: 0,         // -1 (left) to 1 (right)
      eyeLookY: 0,         // -1 (up) to 1 (down)
      browAngle: 0,        // -0.3 (worried/wise) to 0.4 (fierce/angry)
      leftArmAngle: 0.2,
      rightArmAngle: -0.2,
      gestureType: 'SPEAKING',
      hairSway: 0,
      capeSway: 0
    };

    // Animation physics states
    this.time = 0;
    this.blinkTimer = 2.5 + Math.random() * 2;
    this.isBlinking = false;
    this.blinkProgress = 0;

    // Secondary physics (spring-damper) for hair and accessories
    this.hairVel = 0;
    this.hairPos = 0;
    this.capeVel = 0;
    this.capePos = 0;

    // Dynamic lighting
    this.lightAngle = -0.6; // from top-left
    this.lightIntensity = 1.0;
    this.rimLightColor = '#facc15';
    this.shadowColor = 'rgba(5, 7, 15, 0.65)';
  }

  setArchetype(type) {
    this.archetype = type;
  }

  /**
   * Update character physics, breathing, blinking, and secondary motion
   */
  update(dt, audioAmplitude = 0, audioFreq = 0) {
    this.time += dt;

    // 1. Natural Breathing Cycle (heaving chest and shoulders)
    const breathSpeed = 1.8;
    this.bones.breathScaleY = 1.0 + Math.sin(this.time * breathSpeed) * 0.025;
    this.bones.chestAngle = Math.sin(this.time * breathSpeed) * 0.015;

    // 2. Head Cadence & Conversational Motion
    // When audio amplitude is higher (speaking), head moves expressively
    const speechInfluence = Math.min(1.0, audioAmplitude * 2.5);
    const naturalNod = Math.sin(this.time * 3.2) * 0.04 * speechInfluence;
    const naturalTilt = Math.cos(this.time * 1.5) * 0.025;
    this.bones.headAngle = naturalNod + naturalTilt;
    this.bones.headOffsetY = Math.sin(this.time * breathSpeed) * 3;

    // 3. Eye Blinking Logic
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0 && !this.isBlinking) {
      this.isBlinking = true;
      this.blinkProgress = 0;
      this.blinkTimer = 2.8 + Math.random() * 3.5;
    }

    if (this.isBlinking) {
      this.blinkProgress += dt * 14; // quick blink ~0.15s
      if (this.blinkProgress >= Math.PI) {
        this.isBlinking = false;
        this.bones.eyeBlink = 0;
      } else {
        this.bones.eyeBlink = Math.sin(this.blinkProgress);
      }
    }

    // Eye gaze slight tracking
    this.bones.eyeLookX = Math.sin(this.time * 0.8) * 0.25;
    this.bones.eyeLookY = Math.cos(this.time * 0.5) * 0.15;

    // 4. Real-Time Lip Sync from Audio Analysis
    if (audioAmplitude > 0.04) {
      // Mouth opening proportional to loudness
      const targetJaw = Math.min(1.0, audioAmplitude * 2.8);
      this.bones.jawOpen += (targetJaw - this.bones.jawOpen) * 0.45;

      // Higher frequency -> wide mouth (E/I), lower frequency -> round mouth (O/U)
      if (audioFreq > 1200) {
        this.bones.mouthWidth = 1.25;
        this.bones.mouthShape = 'E';
      } else if (audioFreq < 500) {
        this.bones.mouthWidth = 0.75;
        this.bones.mouthShape = 'O';
      } else {
        this.bones.mouthWidth = 1.0;
        this.bones.mouthShape = 'A';
      }
    } else {
      // Smoothly return to rest/closed lips
      this.bones.jawOpen += (0 - this.bones.jawOpen) * 0.3;
      this.bones.mouthWidth += (1.0 - this.bones.mouthWidth) * 0.3;
      this.bones.mouthShape = 'REST';
    }

    // 5. Spring-Damper Secondary Physics for Hair & Cape
    const hairTarget = -this.bones.headAngle * 12 + Math.sin(this.time * 2.5) * 4;
    const hairForce = (hairTarget - this.hairPos) * 16 - this.hairVel * 4;
    this.hairVel += hairForce * dt;
    this.hairPos += this.hairVel * dt;
    this.bones.hairSway = this.hairPos;

    const capeTarget = Math.sin(this.time * 2.0) * 10;
    const capeForce = (capeTarget - this.capePos) * 12 - this.capeVel * 3;
    this.capeVel += capeForce * dt;
    this.capePos += this.capeVel * dt;
    this.bones.capeSway = this.capePos;
  }

  /**
   * Main Render Method: Draws fully textured, anatomically sculpted character
   */
  render(ctx, centerX, centerY, scale = 1.0) {
    ctx.save();
    ctx.translate(centerX + this.bones.rootX, centerY + this.bones.rootY);
    ctx.scale(scale, scale * this.bones.breathScaleY);

    // Layer 1: Back Hair & Cloak / Armor Cape
    this.renderCape(ctx);
    this.renderBackHair(ctx);

    // Layer 2: Torso, Armor & Shoulders
    this.renderTorso(ctx);

    // Layer 3: Neck
    this.renderNeck(ctx);

    // Layer 4: Head, Facial Structure, Eyes, Nose, Mouth (Lip-Sync)
    ctx.save();
    ctx.translate(this.bones.headOffsetX, -160 + this.bones.headOffsetY);
    ctx.rotate(this.bones.headAngle);

    this.renderHead(ctx);
    this.renderFacialFeatures(ctx);
    this.renderCrownAndFrontHair(ctx);

    ctx.restore();

    // Layer 5: Front Arms, Hands & Sacred Artifact
    this.renderArms(ctx);

    ctx.restore();
  }

  /* ------------------- DRAWING COMPONENTS ------------------- */

  renderCape(ctx) {
    ctx.save();
    const sway = this.bones.capeSway;
    ctx.fillStyle = this.getCapeColor();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 18;

    ctx.beginPath();
    ctx.moveTo(-110, -110);
    ctx.quadraticCurveTo(-140 + sway, 120, -160 + sway * 1.5, 340);
    ctx.lineTo(160 + sway * 1.5, 340);
    ctx.quadraticCurveTo(140 + sway, 120, 110, -110);
    ctx.closePath();
    ctx.fill();

    // Gold trim on cape
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();
  }

  renderBackHair(ctx) {
    ctx.save();
    const sway = this.bones.hairSway;
    ctx.fillStyle = this.getHairColor();

    // Flowing locks behind shoulders
    ctx.beginPath();
    ctx.moveTo(-70, -160);
    ctx.quadraticCurveTo(-100 + sway, -40, -85 + sway * 1.2, 80);
    ctx.quadraticCurveTo(-60, 40, -40, -120);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(70, -160);
    ctx.quadraticCurveTo(100 + sway, -40, 85 + sway * 1.2, 80);
    ctx.quadraticCurveTo(60, 40, 40, -120);
    ctx.fill();

    ctx.restore();
  }

  renderTorso(ctx) {
    ctx.save();
    ctx.rotate(this.bones.chestAngle);

    // Anatomical chest plate & muscular armor
    const grad = ctx.createLinearGradient(-100, -120, 100, 120);
    const colors = this.getArmorColors();
    grad.addColorStop(0, colors.highlight);
    grad.addColorStop(0.5, colors.main);
    grad.addColorStop(1, colors.shadow);

    ctx.fillStyle = grad;
    ctx.strokeStyle = colors.trim;
    ctx.lineWidth = 3;

    // Muscular Cuirass shape
    ctx.beginPath();
    ctx.moveTo(-70, -110);
    ctx.lineTo(70, -110);
    ctx.lineTo(85, 0);
    ctx.lineTo(60, 130);
    ctx.lineTo(-60, 130);
    ctx.lineTo(-85, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pectoral / Chest plate sculpting lines
    ctx.strokeStyle = colors.trim;
    ctx.lineWidth = 2.5;

    // Left Pec
    ctx.beginPath();
    ctx.moveTo(-55, -80);
    ctx.quadraticCurveTo(-20, -75, 0, -45);
    ctx.quadraticCurveTo(-30, -25, -60, -40);
    ctx.stroke();

    // Right Pec
    ctx.beginPath();
    ctx.moveTo(55, -80);
    ctx.quadraticCurveTo(20, -75, 0, -45);
    ctx.quadraticCurveTo(30, -25, 60, -40);
    ctx.stroke();

    // Sacred Central Emblem (Surya / Lotus / Crest)
    this.renderChestEmblem(ctx);

    // Pauldrons (Heavy Shoulder Plates)
    this.renderPauldron(ctx, -95, -110, -0.2);
    this.renderPauldron(ctx, 95, -110, 0.2);

    ctx.restore();
  }

  renderPauldron(ctx, x, y, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // Tiered golden shoulder plate
    const colors = this.getArmorColors();
    ctx.fillStyle = colors.highlight;
    ctx.strokeStyle = colors.trim;
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner ridge
    ctx.beginPath();
    ctx.ellipse(0, 4, 34, 18, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  renderChestEmblem(ctx) {
    ctx.save();
    ctx.translate(0, -15);

    // Radiant Sun or Jewel in chest armor
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // 8 Golden Rays
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * 16, Math.sin(ang) * 16);
      ctx.lineTo(Math.cos(ang) * 26, Math.sin(ang) * 26);
      ctx.stroke();
    }
    ctx.restore();
  }

  renderNeck(ctx) {
    ctx.save();
    const skin = this.getSkinColors();
    const grad = ctx.createLinearGradient(-24, -140, 24, -110);
    grad.addColorStop(0, skin.main);
    grad.addColorStop(1, skin.shadow);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-26, -150);
    ctx.lineTo(26, -150);
    ctx.lineTo(32, -110);
    ctx.lineTo(-32, -110);
    ctx.closePath();
    ctx.fill();

    // Sternocleidomastoid neck muscle shadows
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-18, -145);
    ctx.lineTo(-6, -115);
    ctx.moveTo(18, -145);
    ctx.lineTo(6, -115);
    ctx.stroke();

    ctx.restore();
  }

  renderHead(ctx) {
    const skin = this.getSkinColors();
    const grad = ctx.createLinearGradient(-45, -60, 45, 60);
    grad.addColorStop(0, skin.highlight);
    grad.addColorStop(0.6, skin.main);
    grad.addColorStop(1, skin.shadow);

    ctx.fillStyle = grad;
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 12;

    // Anatomical Chiseled Jaw & Face Shape
    ctx.beginPath();
    ctx.moveTo(-44, -40);
    ctx.quadraticCurveTo(-46, 10, -32, 45); // Cheek to jaw
    ctx.lineTo(-14, 66 + this.bones.jawOpen * 8); // Jaw to chin
    ctx.lineTo(14, 66 + this.bones.jawOpen * 8);
    ctx.lineTo(32, 45);
    ctx.quadraticCurveTo(46, 10, 44, -40);
    ctx.quadraticCurveTo(0, -65, -44, -40); // Forehead dome
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cheekbone contour shading
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-38, 5);
    ctx.quadraticCurveTo(-24, 25, -12, 35);
    ctx.moveTo(38, 5);
    ctx.quadraticCurveTo(24, 25, 12, 35);
    ctx.stroke();

    // Sacred Tilak / Third Eye on forehead
    this.renderForeheadMark(ctx);
  }

  renderForeheadMark(ctx) {
    ctx.save();
    ctx.translate(0, -22);

    if (this.archetype === 'MYSTIC_SAGE' || this.archetype === 'WARRIOR_KING') {
      // Sacred Vibhuti / Chandan Tilak
      ctx.fillStyle = '#ef4444'; // Red kumkum
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.5, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden Urdhva Pundra line
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-8, -12);
      ctx.lineTo(-8, 6);
      ctx.quadraticCurveTo(0, 14, 8, 6);
      ctx.lineTo(8, -12);
      ctx.stroke();
    } else if (this.archetype === 'SHADOW_LORD') {
      // Glowing Demon Sigil
      ctx.fillStyle = '#dc2626';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(6, 4);
      ctx.lineTo(-6, 4);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  renderFacialFeatures(ctx) {
    const skin = this.getSkinColors();

    // 1. Nose
    ctx.save();
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(-2, 18);
    ctx.lineTo(-7, 24);
    ctx.lineTo(7, 24);
    ctx.lineTo(3, 18);
    ctx.stroke();

    // Nostrils
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.arc(-5, 23, 1.8, 0, Math.PI * 2);
    ctx.arc(5, 23, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Eyes & Eyebrows
    this.renderEye(ctx, -22, -2, -1);
    this.renderEye(ctx, 22, -2, 1);

    // 3. Dynamic Animated Mouth (Lip-Sync Engine)
    this.renderMouth(ctx, 0, 44);
  }

  renderEye(ctx, x, y, side) {
    ctx.save();
    ctx.translate(x, y);

    const blink = this.bones.eyeBlink;
    const eyeH = 10 * (1 - blink);

    // Eyebrow (Arching with emotion)
    ctx.strokeStyle = this.getHairColor();
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const browTilt = (this.bones.browAngle || 0.2) * side;
    ctx.moveTo(-16, -14 - browTilt * 8);
    ctx.quadraticCurveTo(0, -18 - browTilt * 4, 16, -13 + browTilt * 8);
    ctx.stroke();

    if (eyeH < 1.0) {
      // Eye completely closed: draw closed lash line
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.quadraticCurveTo(0, 3, 14, 0);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Eye Sclera (White)
    ctx.fillStyle = '#fafafa';
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, eyeH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Clip to eye contour for iris
    ctx.clip();

    // Iris & Pupil with gaze tracking
    const lookX = this.bones.eyeLookX * 5;
    const lookY = this.bones.eyeLookY * 3;

    // Glowing Iris
    const irisGrad = ctx.createRadialGradient(lookX, lookY, 1, lookX, lookY, 7);
    const irisColor = this.getIrisColor();
    irisGrad.addColorStop(0, '#ffffff');
    irisGrad.addColorStop(0.3, irisColor);
    irisGrad.addColorStop(1, '#09090b');

    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(lookX, lookY, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(lookX, lookY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Specular Light Highlight (Life-glint in the eye)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(lookX - 2.5, lookY - 2.5, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Real-time Lip-Sync Mouth Renderer
   * Morphs dynamically between REST, A, O, E, and FIERCE with audio amplitude
   */
  renderMouth(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    const open = this.bones.jawOpen;
    const widthMul = this.bones.mouthWidth;
    const shape = this.bones.mouthShape;

    const baseW = 18 * widthMul;
    const openH = Math.max(1, open * 16);

    if (open < 0.08) {
      // Resting / Closed Lips
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-baseW, 0);
      ctx.quadraticCurveTo(0, 2, baseW, 0);
      ctx.stroke();

      // Upper lip cupid's bow
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-baseW * 0.7, -1);
      ctx.quadraticCurveTo(0, -3, baseW * 0.7, -1);
      ctx.stroke();
    } else {
      // Open Speaking Mouth (Phoneme Formation)
      // Inner Dark Cavity
      ctx.fillStyle = '#450a0a';
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      if (shape === 'O') {
        // Round O phoneme
        ctx.ellipse(0, openH * 0.4, baseW * 0.65, openH * 0.8, 0, 0, Math.PI * 2);
      } else {
        // A or E wide phoneme
        ctx.moveTo(-baseW, 0);
        ctx.quadraticCurveTo(0, -openH * 0.4, baseW, 0);
        ctx.quadraticCurveTo(0, openH * 1.2, -baseW, 0);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Top White Teeth Row
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.rect(-baseW * 0.6, -1, baseW * 1.2, Math.min(5, openH * 0.4));
      ctx.fill();

      // Tongue
      if (openH > 6) {
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.ellipse(0, openH * 0.7, baseW * 0.4, openH * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Upper and lower lips
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-baseW, 0);
      ctx.quadraticCurveTo(0, -openH * 0.4 - 2, baseW, 0);
      ctx.moveTo(-baseW, 0);
      ctx.quadraticCurveTo(0, openH * 1.2 + 2, baseW, 0);
      ctx.stroke();
    }

    ctx.restore();
  }

  renderCrownAndFrontHair(ctx) {
    ctx.save();
    const colors = this.getArmorColors();

    if (this.archetype === 'WARRIOR_KING') {
      // Majestic Multi-tiered Golden Mukut / Crown
      ctx.fillStyle = colors.highlight;
      ctx.strokeStyle = colors.trim;
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(250, 204, 21, 0.4)';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.moveTo(-50, -45);
      ctx.lineTo(-40, -90);
      ctx.lineTo(-20, -75);
      ctx.lineTo(0, -115); // Central tallest spire
      ctx.lineTo(20, -75);
      ctx.lineTo(40, -90);
      ctx.lineTo(50, -45);
      ctx.quadraticCurveTo(0, -35, -50, -45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Central Royal Ruby Gem in crown
      ctx.fillStyle = '#dc2626';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, -75, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.archetype === 'MYSTIC_SAGE') {
      // Jata / High matted ascetic hair bun with rudraksha
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(0, -70, 36, 0, Math.PI * 2);
      ctx.fill();

      // Rudraksha bead necklace around jata
      ctx.fillStyle = '#78350f';
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(i * 10, -55, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.archetype === 'SHADOW_LORD') {
      // Demonic Horned War Helm
      ctx.fillStyle = '#09090b';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;

      // Left Horn
      ctx.beginPath();
      ctx.moveTo(-35, -50);
      ctx.quadraticCurveTo(-70, -90, -85, -125);
      ctx.quadraticCurveTo(-55, -95, -20, -65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Horn
      ctx.beginPath();
      ctx.moveTo(35, -50);
      ctx.quadraticCurveTo(70, -90, 85, -125);
      ctx.quadraticCurveTo(55, -95, 20, -65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  renderArms(ctx) {
    ctx.save();
    const colors = this.getArmorColors();
    const skin = this.getSkinColors();

    // Left Arm (Resting on belt/sword pommel)
    ctx.save();
    ctx.translate(-85, -90);
    ctx.rotate(this.bones.leftArmAngle);
    // Bicep armor
    ctx.fillStyle = colors.main;
    ctx.strokeStyle = colors.trim;
    ctx.lineWidth = 2.5;
    ctx.fillRect(-18, 0, 32, 100);
    ctx.strokeRect(-18, 0, 32, 100);
    // Forearm bracer
    ctx.fillStyle = colors.highlight;
    ctx.fillRect(-16, 90, 28, 85);
    ctx.strokeRect(-16, 90, 28, 85);
    // Clenched fist
    ctx.fillStyle = skin.main;
    ctx.beginPath();
    ctx.arc(-2, 185, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right Arm (Gesture arm: raised in oration or pointing)
    ctx.save();
    ctx.translate(85, -90);
    const speechGesture = Math.sin(this.time * 2.5) * 0.08;
    ctx.rotate(this.bones.rightArmAngle + speechGesture);
    // Bicep armor
    ctx.fillStyle = colors.main;
    ctx.strokeStyle = colors.trim;
    ctx.lineWidth = 2.5;
    ctx.fillRect(-14, 0, 32, 100);
    ctx.strokeRect(-14, 0, 32, 100);
    // Forearm bracer
    ctx.fillStyle = colors.highlight;
    ctx.fillRect(-12, 90, 28, 85);
    ctx.strokeRect(-12, 90, 28, 85);
    // Expressive open gesture hand
    ctx.fillStyle = skin.main;
    ctx.beginPath();
    ctx.ellipse(2, 185, 12, 16, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  /* ------------------- PALETTE SYSTEM ------------------- */

  getSkinColors() {
    switch (this.archetype) {
      case 'MYSTIC_SAGE':
        return { highlight: '#d1d5db', main: '#9ca3af', shadow: '#4b5563' }; // Sacred ash smeared
      case 'SHADOW_LORD':
        return { highlight: '#3f3f46', main: '#27272a', shadow: '#18181b' }; // Obsidian ash
      case 'CELESTIAL_QUEEN':
        return { highlight: '#ffedd5', main: '#fed7aa', shadow: '#f97316' }; // Luminous warm peach
      default: // WARRIOR_KING
        return { highlight: '#fed7aa', main: '#fba868', shadow: '#c2410c' }; // Radiant bronze gold
    }
  }

  getArmorColors() {
    switch (this.archetype) {
      case 'MYSTIC_SAGE':
        return { highlight: '#f59e0b', main: '#b45309', shadow: '#78350f', trim: '#fde047' }; // Saffron & gold
      case 'SHADOW_LORD':
        return { highlight: '#27272a', main: '#18181b', shadow: '#09090b', trim: '#ef4444' }; // Crimson & obsidian
      case 'CELESTIAL_QUEEN':
        return { highlight: '#e0e7ff', main: '#818cf8', shadow: '#4338ca', trim: '#facc15' }; // Royal violet & silk
      default: // WARRIOR_KING
        return { highlight: '#facc15', main: '#ca8a04', shadow: '#713f12', trim: '#fef08a' }; // Sovereign 24k gold
    }
  }

  getCapeColor() {
    switch (this.archetype) {
      case 'MYSTIC_SAGE': return '#b45309'; // Saffron
      case 'SHADOW_LORD': return '#450a0a'; // Blood dark crimson
      case 'CELESTIAL_QUEEN': return '#4338ca'; // Royal indigo
      default: return '#7f1d1d'; // Regal royal maroon
    }
  }

  getHairColor() {
    switch (this.archetype) {
      case 'MYSTIC_SAGE': return '#27272a';
      case 'SHADOW_LORD': return '#09090b';
      case 'CELESTIAL_QUEEN': return '#1e1b4b';
      default: return '#18181b'; // Jet black
    }
  }

  getIrisColor() {
    switch (this.archetype) {
      case 'MYSTIC_SAGE': return '#38bdf8'; // Glowing celestial blue
      case 'SHADOW_LORD': return '#ef4444'; // Piercing blood red
      case 'CELESTIAL_QUEEN': return '#a855f7'; // Mystical amethyst
      default: return '#f59e0b'; // Blazing amber gold
    }
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.CharacterRig = CharacterRig;
}
