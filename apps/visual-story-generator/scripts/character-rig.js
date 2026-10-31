/**
 * VISUAL STORY GENERATOR - MANO LAB
 * character-rig.js - Parametric 2.5D Rigged Character Engine with Articulated Limbs & Locomotion
 * 
 * Features:
 * - Parametric Archetype System (12+ Epic Indian Mythological & Historical Characters + Infinite Random Generation)
 * - Articulated Limbs: Thighs, Knees, Shins, Feet/Sandals, Biceps, Forearms, Expressive Hands
 * - Walking Locomotion: Natural forward/backward leg cycle, hip sway, and foot planting across stage coordinates
 * - Expressive Head, Jaw & Phoneme Lip-Sync (A, O, E, REST, FIERCE)
 * - Dynamic customizable parameters: Skin tone, eye size/shape/glow, hair styles, headgear, attire, ornaments
 * - Secondary physics (spring-damper) for cloth, hair sway, cape, and jewels
 */

// 12 Iconic Archetype Profiles
const CHARACTER_PROFILES = {
  RUDRA: {
    id: 'RUDRA',
    name: 'Rudra: Mahadeva',
    role: 'Divine Destroyer & Yogi',
    emoji: '🔱',
    skin: { base: '#3b5368', highlight: '#5c7d99', shadow: '#1e2c38', rim: '#93c5fd' },
    eyes: { size: 1.15, shape: 'FIERCE_WARRIOR', iris: '#facc15', glow: '#38bdf8', thirdEye: true },
    hair: { color: '#0f172a', style: 'MATTED_JATA', sway: 1.2 },
    facialHair: 'SHORT_STUBBLE',
    headgear: 'CRESCENT_MOON_SERPENT',
    torso: { type: 'TIGER_SKIN_ROBE', main: '#c2410c', highlight: '#ea580c', shadow: '#7c2d12', trim: '#facc15' },
    legs: { type: 'YOGIC_DHOTI', color: '#c2410c', trim: '#facc15' },
    cape: { enabled: true, color: '#1e293b', trim: '#38bdf8' },
    ornaments: { necklace: 'RUDRAKSHA_COBRA', earrings: 'KUNDALAS', wrists: 'RUDRAKSHA' },
    markings: 'TRIPUNDRA_CHANDAN'
  },

  RISHI: {
    id: 'RISHI',
    name: 'Rishi Agastya',
    role: 'Vedic Ascetic Master',
    emoji: '🕉️',
    skin: { base: '#b46e45', highlight: '#d98e64', shadow: '#784325', rim: '#fed7aa' },
    eyes: { size: 0.95, shape: 'SERENE_MEDITATIVE', iris: '#78350f', glow: '#fbbf24', thirdEye: false },
    hair: { color: '#e2e8f0', style: 'ASCETIC_JATA_BUN', sway: 0.8 },
    facialHair: 'FULL_WHITE_BEARD',
    headgear: 'RUDRAKSHA_BEAD_BAND',
    torso: { type: 'SAFFRON_ANGAVASTRAM', main: '#ea580c', highlight: '#fb923c', shadow: '#9a3412', trim: '#fef08a' },
    legs: { type: 'SAFFRON_DHOTI', color: '#ea580c', trim: '#fbbf24' },
    cape: { enabled: false, color: '#f97316', trim: '#fde047' },
    ornaments: { necklace: 'RUDRAKSHA_MALA', earrings: 'WOODEN_KUNDALAS', wrists: 'KUSHA_GRASS' },
    markings: 'CHANDAN_TILAK'
  },

  ASURA: {
    id: 'ASURA',
    name: 'Ravana: Shadow King',
    role: 'Sovereign of Lanka & Asuras',
    emoji: '⚔️',
    skin: { base: '#452b36', highlight: '#694152', shadow: '#26161e', rim: '#f43f5e' },
    eyes: { size: 1.25, shape: 'BURNING_ASURA', iris: '#ef4444', glow: '#dc2626', thirdEye: false },
    hair: { color: '#09090b', style: 'WILD_FLOWING', sway: 1.5 },
    facialHair: 'WARRIOR_MUSTACHE',
    headgear: 'SPIKED_HORNED_CROWN',
    torso: { type: 'OBSIDIAN_BATTLE_CUIRASS', main: '#18181b', highlight: '#3f3f46', shadow: '#09090b', trim: '#e11d48' },
    legs: { type: 'WAR_GREAVES', color: '#27272a', trim: '#dc2626' },
    cape: { enabled: true, color: '#881337', trim: '#fb7185' },
    ornaments: { necklace: 'BONE_GOLD_TORC', earrings: 'FANG_KUNDALAS', wrists: 'SPIKED_BRACERS' },
    markings: 'ASURA_WAR_RUNES'
  },

  DEVI: {
    id: 'DEVI',
    name: 'Devi Mahamaya',
    role: 'Divine Mother & Protector',
    emoji: '🌸',
    skin: { base: '#e6a66b', highlight: '#fcd34d', shadow: '#9a5c2d', rim: '#fef08a' },
    eyes: { size: 1.35, shape: 'ALMOND_DIVINE', iris: '#0284c7', glow: '#38bdf8', thirdEye: true },
    hair: { color: '#171717', style: 'CELESTIAL_BRAIDS', sway: 1.3 },
    facialHair: 'NONE',
    headgear: 'GOLDEN_LOTUS_TIARA',
    torso: { type: 'SILK_CHOLI_SAREE', main: '#dc2626', highlight: '#ef4444', shadow: '#991b1b', trim: '#facc15' },
    legs: { type: 'SILK_PLEATED_SAREE', color: '#b91c1c', trim: '#fde047' },
    cape: { enabled: true, color: '#b91c1c', trim: '#facc15' },
    ornaments: { necklace: 'DIAMOND_GOLD_HARAM', earrings: 'JHUMKAS', wrists: 'GOLD_KADHAS' },
    markings: 'DEVI_RED_BINDI'
  },

  VASUKI: {
    id: 'VASUKI',
    name: 'Vasuki: Serpent King',
    role: 'Monarch of Patala & Nagas',
    emoji: '🐍',
    skin: { base: '#1b4d4f', highlight: '#2dd4bf', shadow: '#0f292a', rim: '#5eead4' },
    eyes: { size: 1.1, shape: 'BURNING_ASURA', iris: '#10b981', glow: '#34d399', thirdEye: false },
    hair: { color: '#042f2e', style: 'SERPENT_HOOD_CROWN', sway: 1.1 },
    facialHair: 'NONE',
    headgear: 'SEVEN_HOODED_NAGA',
    torso: { type: 'SCALE_GOLD_ARMOR', main: '#115e59', highlight: '#14b8a6', shadow: '#042f2e', trim: '#facc15' },
    legs: { type: 'SERPENT_SCALE_DHOTI', color: '#0f766e', trim: '#facc15' },
    cape: { enabled: true, color: '#042f2e', trim: '#2dd4bf' },
    ornaments: { necklace: 'EMERALD_SERPENT_TORC', earrings: 'COBRA_KUNDALAS', wrists: 'SERPENT_COILS' },
    markings: 'NAGA_SCALES'
  },

  SHESHANAGA: {
    id: 'SHESHANAGA',
    name: 'Sheshanaga: The Cosmic',
    role: 'Bed of Vishnu & Time Keeper',
    emoji: '🌌',
    skin: { base: '#253d6e', highlight: '#60a5fa', shadow: '#172554', rim: '#bfdbfe' },
    eyes: { size: 1.2, shape: 'SERENE_MEDITATIVE', iris: '#38bdf8', glow: '#93c5fd', thirdEye: false },
    hair: { color: '#0f172a', style: 'CELESTIAL_WAVES', sway: 1.0 },
    facialHair: 'NONE',
    headgear: 'COSMIC_THOUSAND_HOODS',
    torso: { type: 'CELESTIAL_SILK_VEST', main: '#1e40af', highlight: '#3b82f6', shadow: '#1e3a8a', trim: '#facc15' },
    legs: { type: 'OCEAN_BLUE_DHOTI', color: '#1d4ed8', trim: '#fef08a' },
    cape: { enabled: true, color: '#172554', trim: '#60a5fa' },
    ornaments: { necklace: 'COSMIC_STAR_MALAS', earrings: 'SAPPHIRE_DROPS', wrists: 'GOLD_BANDS' },
    markings: 'VISHNU_TILAK'
  },

  ARJUNA: {
    id: 'ARJUNA',
    name: 'Prince Arjuna: Dhanurdhari',
    role: 'Peerless Archer of Bharat',
    emoji: '🏹',
    skin: { base: '#9c6644', highlight: '#c08552', shadow: '#6f452a', rim: '#f6bd60' },
    eyes: { size: 1.05, shape: 'FIERCE_WARRIOR', iris: '#451a03', glow: '#f59e0b', thirdEye: false },
    hair: { color: '#18181b', style: 'WARRIOR_TOPKNOT', sway: 0.9 },
    facialHair: 'SHORT_STUBBLE',
    headgear: 'SILVER_GOLD_WAR_MUKUT',
    torso: { type: 'ROYAL_ARCHER_CUIRASS', main: '#334155', highlight: '#64748b', shadow: '#1e293b', trim: '#facc15' },
    legs: { type: 'WAR_GREAVES', color: '#1e293b', trim: '#facc15' },
    cape: { enabled: true, color: '#334155', trim: '#e2e8f0' },
    ornaments: { necklace: 'PEARL_WARRIOR_CHOKER', earrings: 'ROYAL_KUNDALAS', wrists: 'ARCHER_BRACERS' },
    markings: 'GANDIVA_SYMBOL'
  },

  KARNA: {
    id: 'KARNA',
    name: 'Karna: Suryaputra',
    role: 'Warrior of Golden Armor',
    emoji: '☀️',
    skin: { base: '#b45309', highlight: '#fbbf24', shadow: '#78350f', rim: '#fef08a' },
    eyes: { size: 1.1, shape: 'FIERCE_WARRIOR', iris: '#d97706', glow: '#fbbf24', thirdEye: false },
    hair: { color: '#09090b', style: 'WARRIOR_MANE', sway: 1.1 },
    facialHair: 'WARRIOR_MUSTACHE',
    headgear: 'SUN_SURYA_MUKUT',
    torso: { type: 'KAVACHA_GOLDEN_SKIN', main: '#eab308', highlight: '#fef08a', shadow: '#a16207', trim: '#f59e0b' },
    legs: { type: 'GOLD_LEGGINGS', color: '#ca8a04', trim: '#fef08a' },
    cape: { enabled: true, color: '#ea580c', trim: '#fef08a' },
    ornaments: { necklace: 'SURYA_COLLAR', earrings: 'DIVINE_KUNDALAS', wrists: 'GOLD_KADHAS' },
    markings: 'SURYA_CREST'
  },

  INDRA: {
    id: 'INDRA',
    name: 'Indra: King of Devas',
    role: 'Lord of Lightning & Heavens',
    emoji: '⚡',
    skin: { base: '#d4a373', highlight: '#faedcd', shadow: '#996633', rim: '#ffffff' },
    eyes: { size: 1.05, shape: 'ALMOND_DIVINE', iris: '#2563eb', glow: '#60a5fa', thirdEye: false },
    hair: { color: '#1e293b', style: 'ROYAL_WAVES', sway: 1.0 },
    facialHair: 'ROYAL_BEARD',
    headgear: 'VAJRA_DIAMOND_CROWN',
    torso: { type: 'CELESTIAL_ARMOR', main: '#4f46e5', highlight: '#818cf8', shadow: '#312e81', trim: '#facc15' },
    legs: { type: 'ROYAL_DHOTI', color: '#4338ca', trim: '#facc15' },
    cape: { enabled: true, color: '#3730a3', trim: '#93c5fd' },
    ornaments: { necklace: 'VAJRA_PENDANT', earrings: 'DIAMOND_STUDS', wrists: 'THUNDER_BRACERS' },
    markings: 'LIGHTNING_MARK'
  },

  GARUDA: {
    id: 'GARUDA',
    name: 'Garuda: King of Birds',
    role: 'Vehicle of Lord Vishnu',
    emoji: '🦅',
    skin: { base: '#b45309', highlight: '#f59e0b', shadow: '#78350f', rim: '#fef08a' },
    eyes: { size: 1.25, shape: 'FIERCE_WARRIOR', iris: '#b91c1c', glow: '#ef4444', thirdEye: false },
    hair: { color: '#ca8a04', style: 'FEATHER_CREST', sway: 1.4 },
    facialHair: 'NONE',
    headgear: 'GOLDEN_BEAK_CROWN',
    torso: { type: 'FEATHERED_CUIRASS', main: '#eab308', highlight: '#fef08a', shadow: '#854d0e', trim: '#b91c1c' },
    legs: { type: 'TALON_GREAVES', color: '#a16207', trim: '#fef08a' },
    cape: { enabled: true, color: '#ca8a04', trim: '#fef08a' },
    ornaments: { necklace: 'SNAKE_TROPHY_CHOKER', earrings: 'FEATHER_KUNDALAS', wrists: 'GOLD_TALON_BANDS' },
    markings: 'SOLAR_FEATHER'
  },

  YAKSHI: {
    id: 'YAKSHI',
    name: 'Yakshi: Forest Spirit',
    role: 'Guardian of Sacred Groves',
    emoji: '🌿',
    skin: { base: '#889a74', highlight: '#b7c7a3', shadow: '#586b46', rim: '#d9f99d' },
    eyes: { size: 1.3, shape: 'WIDE_INNOCENT', iris: '#15803d', glow: '#4ade80', thirdEye: false },
    hair: { color: '#172554', style: 'FLORAL_VINE_BRAIDS', sway: 1.4 },
    facialHair: 'NONE',
    headgear: 'JASMINE_FLOWER_TIARA',
    torso: { type: 'LUSH_SILK_CHOLI', main: '#15803d', highlight: '#22c55e', shadow: '#14532d', trim: '#fef08a' },
    legs: { type: 'EMERALD_SILK_SKIRT', color: '#166534', trim: '#86efac' },
    cape: { enabled: true, color: '#14532d', trim: '#4ade80' },
    ornaments: { necklace: 'LOTUS_SEED_MALA', earrings: 'BLOSSOM_STUDS', wrists: 'VINE_BRACELETS' },
    markings: 'LEAF_BINDI'
  },

  SHISHYA: {
    id: 'SHISHYA',
    name: 'Shishya: The Seeker',
    role: 'Devoted Disciple of Gurukul',
    emoji: '📜',
    skin: { base: '#9c6644', highlight: '#c08552', shadow: '#6f452a', rim: '#fde047' },
    eyes: { size: 1.15, shape: 'WIDE_INNOCENT', iris: '#3e2723', glow: '#f59e0b', thirdEye: false },
    hair: { color: '#0f172a', style: 'SIMPLE_TOPKNOT', sway: 0.8 },
    facialHair: 'NONE',
    headgear: 'NONE',
    torso: { type: 'SIMPLE_COTTON_UTTARIYA', main: '#f8fafc', highlight: '#ffffff', shadow: '#cbd5e1', trim: '#d97706' },
    legs: { type: 'COTTON_DHOTI', color: '#f1f5f9', trim: '#b45309' },
    cape: { enabled: false, color: '#f8fafc', trim: '#e2e8f0' },
    ornaments: { necklace: 'TULSI_BEADS', earrings: 'NONE', wrists: 'RED_SACRED_THREAD' },
    markings: 'SANDALWOOD_DOT'
  }
};

class CharacterRig {
  constructor(profileKey = 'RUDRA') {
    this.profile = JSON.parse(JSON.stringify(CHARACTER_PROFILES[profileKey] || CHARACTER_PROFILES.RUDRA));

    // World & Locomotion Transform
    this.worldX = 0;         // -220 (stage left) to +220 (stage right)
    this.worldY = 0;         // floor level offset
    this.targetX = 0;        // target destination
    this.walkSpeed = 160;    // pixels per second
    this.facing = 1;         // +1: facing right, -1: facing left
    this.isWalking = false;
    this.walkPhase = 0;      // 0 to 2*PI driving leg cycles

    // Skeletal transforms
    this.bones = {
      rootX: 0,
      rootY: 0,
      breathScaleY: 1.0,
      chestAngle: 0,
      headAngle: 0,
      headOffsetX: 0,
      headOffsetY: 0,
      jawOpen: 0,            // 0 (closed) to 1 (wide)
      mouthWidth: 1.0,       // phoneme width
      mouthShape: 'REST',    // 'REST', 'A', 'O', 'E', 'FIERCE'
      eyeBlink: 0,           // 0 to 1
      eyeLookX: 0,
      eyeLookY: 0,
      leftArmAngle: 0.2,
      rightArmAngle: -0.2,
      leftForearmAngle: 0.3,
      rightForearmAngle: -0.3,
      leftLegAngle: 0,       // hip rotation
      rightLegAngle: 0,
      leftKneeAngle: 0,      // knee bend
      rightKneeAngle: 0,
      gestureType: 'SPEAKING',
      hairSway: 0,
      capeSway: 0
    };

    this.time = 0;
    this.blinkTimer = 2.0 + Math.random() * 2.5;
    this.isBlinking = false;
    this.blinkProgress = 0;

    // Physics spring-damper states
    this.hairVel = 0;
    this.hairPos = 0;
    this.capeVel = 0;
    this.capePos = 0;
  }

  setProfile(profileKey) {
    if (CHARACTER_PROFILES[profileKey]) {
      this.profile = JSON.parse(JSON.stringify(CHARACTER_PROFILES[profileKey]));
    }
  }

  setCustomParam(category, key, value) {
    if (this.profile[category] && this.profile[category][key] !== undefined) {
      this.profile[category][key] = value;
    } else if (this.profile[key] !== undefined) {
      this.profile[key] = value;
    }
  }

  randomizeNewCharacter() {
    const keys = Object.keys(CHARACTER_PROFILES);
    const p1 = CHARACTER_PROFILES[keys[Math.floor(Math.random() * keys.length)]];
    const p2 = CHARACTER_PROFILES[keys[Math.floor(Math.random() * keys.length)]];

    const randomSkinHues = [
      { base: '#3b5368', highlight: '#5c7d99', shadow: '#1e2c38', rim: '#93c5fd' }, // Ash blue
      { base: '#b46e45', highlight: '#d98e64', shadow: '#784325', rim: '#fed7aa' }, // Wheatish
      { base: '#452b36', highlight: '#694152', shadow: '#26161e', rim: '#f43f5e' }, // Obsidian bronze
      { base: '#e6a66b', highlight: '#fcd34d', shadow: '#9a5c2d', rim: '#fef08a' }, // Radiant gold
      { base: '#1b4d4f', highlight: '#2dd4bf', shadow: '#0f292a', rim: '#5eead4' }, // Emerald serpent
      { base: '#253d6e', highlight: '#60a5fa', shadow: '#172554', rim: '#bfdbfe' }, // Deep sapphire
      { base: '#9c6644', highlight: '#c08552', shadow: '#6f452a', rim: '#fde047' }, // Warm tan
      { base: '#889a74', highlight: '#b7c7a3', shadow: '#586b46', rim: '#d9f99d' }  // Forest jade
    ];

    const chosenSkin = randomSkinHues[Math.floor(Math.random() * randomSkinHues.length)];
    const chosenEyeSize = 0.8 + Math.random() * 0.6; // 0.8 to 1.4

    this.profile = {
      id: 'CUSTOM_' + Date.now(),
      name: 'Hero: ' + ['Veera', 'Deva', 'Yoddha', 'Aditya', 'Bhairava', 'Tara', 'Surya'][Math.floor(Math.random() * 7)],
      role: 'Mythic Hero',
      emoji: ['✨', '⚔️', '🔱', '👑', '🏹', '⚡'][Math.floor(Math.random() * 6)],
      skin: chosenSkin,
      eyes: {
        size: chosenEyeSize,
        shape: ['FIERCE_WARRIOR', 'ALMOND_DIVINE', 'SERENE_MEDITATIVE', 'BURNING_ASURA', 'WIDE_INNOCENT'][Math.floor(Math.random() * 5)],
        iris: p1.eyes.iris,
        glow: p2.eyes.glow,
        thirdEye: Math.random() > 0.6
      },
      hair: {
        color: ['#0f172a', '#18181b', '#e2e8f0', '#ca8a04', '#451a03'][Math.floor(Math.random() * 5)],
        style: p1.hair.style,
        sway: 1.0 + Math.random() * 0.5
      },
      facialHair: ['NONE', 'SHORT_STUBBLE', 'WARRIOR_MUSTACHE', 'ROYAL_BEARD', 'FULL_WHITE_BEARD'][Math.floor(Math.random() * 5)],
      headgear: p2.headgear,
      torso: p1.torso,
      legs: p2.legs,
      cape: { enabled: Math.random() > 0.3, color: p1.cape.color, trim: p2.cape.trim },
      ornaments: p1.ornaments,
      markings: ['TRIPUNDRA_CHANDAN', 'CHANDAN_TILAK', 'DEVI_RED_BINDI', 'VISHNU_TILAK', 'GANDIVA_SYMBOL', 'NONE'][Math.floor(Math.random() * 6)]
    };
  }

  /**
   * Command character to walk smoothly to stage X position
   */
  moveTo(targetX, speed = 1.0) {
    this.targetX = targetX;
    this.walkSpeed = 160 * speed;
    if (Math.abs(this.targetX - this.worldX) > 2) {
      this.facing = this.targetX > this.worldX ? 1 : -1;
      this.isWalking = true;
    }
  }

  /**
   * Physics, Locomotion, and Lip-Sync Update
   */
  update(dt, audioAmplitude = 0, audioFreq = 0) {
    this.time += dt;

    // 1. Locomotion Kinematics
    const dist = this.targetX - this.worldX;
    if (Math.abs(dist) > 2) {
      this.isWalking = true;
      const step = Math.sign(dist) * Math.min(Math.abs(dist), this.walkSpeed * dt);
      this.worldX += step;
      this.facing = Math.sign(dist);

      // Walking Gait Cycle (Legs swing back and forth, knees articulate, hips bob)
      this.walkPhase += dt * 8.5;
      const legSwing = Math.sin(this.walkPhase) * 0.55;
      this.bones.leftLegAngle = legSwing;
      this.bones.rightLegAngle = -legSwing;
      this.bones.leftKneeAngle = Math.max(0, -Math.cos(this.walkPhase) * 0.65);
      this.bones.rightKneeAngle = Math.max(0, Math.cos(this.walkPhase) * 0.65);

      // Body bob while walking
      this.bones.rootY = Math.abs(Math.sin(this.walkPhase)) * -7;
      this.bones.chestAngle = Math.sin(this.walkPhase) * 0.04;
    } else {
      // Idle Standing Pose
      this.isWalking = false;
      this.bones.leftLegAngle *= 0.85;
      this.bones.rightLegAngle *= 0.85;
      this.bones.leftKneeAngle *= 0.85;
      this.bones.rightKneeAngle *= 0.85;
      this.bones.rootY *= 0.85;

      // Natural Breathing Cycle
      const breathSpeed = 1.8;
      this.bones.breathScaleY = 1.0 + Math.sin(this.time * breathSpeed) * 0.022;
      this.bones.chestAngle = Math.sin(this.time * breathSpeed) * 0.015;
    }

    // 2. Head Cadence & Conversational Nod
    const speechInfluence = Math.min(1.0, audioAmplitude * 2.5);
    const naturalNod = Math.sin(this.time * 3.2) * 0.04 * speechInfluence;
    const naturalTilt = Math.cos(this.time * 1.5) * 0.02;
    this.bones.headAngle = naturalNod + naturalTilt;
    this.bones.headOffsetY = Math.sin(this.time * 1.8) * 2;

    // 3. Eye Blinking Logic
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0 && !this.isBlinking) {
      this.isBlinking = true;
      this.blinkProgress = 0;
      this.blinkTimer = 2.8 + Math.random() * 3.5;
    }

    if (this.isBlinking) {
      this.blinkProgress += dt * 14;
      if (this.blinkProgress >= Math.PI) {
        this.isBlinking = false;
        this.bones.eyeBlink = 0;
      } else {
        this.bones.eyeBlink = Math.sin(this.blinkProgress);
      }
    }

    this.bones.eyeLookX = Math.sin(this.time * 0.7) * 0.2;
    this.bones.eyeLookY = Math.cos(this.time * 0.4) * 0.1;

    // 4. Real-Time Lip-Sync
    if (audioAmplitude > 0.04) {
      const targetJaw = Math.min(1.0, audioAmplitude * 3.0);
      this.bones.jawOpen += (targetJaw - this.bones.jawOpen) * 0.45;
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
      this.bones.jawOpen += (0 - this.bones.jawOpen) * 0.3;
      this.bones.mouthWidth += (1.0 - this.bones.mouthWidth) * 0.3;
      this.bones.mouthShape = 'REST';
    }

    // 5. Arm Gestures (Walking counter-swing or Conversational speaking)
    if (this.isWalking) {
      const armSwing = Math.sin(this.walkPhase) * 0.4;
      this.bones.leftArmAngle = -armSwing;
      this.bones.rightArmAngle = armSwing;
      this.bones.leftForearmAngle = 0.2;
      this.bones.rightForearmAngle = -0.2;
    } else {
      // Conversational idle arm motion
      this.bones.leftArmAngle = 0.15 + Math.sin(this.time * 2.0) * 0.06 * speechInfluence;
      this.bones.rightArmAngle = -0.15 - Math.cos(this.time * 2.2) * 0.06 * speechInfluence;
      this.bones.leftForearmAngle = 0.35 + Math.sin(this.time * 2.5) * 0.1 * speechInfluence;
      this.bones.rightForearmAngle = -0.35 - Math.cos(this.time * 2.8) * 0.1 * speechInfluence;
    }

    // 6. Secondary Physics for Hair & Cape
    const hairTarget = -this.bones.headAngle * 10 + Math.sin(this.time * 2.5) * 4;
    const hairForce = (hairTarget - this.hairPos) * 16 - this.hairVel * 4;
    this.hairVel += hairForce * dt;
    this.hairPos += this.hairVel * dt;
    this.bones.hairSway = this.hairPos;

    const capeTarget = Math.sin(this.time * 2.0) * 12 + (this.isWalking ? -this.facing * 14 : 0);
    const capeForce = (capeTarget - this.capePos) * 14 - this.capeVel * 3;
    this.capeVel += capeForce * dt;
    this.capePos += this.capeVel * dt;
    this.bones.capeSway = this.capePos;
  }

  /**
   * Main Hierarchical 2.5D Render Function
   */
  render(ctx, scale = 1.0) {
    ctx.save();

    // Stage Translation & Facing Direction Flip
    ctx.translate(this.worldX, this.worldY + this.bones.rootY);
    ctx.scale(this.facing * scale, scale * this.bones.breathScaleY);

    // Layer 1: Back Cape & Hair
    if (this.profile.cape.enabled) {
      this.renderCape(ctx);
    }
    this.renderBackHair(ctx);

    // Layer 2: Articulated Legs & Walking Sandal/Greaves
    this.renderLegs(ctx);

    // Layer 3: Torso Cuirass / Robe & Shoulders
    this.renderTorso(ctx);

    // Layer 4: Neck & Sacred Malas
    this.renderNeck(ctx);

    // Layer 5: Head, Facial Structure, Eyes, Nose & Lip-Sync Mouth
    ctx.save();
    ctx.translate(this.bones.headOffsetX, -165 + this.bones.headOffsetY);
    ctx.rotate(this.bones.headAngle);

    this.renderHead(ctx);
    this.renderFacialFeatures(ctx);
    this.renderCrownAndFrontHair(ctx);

    ctx.restore();

    // Layer 6: Front Articulated Arms, Wrists & Gestures
    this.renderArms(ctx);

    ctx.restore();
  }

  /* ------------------- ARTICULATED LIMB RENDERING ------------------- */

  renderLegs(ctx) {
    ctx.save();
    const legType = this.profile.legs?.type || 'ROYAL_DHOTI';
    const mainColor = this.profile.legs?.color || '#ea580c';
    const trimColor = this.profile.legs?.trim || '#facc15';

    // Left Leg (Behind / Lead)
    this.renderSingleLeg(ctx, -26, this.bones.leftLegAngle, this.bones.leftKneeAngle, mainColor, trimColor, legType);

    // Right Leg (Front / Trail)
    this.renderSingleLeg(ctx, 26, this.bones.rightLegAngle, this.bones.rightKneeAngle, mainColor, trimColor, legType);

    ctx.restore();
  }

  renderSingleLeg(ctx, hipX, hipAngle, kneeAngle, color, trim, type) {
    ctx.save();
    ctx.translate(hipX, 110);
    ctx.rotate(hipAngle);

    // Thigh
    ctx.fillStyle = color;
    ctx.strokeStyle = trim;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(16, 0);
    ctx.lineTo(13, 85);
    ctx.lineTo(-13, 85);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Knee joint
    ctx.translate(0, 85);
    ctx.rotate(kneeAngle);

    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fillStyle = trim;
    ctx.fill();

    // Shin & Calf
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.lineTo(11, 0);
    ctx.lineTo(9, 85);
    ctx.lineTo(-9, 85);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Foot / Sandal / Greave
    ctx.translate(0, 85);
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(24, 0);
    ctx.lineTo(22, 14);
    ctx.lineTo(-10, 14);
    ctx.closePath();
    ctx.fill();

    // Gold Payal / Anklet
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-11, -3, 22, 4);

    ctx.restore();
  }

  renderCape(ctx) {
    ctx.save();
    const sway = this.bones.capeSway;
    ctx.fillStyle = this.profile.cape.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 16;

    ctx.beginPath();
    ctx.moveTo(-100, -110);
    ctx.quadraticCurveTo(-130 + sway, 120, -150 + sway * 1.5, 330);
    ctx.lineTo(150 + sway * 1.5, 330);
    ctx.quadraticCurveTo(130 + sway, 120, 100, -110);
    ctx.closePath();
    ctx.fill();

    // Gold trim
    ctx.strokeStyle = this.profile.cape.trim || '#facc15';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.restore();
  }

  renderBackHair(ctx) {
    ctx.save();
    const sway = this.bones.hairSway;
    ctx.fillStyle = this.profile.hair.color;

    // Flowing hair strands down the back
    ctx.beginPath();
    ctx.moveTo(-65, -160);
    ctx.quadraticCurveTo(-95 + sway, -40, -80 + sway * 1.2, 70);
    ctx.quadraticCurveTo(-55, 35, -35, -120);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(65, -160);
    ctx.quadraticCurveTo(95 + sway, -40, 80 + sway * 1.2, 70);
    ctx.quadraticCurveTo(55, 35, 35, -120);
    ctx.fill();

    ctx.restore();
  }

  renderTorso(ctx) {
    ctx.save();
    ctx.rotate(this.bones.chestAngle);

    const t = this.profile.torso;
    const grad = ctx.createLinearGradient(-90, -120, 90, 120);
    grad.addColorStop(0, t.highlight);
    grad.addColorStop(0.5, t.main);
    grad.addColorStop(1, t.shadow);

    ctx.fillStyle = grad;
    ctx.strokeStyle = t.trim;
    ctx.lineWidth = 3;

    // Muscular Cuirass / Robe Form
    ctx.beginPath();
    ctx.moveTo(-68, -110);
    ctx.lineTo(68, -110);
    ctx.lineTo(80, 0);
    ctx.lineTo(58, 120);
    ctx.lineTo(-58, 120);
    ctx.lineTo(-80, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Emblem or Royal Sun / Lotus Plate on Chest
    ctx.save();
    ctx.fillStyle = t.trim;
    ctx.beginPath();
    ctx.arc(0, -30, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#050811';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.lineTo(Math.cos(angle) * 22, -30 + Math.sin(angle) * 22);
      ctx.stroke();
    }
    ctx.restore();

    // Sacred Waist Belt (Kamarbandh)
    ctx.fillStyle = t.trim;
    ctx.fillRect(-62, 105, 124, 14);

    ctx.restore();
  }

  renderNeck(ctx) {
    ctx.save();
    const skin = this.profile.skin;
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.moveTo(-28, -160);
    ctx.lineTo(28, -160);
    ctx.lineTo(34, -110);
    ctx.lineTo(-34, -110);
    ctx.closePath();
    ctx.fill();

    // Sacred Neck Ornaments (Rudraksha, Gold Haram, Snake)
    const orn = this.profile.ornaments?.necklace;
    if (orn === 'RUDRAKSHA_COBRA') {
      // Emerald Cobra wrapped around neck
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.arc(0, -125, 26, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Cobra head
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(28, -128, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (orn === 'RUDRAKSHA_MALA') {
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 6;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, -125, 30, 0.1, Math.PI - 0.1);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // Golden Choker
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, -125, 28, 0.1, Math.PI - 0.1);
      ctx.stroke();
    }

    ctx.restore();
  }

  renderHead(ctx) {
    ctx.save();
    const skin = this.profile.skin;

    // Sculpted jaw and cranial mass
    const headGrad = ctx.createRadialGradient(0, -25, 15, 0, -20, 80);
    headGrad.addColorStop(0, skin.highlight);
    headGrad.addColorStop(0.65, skin.base);
    headGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = headGrad;
    ctx.strokeStyle = skin.rim;
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    ctx.moveTo(-48, -75);
    ctx.quadraticCurveTo(-52, -20, -42, 35);
    ctx.quadraticCurveTo(-26, 68, 0, 72); // sculpted chin
    ctx.quadraticCurveTo(26, 68, 42, 35);
    ctx.quadraticCurveTo(52, -20, 48, -75);
    ctx.quadraticCurveTo(0, -105, -48, -75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ears with Kundalas
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.arc(-50, 0, 11, 0, Math.PI * 2);
    ctx.arc(50, 0, 11, 0, Math.PI * 2);
    ctx.fill();

    // Golden Kundala Earrings
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(-52, 14, 8, 0, Math.PI * 2);
    ctx.arc(52, 14, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Beard / Mustache
    const fh = this.profile.facialHair;
    if (fh === 'FULL_WHITE_BEARD') {
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(-36, 25);
      ctx.quadraticCurveTo(-45, 90, 0, 135);
      ctx.quadraticCurveTo(45, 90, 36, 25);
      ctx.quadraticCurveTo(0, 45, -36, 25);
      ctx.fill();
    } else if (fh === 'WARRIOR_MUSTACHE') {
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.moveTo(-28, 30);
      ctx.quadraticCurveTo(-14, 18, 0, 24);
      ctx.quadraticCurveTo(14, 18, 28, 30);
      ctx.quadraticCurveTo(12, 38, 0, 31);
      ctx.quadraticCurveTo(-12, 38, -28, 30);
      ctx.fill();
    }

    ctx.restore();
  }

  renderFacialFeatures(ctx) {
    ctx.save();
    const skin = this.profile.skin;
    const eyes = this.profile.eyes;
    const eyeScale = eyes.size || 1.0;

    // Sacred Markings / Tilak
    const m = this.profile.markings;
    if (m === 'TRIPUNDRA_CHANDAN') {
      // 3 horizontal sacred ash lines
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-26, -55 + i * 6);
        ctx.lineTo(26, -55 + i * 6);
        ctx.stroke();
      }
      // Red Kumkum center
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -55, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (m === 'CHANDAN_TILAK') {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-6, -68);
      ctx.lineTo(6, -68);
      ctx.lineTo(3, -42);
      ctx.lineTo(-3, -42);
      ctx.closePath();
      ctx.fill();
    } else if (m === 'DEVI_RED_BINDI') {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -50, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Third Eye (Trinetra)
    if (eyes.thirdEye) {
      ctx.strokeStyle = '#facc15';
      ctx.fillStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -68);
      ctx.quadraticCurveTo(8, -55, 0, -42);
      ctx.quadraticCurveTo(-8, -55, 0, -68);
      ctx.fill();
      ctx.stroke();

      // Burning spark inside
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -55, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Brows
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-36, -32);
    ctx.quadraticCurveTo(-20, -38, -6, -30);
    ctx.lineTo(-6, -26);
    ctx.quadraticCurveTo(-20, -32, -36, -28);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(36, -32);
    ctx.quadraticCurveTo(20, -38, 6, -30);
    ctx.lineTo(6, -26);
    ctx.quadraticCurveTo(20, -32, 36, -28);
    ctx.fill();

    // Eyes with parametric sizing & blinking
    const blink = this.bones.eyeBlink;
    const lookX = this.bones.eyeLookX * 4;
    const lookY = this.bones.eyeLookY * 3;

    [-22, 22].forEach((eyeX, idx) => {
      ctx.save();
      ctx.translate(eyeX, -15);
      ctx.scale(eyeScale, eyeScale * (1.0 - blink));

      // Sclera
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris & Glowing Pupil
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 7.5, 0, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = eyes.iris || '#facc15';
      ctx.beginPath();
      ctx.arc(lookX, lookY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(lookX, lookY, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Light catch
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(lookX - 1.5, lookY - 1.5, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Eyelid stroke
      ctx.strokeStyle = '#050811';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, 14, Math.PI + 0.2, -0.2);
      ctx.stroke();

      ctx.restore();
    });

    // Sculpted Nose
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(0, 18);
    ctx.lineTo(6, 22);
    ctx.stroke();

    // Real-Time Lip-Sync Mouth
    ctx.save();
    ctx.translate(0, 44);
    const jaw = this.bones.jawOpen;
    const mw = this.bones.mouthWidth;

    ctx.fillStyle = '#831843'; // deep rose lip
    ctx.strokeStyle = '#500724';
    ctx.lineWidth = 1.8;

    if (jaw < 0.12) {
      // Resting closed lips
      ctx.beginPath();
      ctx.moveTo(-16 * mw, 0);
      ctx.quadraticCurveTo(0, -3.5, 16 * mw, 0);
      ctx.quadraticCurveTo(0, 4.5, -16 * mw, 0);
      ctx.fill();
      ctx.stroke();
    } else {
      // Dynamic talking mouth opening
      ctx.beginPath();
      ctx.moveTo(-16 * mw, 0);
      ctx.quadraticCurveTo(0, -6 * jaw, 16 * mw, 0);
      ctx.quadraticCurveTo(0, 16 * jaw, -16 * mw, 0);
      ctx.closePath();
      ctx.fillStyle = '#1c0a13'; // mouth cavity
      ctx.fill();
      ctx.stroke();

      // Teeth
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-8 * mw, -2 * jaw, 16 * mw, 4 * jaw);
    }

    ctx.restore();
    ctx.restore();
  }

  renderCrownAndFrontHair(ctx) {
    ctx.save();
    const hg = this.profile.headgear;
    const hairColor = this.profile.hair.color;

    if (hg === 'CRESCENT_MOON_SERPENT') {
      // Matted Jata bun
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.arc(0, -95, 38, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Crescent Moon (Chandra)
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(28, -98, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.arc(23, -98, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (hg === 'SPIKED_HORNED_CROWN') {
      // Obsidian Asura Horns
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(-45, -75);
      ctx.quadraticCurveTo(-90, -135, -75, -175);
      ctx.quadraticCurveTo(-65, -120, -35, -85);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(45, -75);
      ctx.quadraticCurveTo(90, -135, 75, -175);
      ctx.quadraticCurveTo(65, -120, 35, -85);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (hg === 'GOLDEN_LOTUS_TIARA' || hg === 'SILVER_GOLD_WAR_MUKUT' || hg === 'VAJRA_DIAMOND_CROWN') {
      // Ornate Golden Mukut
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(-50, -75);
      ctx.lineTo(-30, -135);
      ctx.lineTo(0, -165);
      ctx.lineTo(30, -135);
      ctx.lineTo(50, -75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Center glowing ruby gem
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(0, -115, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (hg === 'RUDRAKSHA_BEAD_BAND') {
      ctx.fillStyle = '#78350f';
      for (let x = -40; x <= 40; x += 12) {
        ctx.beginPath();
        ctx.arc(x, -76, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  renderArms(ctx) {
    ctx.save();
    const skin = this.profile.skin;
    const t = this.profile.torso;

    // Left Arm
    this.renderSingleArm(ctx, -75, -100, this.bones.leftArmAngle, this.bones.leftForearmAngle, skin, t.trim, -1);

    // Right Arm
    this.renderSingleArm(ctx, 75, -100, this.bones.rightArmAngle, this.bones.rightForearmAngle, skin, t.trim, 1);

    ctx.restore();
  }

  renderSingleArm(ctx, shoulderX, shoulderY, armAngle, forearmAngle, skin, trim, side) {
    ctx.save();
    ctx.translate(shoulderX, shoulderY);

    // Pauldron / Shoulder Armor
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    // Upper Arm
    ctx.rotate(armAngle);
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.roundRect(-12, 0, 24, 75, 10);
    ctx.fill();

    // Forearm & Hand
    ctx.translate(0, 75);
    ctx.rotate(forearmAngle);

    // Gold Bracer / Kadha
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-13, 0, 26, 18);

    // Forearm
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.roundRect(-11, 18, 22, 60, 8);
    ctx.fill();

    // Hand with Mudra gesture
    ctx.translate(0, 78);
    ctx.fillStyle = skin.highlight;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();

    // Fingers
    ctx.fillStyle = skin.base;
    for (let f = -8; f <= 8; f += 5.5) {
      ctx.beginPath();
      ctx.roundRect(f - 2, 8, 4, 14, 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
