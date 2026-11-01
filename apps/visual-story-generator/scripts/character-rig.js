/**
 * VISUAL STORY GENERATOR - MANO LAB
 * character-rig.js - Parametric 2.5D Rigged Character Engine
 * 
 * True Human Proportions (7.8 Heads Tall), Anatomical Body Types,
 * Sculpted Facial Features (No Cheek Blobs), Articulated Limbs & Natural Kinematics.
 */

// Universal Body Silhouettes
const BODY_TYPES = {
  ATHLETIC: {
    id: 'ATHLETIC',
    shoulderWidth: 88,
    chestWidth: 80,
    waistWidth: 54,
    hipWidth: 60,
    legThickness: 1.12,
    armThickness: 1.1,
    heightScale: 1.02
  },
  SLIM_TALL: {
    id: 'SLIM_TALL',
    shoulderWidth: 70,
    chestWidth: 66,
    waistWidth: 46,
    hipWidth: 52,
    legThickness: 0.9,
    armThickness: 0.88,
    heightScale: 1.06
  },
  AVERAGE: {
    id: 'AVERAGE',
    shoulderWidth: 76,
    chestWidth: 72,
    waistWidth: 54,
    hipWidth: 58,
    legThickness: 1.0,
    armThickness: 1.0,
    heightScale: 1.0
  },
  BROAD: {
    id: 'BROAD',
    shoulderWidth: 96,
    chestWidth: 88,
    waistWidth: 72,
    hipWidth: 74,
    legThickness: 1.25,
    armThickness: 1.2,
    heightScale: 0.98
  },
  FEMININE_CURVED: {
    id: 'FEMININE_CURVED',
    shoulderWidth: 66,
    chestWidth: 68,
    waistWidth: 44,
    hipWidth: 66,
    legThickness: 0.95,
    armThickness: 0.9,
    heightScale: 0.96
  },
  ELDER: {
    id: 'ELDER',
    shoulderWidth: 72,
    chestWidth: 70,
    waistWidth: 58,
    hipWidth: 58,
    legThickness: 0.92,
    armThickness: 0.9,
    heightScale: 0.97
  }
};

// Natural Skin Tone Palettes
const SKIN_TONES = {
  FAIR: {
    base: '#f6d5c2',
    highlight: '#fff1e8',
    shadow: '#dba589',
    rim: '#ffffff'
  },
  PEACH: {
    base: '#eec19e',
    highlight: '#fae2ce',
    shadow: '#c9936e',
    rim: '#fff8f2'
  },
  OLIVE: {
    base: '#cfa276',
    highlight: '#e7c5a2',
    shadow: '#9e6d42',
    rim: '#f9edd8'
  },
  BRONZE: {
    base: '#ad7143',
    highlight: '#cb9162',
    shadow: '#79451c',
    rim: '#f4d2b2'
  },
  AMBER: {
    base: '#884d26',
    highlight: '#ad6a3a',
    shadow: '#592f11',
    rim: '#df9e6d'
  },
  ESPRESSO: {
    base: '#4d2b1b',
    highlight: '#72422b',
    shadow: '#2b1409',
    rim: '#9c664c'
  },
  // Artistic / Lore option
  CELESTIAL_BLUE: {
    base: '#2563eb',
    highlight: '#93c5fd',
    shadow: '#1e40af',
    rim: '#dbeafe'
  }
};

class CharacterRig {
  constructor(profile = {}, initialX = 0, initialY = 0) {
    this.x = initialX;
    this.y = initialY;
    this.targetX = initialX;
    this.targetY = initialY;
    this.walkSpeed = 4.2;
    this.facing = 1; // 1 = right, -1 = left

    // Anatomical profile
    this.profile = this.sanitizeProfile(profile);

    // Bone transforms and angles (radians)
    this.bones = {
      // Cranial & Facial
      headAngle: 0,
      headTilt: 0,
      headBobY: 0,
      jawOpen: 0,
      mouthWidth: 1.0,
      eyeBlink: 0,
      eyeLookX: 0,
      eyeLookY: 0,
      browTilt: 0,

      // Torso & Pelvis
      chestAngle: 0,
      pelvisY: 0,
      pelvisSway: 0,

      // Left Arm
      leftShoulderAngle: 0.1,
      leftElbowAngle: 0.15,
      leftWristAngle: 0,

      // Right Arm
      rightShoulderAngle: -0.1,
      rightElbowAngle: -0.15,
      rightWristAngle: 0,

      // Left Leg
      leftHipAngle: 0,
      leftKneeAngle: 0,
      leftAnkleAngle: 0,

      // Right Leg
      rightHipAngle: 0,
      rightKneeAngle: 0,
      rightAnkleAngle: 0
    };

    // Kinematics and active state
    this.pose = this.profile.pose || 'NEUTRAL_CONVERSATIONAL';
    this.heldItem = this.profile.heldItem || 'NONE';
    this.isSpeaking = false;
    this.phoneme = 'REST';
    this.time = Math.random() * 100;
    this.walkCycle = 0;
    this.isWalking = false;
    this.blinkTimer = 2.0 + Math.random() * 2.5;

    // Head proportions (normalized)
    this.headHeight = 70;
    this.headWidth = 50;
  }

  // Getters & Setters for Staging Engine Compatibility
  get worldX() { return this.x; }
  set worldX(val) { this.x = val; }
  get worldY() { return this.y; }
  set worldY(val) { this.y = val; }
  get currentX() { return this.x; }
  set currentX(val) { this.x = val; }
  get currentY() { return this.y; }
  set currentY(val) { this.y = val; }

  setName(name) {
    this.profile.name = name;
  }

  setOutfit(type, mainColor, accentColor) {
    if (type) this.profile.outfit = type;
    if (mainColor) this.profile.torsoColors.main = mainColor;
    if (accentColor) this.profile.torsoColors.accent = accentColor;
  }

  setHair(style, color) {
    if (style) this.profile.hair.style = style;
    if (color) this.profile.hair.color = color;
  }

  setSkinTone(base, highlight, shadow) {
    this.profile.skin = { base, highlight: highlight || base, shadow: shadow || base };
  }

  setAccessory(acc) {
    this.profile.accessories = acc;
  }

  setHeldItem(item) {
    this.heldItem = item;
    this.profile.heldItem = item;
  }

  setPose(pose) {
    this.pose = pose;
    this.profile.pose = pose;
  }

  setArchetype(key) {
    const p = CharacterRig.synthesizeFromPrompt(key);
    this.profile = this.sanitizeProfile(p);
    this.heldItem = this.profile.heldItem;
    this.pose = this.profile.pose;
  }

  sanitizeProfile(p) {
    if (typeof p === 'string') {
      p = CharacterRig.synthesizeFromPrompt(p);
    }
    const bodyType = BODY_TYPES[p?.bodyType] ? p.bodyType : 'AVERAGE';
    const skin = p?.skin || SKIN_TONES.PEACH;

    return {
      name: p?.name || 'Character',
      role: p?.role || 'Citizen',
      gender: p?.gender || 'M',
      bodyType: bodyType,
      headShape: p?.headShape || 'OVAL', // OVAL, CHISELED, ROUND, HEART, SQUARE
      skin: skin,
      eyes: {
        size: p?.eyes?.size || 1.0,
        iris: p?.eyes?.iris || '#3b2518',
        glow: p?.eyes?.glow || null
      },
      hair: {
        style: p?.hair?.style || 'SHORT_CROP',
        color: p?.hair?.color || '#18181b',
        sway: p?.hair?.sway || 0.4
      },
      facialHair: p?.facialHair || 'NONE',
      accessories: p?.accessories || 'NONE', // NONE, GLASSES, WATCH, HAT
      outfit: p?.outfit || 'MODERN_CASUAL', // TAILORED_BLAZER, MODERN_CASUAL, CLASSIC_OVERCOAT, LAB_COAT, CYBERPUNK_JACKET, HISTORICAL_ROBE, CASUAL_TEE
      torsoColors: p?.torsoColors || {
        main: '#1e293b',
        highlight: '#334155',
        shadow: '#0f172a',
        accent: '#38bdf8'
      },
      legColors: p?.legColors || {
        main: '#0f172a',
        shadow: '#020617'
      },
      shoeColors: p?.shoeColors || {
        main: '#ffffff',
        sole: '#0f172a'
      },
      heldItem: p?.heldItem || 'NONE',
      pose: p?.pose || 'NEUTRAL_CONVERSATIONAL'
    };
  }

  moveTo(targetX, targetY) {
    this.targetX = targetX;
    if (targetY !== undefined) this.targetY = targetY;
  }

  setSpeech(isSpeaking, phoneme = 'REST') {
    this.isSpeaking = isSpeaking;
    this.phoneme = phoneme;
  }

  update(dt = 0.016, audioAmp = 0, audioFreq = 0) {
    this.time += dt;

    // Direct WebAudio lip-sync integration
    if (audioAmp > 0.03) {
      this.isSpeaking = true;
      this.bones.jawOpen = Math.min(1.0, audioAmp * 2.2);
      this.bones.mouthWidth = 0.9 + Math.sin(this.time * 8.0) * 0.25;
      this.bones.browTilt = Math.sin(this.time * 4.0) * 0.08;
    }

    // 1. Locomotion Kinematics
    const dx = this.targetX - this.x;
    if (Math.abs(dx) > 2) {
      this.isWalking = true;
      const step = Math.sign(dx) * Math.min(Math.abs(dx), this.walkSpeed * dt * 60);
      this.x += step;
      this.facing = Math.sign(dx);
      this.walkCycle += dt * 4.8;
    } else {
      this.isWalking = false;
    }

    // 2. Natural Breathing Cycle
    const breath = Math.sin(this.time * 2.2) * 0.03;

    // 3. Eye Blinking Physics
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0) {
      this.bones.eyeBlink = 1.0;
      this.blinkTimer = 2.5 + Math.random() * 3.5;
    } else if (this.bones.eyeBlink > 0) {
      this.bones.eyeBlink = Math.max(0, this.bones.eyeBlink - dt * 6.5);
    }

    // 4. Speech & Jaw Lip-Sync
    if (this.isSpeaking && audioAmp <= 0.03) {
      const speechFreq = Math.sin(this.time * 12.0) * 0.5 + 0.5;
      if (this.phoneme === 'A') {
        this.bones.jawOpen = 0.65 + speechFreq * 0.35;
        this.bones.mouthWidth = 1.1;
      } else if (this.phoneme === 'O' || this.phoneme === 'U') {
        this.bones.jawOpen = 0.5 + speechFreq * 0.3;
        this.bones.mouthWidth = 0.65;
      } else if (this.phoneme === 'E' || this.phoneme === 'I') {
        this.bones.jawOpen = 0.35 + speechFreq * 0.25;
        this.bones.mouthWidth = 1.25;
      } else {
        this.bones.jawOpen = 0.2 + speechFreq * 0.4;
        this.bones.mouthWidth = 0.95;
      }
      this.bones.browTilt = Math.sin(this.time * 3.5) * 0.08;
    } else if (!this.isSpeaking && audioAmp <= 0.03) {
      this.bones.jawOpen = Math.max(0, this.bones.jawOpen - dt * 8);
      this.bones.mouthWidth = 1.0;
      this.bones.browTilt = 0;
    }

    // 5. Walking Kinematics (Articulated Inverse Kinematics Walk Cycle)
    if (this.isWalking) {
      const w = this.walkCycle;
      // Hip swing (opposite legs)
      this.bones.leftHipAngle = Math.sin(w) * 0.42;
      this.bones.rightHipAngle = -Math.sin(w) * 0.42;

      // Knee bending on backswing
      this.bones.leftKneeAngle = Math.sin(w) > 0 ? Math.sin(w) * 0.65 : 0.05;
      this.bones.rightKneeAngle = -Math.sin(w) > 0 ? -Math.sin(w) * 0.65 : 0.05;

      // Ankle flexion for foot roll
      this.bones.leftAnkleAngle = Math.cos(w) * 0.15;
      this.bones.rightAnkleAngle = -Math.cos(w) * 0.15;

      // Pelvis vertical bounce and horizontal sway
      this.bones.pelvisY = Math.abs(Math.sin(w * 2)) * -5;
      this.bones.pelvisSway = Math.cos(w) * 0.04;

      // Arm swing in opposition to legs with forearm lag
      this.bones.leftShoulderAngle = -Math.sin(w) * 0.35;
      this.bones.leftElbowAngle = Math.max(0, Math.sin(w) * 0.25);

      this.bones.rightShoulderAngle = Math.sin(w) * 0.35;
      this.bones.rightElbowAngle = Math.max(0, -Math.sin(w) * 0.25);

      this.bones.headBobY = Math.sin(w * 2) * 1.5;
      this.bones.headTilt = Math.cos(w) * 0.02;

    } else {
      // Idle / Posed Kinematics
      this.bones.pelvisY = Math.sin(this.time * 2.2) * 1.2;
      this.bones.pelvisSway = 0;
      this.bones.leftHipAngle = 0.03;
      this.bones.rightHipAngle = -0.03;
      this.bones.leftKneeAngle = 0;
      this.bones.rightKneeAngle = 0;
      this.bones.leftAnkleAngle = 0;
      this.bones.rightAnkleAngle = 0;
      this.bones.headBobY = Math.sin(this.time * 2.2) * 1.0;
      this.bones.headTilt = Math.sin(this.time * 1.2) * 0.03;

      // Pose-specific arm articulation
      if (this.pose === 'SPEAKING_GESTURE' || (this.isSpeaking && this.pose !== 'HOLDING_PROP')) {
        // Active Conversational Gesture (Open palm explaining)
        const gTime = this.time * 2.8;
        this.bones.rightShoulderAngle = -0.55 + Math.sin(gTime) * 0.12;
        this.bones.rightElbowAngle = 0.75 + Math.cos(gTime) * 0.15;
        this.bones.rightWristAngle = -0.15;

        this.bones.leftShoulderAngle = 0.12 + Math.sin(this.time * 1.5) * 0.05;
        this.bones.leftElbowAngle = 0.2;
      } else if (this.pose === 'THOUGHTFUL_CHIN') {
        // Thoughtful hand at chin
        this.bones.rightShoulderAngle = -0.9;
        this.bones.rightElbowAngle = 1.35;
        this.bones.rightWristAngle = 0.2;
        this.bones.leftShoulderAngle = 0.15;
        this.bones.leftElbowAngle = 0.25;
      } else if (this.pose === 'HOLDING_PROP') {
        // Holding prop firmly at side or forward
        this.bones.rightShoulderAngle = 0.18;
        this.bones.rightElbowAngle = 0.35;
        this.bones.rightWristAngle = 0.1;

        this.bones.leftShoulderAngle = -0.12;
        this.bones.leftElbowAngle = 0.15;
      } else if (this.pose === 'ATTENTIVE_LISTENER') {
        // Attentive listening (subtle nods)
        this.bones.headAngle = Math.sin(this.time * 1.8) * 0.04;
        this.bones.rightShoulderAngle = 0.1;
        this.bones.rightElbowAngle = 0.15;
        this.bones.leftShoulderAngle = -0.1;
        this.bones.leftElbowAngle = 0.15;
      } else {
        // Natural relaxed stance
        this.bones.rightShoulderAngle = 0.08 + breath;
        this.bones.rightElbowAngle = 0.12;
        this.bones.leftShoulderAngle = -0.08 - breath;
        this.bones.leftElbowAngle = 0.12;
      }
    }
  }

  // =========================================================================
  // RENDERING PIPELINE (True Proportions & Aesthetic Articulation)
  // =========================================================================
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const bodyCfg = BODY_TYPES[this.profile.bodyType] || BODY_TYPES.AVERAGE;
    const hScale = bodyCfg.heightScale || 1.0;
    ctx.scale(this.facing * hScale, hScale);

    // 1. Soft Ground Ambient Occlusion Shadow
    this.renderGroundShadow(ctx);

    // 2. Legs & Footwear (Pelvis to Ground Plane)
    this.renderLegs(ctx, bodyCfg);

    // 3. Torso & Upper Garments
    this.renderTorso(ctx, bodyCfg);

    // 4. Neck & Head (Anatomical Facial Hierarchy, No Cheek Blobs!)
    this.renderNeckAndHead(ctx, bodyCfg);

    // 5. Arms & Hands (Front Layering)
    this.renderArms(ctx, bodyCfg);

    ctx.restore();
  }

  renderGroundShadow(ctx) {
    ctx.save();
    ctx.translate(0, 0);
    const shadowGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 48);
    shadowGrad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
    shadowGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.18)');
    shadowGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderLegs(ctx, bodyCfg) {
    const legC = this.profile.legColors;
    const hipX = bodyCfg.hipWidth * 0.32;
    const thighLen = 110;
    const shinLen = 110;

    // Left Leg (Behind)
    this.renderSingleLeg(ctx, -hipX, this.bones.leftHipAngle, this.bones.leftKneeAngle, this.bones.leftAnkleAngle, thighLen, shinLen, bodyCfg, -1);

    // Right Leg (Front)
    this.renderSingleLeg(ctx, hipX, this.bones.rightHipAngle, this.bones.rightKneeAngle, this.bones.rightAnkleAngle, thighLen, shinLen, bodyCfg, 1);
  }

  renderSingleLeg(ctx, hipX, hipAngle, kneeAngle, ankleAngle, thighLen, shinLen, bodyCfg, side) {
    ctx.save();
    ctx.translate(hipX, -220 + this.bones.pelvisY);
    ctx.rotate(hipAngle);

    const legC = this.profile.legColors;
    const shoeC = this.profile.shoeColors;
    const thick = bodyCfg.legThickness;

    // --- THIGH (Quadriceps Curvature) ---
    const thighGrad = ctx.createLinearGradient(-14 * thick, 0, 14 * thick, thighLen);
    thighGrad.addColorStop(0, legC.main);
    thighGrad.addColorStop(0.7, legC.main);
    thighGrad.addColorStop(1, legC.shadow);

    ctx.fillStyle = thighGrad;
    ctx.beginPath();
    ctx.moveTo(-13 * thick, 0);
    ctx.quadraticCurveTo(-15 * thick, thighLen * 0.45, -11 * thick, thighLen);
    ctx.lineTo(11 * thick, thighLen);
    ctx.quadraticCurveTo(14 * thick, thighLen * 0.45, 13 * thick, 0);
    ctx.closePath();
    ctx.fill();

    // Subtle fabric crease / seam
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, thighLen - 10);
    ctx.stroke();

    // --- KNEE & SHIN ---
    ctx.translate(0, thighLen);
    ctx.rotate(kneeAngle);

    // Lower Leg (Shin + Calf Anatomical Sweep)
    const shinGrad = ctx.createLinearGradient(-11 * thick, 0, 11 * thick, shinLen);
    shinGrad.addColorStop(0, legC.main);
    shinGrad.addColorStop(1, legC.shadow);

    ctx.fillStyle = shinGrad;
    ctx.beginPath();
    ctx.moveTo(-11 * thick, 0);
    ctx.quadraticCurveTo(-14 * thick, shinLen * 0.35, -8 * thick, shinLen);
    ctx.lineTo(8 * thick, shinLen);
    ctx.quadraticCurveTo(11 * thick, shinLen * 0.35, 10 * thick, 0);
    ctx.closePath();
    ctx.fill();

    // Trouser Hem Cuff
    ctx.strokeStyle = legC.shadow;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-8 * thick, shinLen - 2);
    ctx.lineTo(8 * thick, shinLen - 2);
    ctx.stroke();

    // --- FOOTWEAR (Shoe / Sneaker / Oxford) ---
    ctx.translate(0, shinLen);
    ctx.rotate(ankleAngle);

    ctx.save();
    // Shoe Upper
    ctx.fillStyle = shoeC.main;
    ctx.beginPath();
    ctx.moveTo(-9, -2);
    ctx.quadraticCurveTo(-12, 10, -8, 16);
    ctx.lineTo(24, 16); // Toe forward
    ctx.quadraticCurveTo(28, 12, 22, 6);
    ctx.quadraticCurveTo(14, 2, 8, -2);
    ctx.closePath();
    ctx.fill();

    // Shoe Sole
    ctx.fillStyle = shoeC.sole;
    ctx.beginPath();
    ctx.roundRect(-9, 14, 34, 4, 1.5);
    ctx.fill();

    // Clean sneaker / shoe welt stitching
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-6, 8);
    ctx.quadraticCurveTo(6, 4, 16, 9);
    ctx.stroke();

    ctx.restore();

    ctx.restore();
  }

  renderTorso(ctx, bodyCfg) {
    ctx.save();
    ctx.translate(0, -220 + this.bones.pelvisY);
    ctx.rotate(this.bones.chestAngle + this.bones.pelvisSway);

    const tc = this.profile.torsoColors;
    const sw = bodyCfg.shoulderWidth * 0.5;
    const cw = bodyCfg.chestWidth * 0.5;
    const ww = bodyCfg.waistWidth * 0.5;
    const hw = bodyCfg.hipWidth * 0.5;
    const torsoHeight = 125; // -125 at clavicle to 0 at pelvis

    const outfit = this.profile.outfit;

    // Torso Base Silhouette (V-Taper Anatomy)
    const torsoGrad = ctx.createLinearGradient(-sw, -torsoHeight, sw, 0);
    torsoGrad.addColorStop(0, tc.highlight);
    torsoGrad.addColorStop(0.45, tc.main);
    torsoGrad.addColorStop(1, tc.shadow);

    ctx.fillStyle = torsoGrad;
    ctx.beginPath();
    ctx.moveTo(-sw, -torsoHeight);
    ctx.quadraticCurveTo(0, -torsoHeight - 4, sw, -torsoHeight);
    ctx.quadraticCurveTo(cw + 3, -torsoHeight * 0.65, ww, -torsoHeight * 0.3);
    ctx.quadraticCurveTo(hw + 2, -10, hw, 0);
    ctx.lineTo(-hw, 0);
    ctx.quadraticCurveTo(-hw - 2, -10, -ww, -torsoHeight * 0.3);
    ctx.quadraticCurveTo(-cw - 3, -torsoHeight * 0.65, -sw, -torsoHeight);
    ctx.closePath();
    ctx.fill();

    // Outfit Specific Details (Tailoring, Lapels, Collars)
    if (outfit === 'TAILORED_BLAZER' || outfit === 'CLASSIC_OVERCOAT') {
      // Inner Dress Shirt
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-12, -torsoHeight);
      ctx.lineTo(12, -torsoHeight);
      ctx.lineTo(0, -torsoHeight + 42);
      ctx.closePath();
      ctx.fill();

      // Silk Necktie
      ctx.fillStyle = tc.accent || '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-4, -torsoHeight + 6);
      ctx.lineTo(4, -torsoHeight + 6);
      ctx.lineTo(6, -torsoHeight + 46);
      ctx.lineTo(0, -torsoHeight + 54);
      ctx.lineTo(-6, -torsoHeight + 46);
      ctx.closePath();
      ctx.fill();

      // Notched Lapels
      ctx.fillStyle = tc.highlight;
      ctx.strokeStyle = tc.shadow;
      ctx.lineWidth = 1.2;

      // Left Lapel
      ctx.beginPath();
      ctx.moveTo(-sw + 6, -torsoHeight);
      ctx.lineTo(-12, -torsoHeight + 14);
      ctx.lineTo(-2, -torsoHeight + 52);
      ctx.lineTo(-18, -torsoHeight + 52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Lapel
      ctx.beginPath();
      ctx.moveTo(sw - 6, -torsoHeight);
      ctx.lineTo(12, -torsoHeight + 14);
      ctx.lineTo(2, -torsoHeight + 52);
      ctx.lineTo(18, -torsoHeight + 52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Welt Pocket + Pocket Square
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cw - 22, -torsoHeight + 32, 12, 3);

    } else if (outfit === 'MODERN_CASUAL') {
      // Clean Hoodie / Sweatshirt
      // Drawstring Collar Drape
      ctx.fillStyle = tc.shadow;
      ctx.beginPath();
      ctx.moveTo(-24, -torsoHeight);
      ctx.quadraticCurveTo(0, -torsoHeight + 18, 24, -torsoHeight);
      ctx.quadraticCurveTo(0, -torsoHeight + 10, -24, -torsoHeight);
      ctx.fill();

      // Dual Aglet Cords
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-8, -torsoHeight + 12);
      ctx.lineTo(-9, -torsoHeight + 36);
      ctx.moveTo(8, -torsoHeight + 12);
      ctx.lineTo(9, -torsoHeight + 36);
      ctx.stroke();

      // Kangaroo Pocket Seam
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-ww + 8, -25);
      ctx.lineTo(ww - 8, -25);
      ctx.stroke();

    } else if (outfit === 'LAB_COAT') {
      // White Open Lab Coat showing dark shirt underneath
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-14, -torsoHeight + 8, 28, 48);

      // Coat Lapels & Pen Pocket
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-ww, -torsoHeight, 14, torsoHeight);
      ctx.fillRect(ww - 14, -torsoHeight, 14, torsoHeight);

      // ID Badge on chest
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-22, -torsoHeight + 30, 10, 14);

    } else {
      // Clean Crew-Neck Casual Tee
      ctx.strokeStyle = tc.shadow;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(0, -torsoHeight, 16, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    // Belt / Waistband Line
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-ww, -8, ww * 2, 7);
    ctx.fillStyle = '#cbd5e1'; // Belt buckle
    ctx.fillRect(-5, -7, 10, 5);

    ctx.restore();
  }

  renderNeckAndHead(ctx, bodyCfg) {
    ctx.save();
    const neckY = -345 + this.bones.pelvisY;
    ctx.translate(0, neckY);
    ctx.rotate(this.bones.headAngle);

    const skin = this.profile.skin;

    // --- 1. CYLINDRICAL NECK (With Soft Anatomical Sternocleidomastoid Shading) ---
    const neckGrad = ctx.createLinearGradient(-12, -26, 12, 4);
    neckGrad.addColorStop(0, skin.shadow);
    neckGrad.addColorStop(0.5, skin.base);
    neckGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(-11, -26);
    ctx.lineTo(-14, 4);
    ctx.lineTo(14, 4);
    ctx.lineTo(11, -26);
    ctx.closePath();
    ctx.fill();

    // Clavicle Hollow Shading
    ctx.strokeStyle = skin.shadow + '88';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-16, 4);
    ctx.quadraticCurveTo(0, 8, 16, 4);
    ctx.stroke();

    // --- 2. HEAD & CRANIUM (No Cheek Blobs!) ---
    ctx.translate(0, -52 + this.bones.headBobY);
    ctx.rotate(this.bones.headTilt);

    // Anatomical Head Silhouette by Shape (OVAL, CHISELED, ROUND, HEART, SQUARE)
    const shape = this.profile.headShape || 'OVAL';
    const headGrad = ctx.createRadialGradient(-6, -14, 8, 0, 0, 46);
    headGrad.addColorStop(0, skin.highlight);
    headGrad.addColorStop(0.55, skin.base);
    headGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = headGrad;
    ctx.strokeStyle = skin.shadow + '66';
    ctx.lineWidth = 1.0;

    ctx.beginPath();
    if (shape === 'CHISELED') {
      // Angular jaw, flat chiseled chin
      ctx.moveTo(-24, -36);
      ctx.quadraticCurveTo(-26, -10, -22, 14);
      ctx.lineTo(-12, 28);
      ctx.lineTo(12, 28);
      ctx.lineTo(22, 14);
      ctx.quadraticCurveTo(26, -10, 24, -36);
      ctx.quadraticCurveTo(0, -52, -24, -36);
    } else if (shape === 'SQUARE') {
      // Broad masculine square jaw
      ctx.moveTo(-25, -36);
      ctx.lineTo(-24, 16);
      ctx.lineTo(-14, 27);
      ctx.lineTo(14, 27);
      ctx.lineTo(24, 16);
      ctx.lineTo(25, -36);
      ctx.quadraticCurveTo(0, -50, -25, -36);
    } else if (shape === 'HEART') {
      // Wider temples, delicate tapered chin
      ctx.moveTo(-26, -38);
      ctx.quadraticCurveTo(-27, -10, -18, 14);
      ctx.quadraticCurveTo(-10, 28, 0, 29);
      ctx.quadraticCurveTo(10, 28, 18, 14);
      ctx.quadraticCurveTo(27, -10, 26, -38);
      ctx.quadraticCurveTo(0, -52, -26, -38);
    } else {
      // Classic Smooth Oval (Default)
      ctx.moveTo(-24, -36);
      ctx.quadraticCurveTo(-26, -10, -20, 15);
      ctx.quadraticCurveTo(-12, 27, 0, 28);
      ctx.quadraticCurveTo(12, 27, 20, 15);
      ctx.quadraticCurveTo(26, -10, 24, -36);
      ctx.quadraticCurveTo(0, -52, -24, -36);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sculpted Jawline Drop Shadow (Ambient Occlusion beneath jaw)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.14)';
    ctx.beginPath();
    ctx.ellipse(0, 28, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- 3. EARS (Subtle Anatomical Cartilage) ---
    [-24, 24].forEach((earX, idx) => {
      ctx.save();
      const s = idx === 0 ? -1 : 1;
      ctx.fillStyle = skin.base;
      ctx.beginPath();
      ctx.ellipse(earX, -4, 5, 9, s * 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Inner concha shadow
      ctx.fillStyle = skin.shadow;
      ctx.beginPath();
      ctx.ellipse(earX + s * 1, -4, 2.5, 5, s * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // --- 4. FACIAL FEATURES (Clean, Expressive, Proportional) ---
    this.renderFacialFeatures(ctx, skin);

    // --- 5. HAIR & HEADGEAR ---
    this.renderHairAndHeadgear(ctx);

    ctx.restore();
  }

  renderFacialFeatures(ctx, skin) {
    const eyes = this.profile.eyes;
    const blink = this.bones.eyeBlink;
    const speechInfluence = Math.min(1.0, this.bones.jawOpen * 1.5);

    // --- EYEBROWS (Expressive & Speech-Reactive) ---
    const browTilt = this.bones.browTilt || 0;
    ctx.strokeStyle = this.profile.hair.color || '#18181b';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';

    // Left Brow
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-19, -15 - browTilt * 12);
    ctx.quadraticCurveTo(-12, -18 - speechInfluence * 2, -5, -14);
    ctx.stroke();
    ctx.restore();

    // Right Brow
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(5, -14);
    ctx.quadraticCurveTo(12, -18 - speechInfluence * 2, 19, -15 + browTilt * 12);
    ctx.stroke();
    ctx.restore();

    // --- EYES (Soulful Almond Eyes with Pupil, Iris, Catchlight) ---
    [-12, 12].forEach((eyeX, idx) => {
      ctx.save();
      ctx.translate(eyeX, -6);
      ctx.scale(1.0, 1.0 - blink); // Natural Blink

      // Sclera (Eye White with Soft Ambient Depth)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.quadraticCurveTo(0, -4.5, 7, 0);
      ctx.quadraticCurveTo(0, 4.5, -7, 0);
      ctx.closePath();
      ctx.fill();

      // Iris & Limbal Ring
      const irisX = this.bones.eyeLookX * 2.0;
      const irisY = this.bones.eyeLookY * 1.5;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.quadraticCurveTo(0, -4.5, 7, 0);
      ctx.quadraticCurveTo(0, 4.5, -7, 0);
      ctx.closePath();
      ctx.clip(); // Clip within eyelid

      // Dark Limbal Ring
      ctx.fillStyle = '#050811';
      ctx.beginPath();
      ctx.arc(irisX, irisY, 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Colored Iris Core
      ctx.fillStyle = eyes.iris || '#3b2518';
      ctx.beginPath();
      ctx.arc(irisX, irisY, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(irisX, irisY, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Specular Crisp Keylight Glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(irisX - 1.0, irisY - 1.0, 0.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // End clip

      // Upper Eyelash Line
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-7.5, 0);
      ctx.quadraticCurveTo(0, -4.8, 7.5, 0);
      ctx.stroke();

      ctx.restore();
    });

    // --- NOSE (Delicate Volumetric 3D Contour - NO thick cartoon lines) ---
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(0, 6);
    ctx.quadraticCurveTo(2.5, 8.5, 0, 9);
    ctx.stroke();

    // Soft tip highlight
    ctx.fillStyle = skin.highlight;
    ctx.beginPath();
    ctx.arc(0, 7, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // --- MOUTH & LIP-SYNC (Natural Complexion Lips - NO Clown Paint) ---
    ctx.save();
    ctx.translate(0, 18);
    const jaw = this.bones.jawOpen;
    const mw = this.bones.mouthWidth;

    if (jaw < 0.12) {
      // Natural Resting Lips
      // Upper lip
      ctx.strokeStyle = skin.shadow;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-8 * mw, 0);
      ctx.quadraticCurveTo(0, -1.8, 8 * mw, 0);
      ctx.stroke();

      // Lower lip cushion
      ctx.strokeStyle = skin.shadow + '88';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(-6 * mw, 1.2);
      ctx.quadraticCurveTo(0, 3.5, 6 * mw, 1.2);
      ctx.stroke();

    } else {
      // Animated Speech Mouth Opening
      ctx.fillStyle = '#1c0712'; // Oral cavity
      ctx.beginPath();
      ctx.moveTo(-8 * mw, 0);
      ctx.quadraticCurveTo(0, -4 * jaw, 8 * mw, 0);
      ctx.quadraticCurveTo(0, 10 * jaw, -8 * mw, 0);
      ctx.closePath();
      ctx.fill();

      // Upper incisor teeth hint
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-4 * mw, -1, 8 * mw, 2.5);

      // Lip contour outline
      ctx.strokeStyle = skin.shadow;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();

    // Glasses if equipped
    if (this.profile.accessories === 'GLASSES') {
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(-20, -13, 16, 13, 3);
      ctx.roundRect(4, -13, 16, 13, 3);
      ctx.moveTo(-4, -6);
      ctx.lineTo(4, -6);
      ctx.stroke();
    }
  }

  renderHairAndHeadgear(ctx) {
    const hair = this.profile.hair;
    const hColor = hair.color || '#18181b';
    const style = hair.style || 'SHORT_CROP';

    ctx.save();
    ctx.fillStyle = hColor;

    if (style === 'TEXTURED_FADE' || style === 'SHORT_CROP') {
      // Modern Clean Crop / Fade
      ctx.beginPath();
      ctx.moveTo(-25, -34);
      ctx.quadraticCurveTo(-26, -56, 0, -56);
      ctx.quadraticCurveTo(26, -56, 25, -34);
      ctx.quadraticCurveTo(18, -44, 0, -42);
      ctx.quadraticCurveTo(-18, -44, -25, -34);
      ctx.closePath();
      ctx.fill();

    } else if (style === 'SIDE_PART_VINTAGE') {
      // Classic 1950s / Professional Side Part
      ctx.beginPath();
      ctx.moveTo(-26, -30);
      ctx.quadraticCurveTo(-28, -58, 4, -58);
      ctx.quadraticCurveTo(28, -56, 25, -32);
      ctx.quadraticCurveTo(12, -48, -6, -46);
      ctx.quadraticCurveTo(-20, -44, -26, -30);
      ctx.closePath();
      ctx.fill();

    } else if (style === 'LONG_WAVY' || style === 'ELEGANT_LOCKS') {
      // Long Flowing Hair
      ctx.beginPath();
      ctx.moveTo(-26, -30);
      ctx.quadraticCurveTo(-32, 10, -28, 45);
      ctx.quadraticCurveTo(-22, 15, -24, -30);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(26, -30);
      ctx.quadraticCurveTo(32, 10, 28, 45);
      ctx.quadraticCurveTo(22, 15, 24, -30);
      ctx.fill();

      // Cranial crown
      ctx.beginPath();
      ctx.arc(0, -44, 25, Math.PI, 0);
      ctx.fill();

    } else {
      // Natural Everyday Hair
      ctx.beginPath();
      ctx.arc(0, -42, 24, Math.PI * 0.9, Math.PI * 0.1);
      ctx.fill();
    }

    // Fedora Hat if equipped
    if (this.profile.accessories === 'HAT') {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      // Brim
      ctx.ellipse(0, -44, 38, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      // Crown
      ctx.beginPath();
      ctx.moveTo(-20, -44);
      ctx.lineTo(-16, -66);
      ctx.quadraticCurveTo(0, -70, 16, -66);
      ctx.lineTo(20, -44);
      ctx.closePath();
      ctx.fill();
      // Ribbon band
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-19, -50, 38, 6);
    }

    ctx.restore();
  }

  renderArms(ctx, bodyCfg) {
    const sw = bodyCfg.shoulderWidth * 0.5;
    const bicepLen = 86;
    const forearmLen = 82;

    // Left Arm (Behind)
    this.renderSingleArm(ctx, -sw, this.bones.leftShoulderAngle, this.bones.leftElbowAngle, this.bones.leftWristAngle, bicepLen, forearmLen, bodyCfg, -1);

    // Right Arm (Front)
    this.renderSingleArm(ctx, sw, this.bones.rightShoulderAngle, this.bones.rightElbowAngle, this.bones.rightWristAngle, bicepLen, forearmLen, bodyCfg, 1);
  }

  renderSingleArm(ctx, shoulderX, sAngle, eAngle, wAngle, bicepLen, forearmLen, bodyCfg, side) {
    ctx.save();
    ctx.translate(shoulderX, -345 + this.bones.pelvisY);
    ctx.rotate(sAngle);

    const tc = this.profile.torsoColors;
    const skin = this.profile.skin;
    const thick = bodyCfg.armThickness;

    // Bicep / Upper Arm Sleeve
    const sleeveGrad = ctx.createLinearGradient(-8 * thick, 0, 8 * thick, bicepLen);
    sleeveGrad.addColorStop(0, tc.highlight);
    sleeveGrad.addColorStop(1, tc.main);

    ctx.fillStyle = sleeveGrad;
    ctx.beginPath();
    ctx.moveTo(-8 * thick, 0);
    ctx.quadraticCurveTo(-10 * thick, bicepLen * 0.5, -7 * thick, bicepLen);
    ctx.lineTo(7 * thick, bicepLen);
    ctx.quadraticCurveTo(10 * thick, bicepLen * 0.5, 8 * thick, 0);
    ctx.closePath();
    ctx.fill();

    // Elbow Joint
    ctx.translate(0, bicepLen);
    ctx.rotate(eAngle);

    // Forearm
    ctx.fillStyle = sleeveGrad;
    ctx.beginPath();
    ctx.moveTo(-7 * thick, 0);
    ctx.quadraticCurveTo(-9 * thick, forearmLen * 0.5, -6 * thick, forearmLen);
    ctx.lineTo(6 * thick, forearmLen);
    ctx.quadraticCurveTo(9 * thick, forearmLen * 0.5, 7 * thick, 0);
    ctx.closePath();
    ctx.fill();

    // Wrist & Hand
    ctx.translate(0, forearmLen);
    ctx.rotate(wAngle);

    // Natural Hand (Skin Tone)
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-6, 16);
    ctx.quadraticCurveTo(0, 22, 6, 16);
    ctx.lineTo(5, 0);
    ctx.closePath();
    ctx.fill();

    // Held Item in front hand if equipped
    if (side === 1 && this.heldItem && this.heldItem !== 'NONE') {
      this.renderHeldProp(ctx, this.heldItem);
    }

    ctx.restore();
  }

  renderHeldProp(ctx, prop) {
    ctx.save();
    ctx.translate(0, 14);

    if (prop === 'BRIEFCASE') {
      // Leather Attache Briefcase
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-6, 0, 12, 34);
      ctx.fillStyle = '#b45309'; // Brass latch
      ctx.fillRect(-2, 10, 4, 6);

    } else if (prop === 'CANE') {
      // Polished Mahogany Cane
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(0, 95);
      ctx.stroke();
      // Brass Handle
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, -6, 5, 0, Math.PI * 2);
      ctx.fill();

    } else if (prop === 'TABLET') {
      // Modern Glass Tablet
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-10, -6, 20, 28);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-8, -4, 16, 24);

    } else if (prop === 'MICROPHONE') {
      // Studio Microphone
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-3, 0, 6, 22);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

    } else if (prop === 'BOW') {
      // Recurve Bow
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(0, 15, 65, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(0, -45);
      ctx.lineTo(0, 75);
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // DYNAMIC SCRIPT & PROMPT SYNTHESIZER (Open Generative AI Architecture)
  // =========================================================================
  static synthesizeFromPrompt(prompt = '', roleHint = '') {
    const text = (prompt + ' ' + roleHint).toLowerCase();

    // 1. Determine Archetype & Role Name
    let name = 'Alex';
    let role = 'Creator';
    let gender = 'M';
    let bodyType = 'AVERAGE';
    let outfit = 'MODERN_CASUAL';
    let accessories = 'NONE';
    let heldItem = 'NONE';
    let pose = 'NEUTRAL_CONVERSATIONAL';
    let headShape = 'OVAL';
    let hairStyle = 'SHORT_CROP';
    let hairColor = '#18181b';
    let facialHair = 'NONE';
    let skin = SKIN_TONES.PEACH;
    let torsoColors = { main: '#1e293b', highlight: '#334155', shadow: '#0f172a', accent: '#38bdf8' };

    // Extract custom character name if prompt mentions "Name: ..." or capitalized title
    const nameMatch = prompt.match(/(?:named|character|protagonist|is|dr\.|detective|mr\.|ms\.)\s+([A-Z][a-z]+)/i);
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1];
    } else {
      const words = prompt.split(/\s+/);
      for (let w of words) {
        const clean = w.replace(/[^a-zA-Z]/g, '');
        if (clean.length > 2 && /^[A-Z][a-z]+$/.test(clean) && !['Scene', 'The', 'And', 'Two', 'One', 'With', 'From', 'Into', 'When', 'What', 'After', 'Before'].includes(clean)) {
          name = clean;
          break;
        }
      }
    }

    // Gender inference
    const femaleNames = ['evelyn', 'sarah', 'elena', 'maya', 'priya', 'zoe', 'clara', 'anna', 'emma', 'sophia', 'olivia', 'maria', 'lucy', 'alice', 'dr. evelyn'];
    if (femaleNames.some(fn => text.includes(fn)) || text.includes('woman') || text.includes('female') || text.includes('lady') || text.includes('she ') || text.includes('her ') || text.includes('queen') || text.includes('princess')) {
      gender = 'F';
      bodyType = 'FEMININE_CURVED';
      hairStyle = 'LONG_WAVY';
    } else if (text.includes('elder') || text.includes('old man') || text.includes('grandfather') || text.includes('professor')) {
      bodyType = 'ELDER';
      hairColor = '#e2e8f0';
      facialHair = 'FULL_BEARD';
    } else if (text.includes('athletic') || text.includes('warrior') || text.includes('hero') || text.includes('soldier') || text.includes('strong')) {
      bodyType = 'ATHLETIC';
      headShape = 'CHISELED';
      pose = 'HOLDING_PROP';
    } else if (text.includes('tall') || text.includes('slender') || text.includes('scholar')) {
      bodyType = 'SLIM_TALL';
    }

    // Role, Outfit & Era Synthesis
    if (text.includes('1950') || text.includes('vintage') || text.includes('gentleman') || text.includes('detective') || text.includes('trench')) {
      role = '1950s Detective';
      outfit = 'CLASSIC_OVERCOAT';
      accessories = 'HAT';
      heldItem = 'CANE';
      hairStyle = 'SIDE_PART_VINTAGE';
      facialHair = 'PENCIL_MOUSTACHE';
      torsoColors = { main: '#334155', highlight: '#475569', shadow: '#1e293b', accent: '#b91c1c' };
    } else if (text.includes('scientist') || text.includes('doctor') || text.includes('researcher') || text.includes('lab')) {
      role = 'Research Scientist';
      outfit = 'LAB_COAT';
      accessories = 'GLASSES';
      heldItem = 'TABLET';
      torsoColors = { main: '#f8fafc', highlight: '#ffffff', shadow: '#cbd5e1', accent: '#0284c7' };
    } else if (text.includes('executive') || text.includes('business') || text.includes('lawyer') || text.includes('suit')) {
      role = 'Executive';
      outfit = 'TAILORED_BLAZER';
      heldItem = 'BRIEFCASE';
      headShape = 'CHISELED';
      torsoColors = { main: '#0f172a', highlight: '#1e293b', shadow: '#020617', accent: '#dc2626' };
    } else if (text.includes('karna') || text.includes('warrior') || text.includes('sun') || text.includes('armor')) {
      role = 'Heroic Warrior';
      skin = SKIN_TONES.BRONZE;
      bodyType = 'ATHLETIC';
      headShape = 'CHISELED';
      outfit = 'HISTORICAL_ROBE';
      heldItem = 'BOW';
      torsoColors = { main: '#eab308', highlight: '#fef08a', shadow: '#ca8a04', accent: '#ea580c' };
    } else if (text.includes('ram') || text.includes('prince') || text.includes('ayodhya') || text.includes('divine')) {
      role = 'Virtuous Sovereign';
      skin = SKIN_TONES.CELESTIAL_BLUE;
      bodyType = 'ATHLETIC';
      headShape = 'OVAL';
      outfit = 'HISTORICAL_ROBE';
      heldItem = 'BOW';
      torsoColors = { main: '#facc15', highlight: '#fef08a', shadow: '#a16207', accent: '#3b82f6' };
    } else if (text.includes('podcast') || text.includes('host') || text.includes('interview')) {
      role = 'Podcast Host';
      heldItem = 'MICROPHONE';
      outfit = 'MODERN_CASUAL';
      accessories = 'GLASSES';
      pose = 'SPEAKING_GESTURE';
    }

    return {
      name,
      role,
      gender,
      bodyType,
      headShape,
      skin,
      eyes: { size: 1.0, iris: '#3b2518' },
      hair: { style: hairStyle, color: hairColor, sway: 0.4 },
      facialHair,
      accessories,
      outfit,
      torsoColors,
      legColors: { main: '#0f172a', shadow: '#020617' },
      shoeColors: { main: '#ffffff', sole: '#0f172a' },
      heldItem,
      pose
    };
  }

  randomizeNewCharacter() {
    const bodyKeys = Object.keys(BODY_TYPES);
    const skinKeys = Object.keys(SKIN_TONES);
    const outfits = ['MODERN_CASUAL', 'TAILORED_BLAZER', 'CLASSIC_OVERCOAT', 'LAB_COAT', 'CASUAL_TEE'];
    const props = ['NONE', 'TABLET', 'BRIEFCASE', 'CANE', 'MICROPHONE'];

    const randomSkin = SKIN_TONES[skinKeys[Math.floor(Math.random() * (skinKeys.length - 1))]]; // exclude blue
    const randomBody = bodyKeys[Math.floor(Math.random() * bodyKeys.length)];
    const randomOutfit = outfits[Math.floor(Math.random() * outfits.length)];

    const profile = {
      name: 'Character ' + Math.floor(Math.random() * 900 + 100),
      role: 'Participant',
      gender: Math.random() > 0.5 ? 'M' : 'F',
      bodyType: randomBody,
      headShape: Math.random() > 0.5 ? 'CHISELED' : 'OVAL',
      skin: randomSkin,
      eyes: { size: 1.0, iris: '#3b2518' },
      hair: { style: 'SHORT_CROP', color: '#18181b', sway: 0.4 },
      facialHair: 'NONE',
      accessories: Math.random() > 0.6 ? 'GLASSES' : 'NONE',
      outfit: randomOutfit,
      torsoColors: { main: '#1e293b', highlight: '#334155', shadow: '#0f172a', accent: '#38bdf8' },
      legColors: { main: '#0f172a', shadow: '#020617' },
      shoeColors: { main: '#ffffff', sole: '#0f172a' },
      heldItem: props[Math.floor(Math.random() * props.length)],
      pose: 'NEUTRAL_CONVERSATIONAL'
    };

    this.profile = this.sanitizeProfile(profile);
    return this.profile;
  }
}

// Module and browser export
if (typeof window !== 'undefined') {
  window.CharacterRig = CharacterRig;
  window.BODY_TYPES = BODY_TYPES;
  window.SKIN_TONES = SKIN_TONES;
}
if (typeof global !== 'undefined') {
  global.CharacterRig = CharacterRig;
  global.BODY_TYPES = BODY_TYPES;
  global.SKIN_TONES = SKIN_TONES;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CharacterRig, BODY_TYPES, SKIN_TONES };
}
