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
  render(ctx, arg1 = 0, arg2 = 0, arg3 = 1.0) {
    let scale = 1.0;
    let ox = 0;
    let oy = 0;
    if (typeof arg3 === 'number' && arg3 > 0) {
      ox = arg1 || 0;
      oy = arg2 || 0;
      scale = arg3;
    } else if (typeof arg1 === 'number' && arg1 > 0) {
      scale = arg1;
    }
    if (!scale || scale <= 0) scale = 1.0;

    ctx.save();

    // Stage Translation & Facing Direction Flip
    ctx.translate(this.worldX + ox, this.worldY + oy + this.bones.rootY);
    ctx.scale(this.facing * scale, scale * this.bones.breathScaleY);

    // Layer 0: Divine Prabhavali (Sacred Radiance & Aura)
    this.renderPrabhavali(ctx);

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

  /* ------------------- SACRED DIVINE PRABHAVALI (AURA & HALO) ------------------- */

  renderPrabhavali(ctx) {
    ctx.save();
    ctx.translate(this.bones.headOffsetX * 0.5, -150);
    const pulse = 1.0 + Math.sin(this.time * 2.2) * 0.04;
    const auraRadius = 115 * pulse;
    const auraColor = this.profile.eyes.glow || this.profile.torso.trim || '#facc15';

    // Soft outer celestial radiance
    const auraGrad = ctx.createRadialGradient(0, 0, 30, 0, 0, auraRadius);
    auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    auraGrad.addColorStop(0.35, auraColor + '28');
    auraGrad.addColorStop(0.75, auraColor + '10');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
    ctx.fill();

    // Sacred golden halo ring with delicate rays
    ctx.strokeStyle = auraColor + '55';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 75, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle radiating sacred needles
    ctx.save();
    ctx.rotate(this.time * 0.15);
    ctx.strokeStyle = auraColor + '40';
    ctx.lineWidth = 1.2;
    for (let r = 0; r < 16; r++) {
      const angle = (r / 16) * Math.PI * 2;
      const x1 = Math.cos(angle) * 76;
      const y1 = Math.sin(angle) * 76;
      const x2 = Math.cos(angle) * 92;
      const y2 = Math.sin(angle) * 92;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  /* ------------------- ARTICULATED LIMB RENDERING ------------------- */

  renderLegs(ctx) {
    ctx.save();
    const legType = this.profile.legs?.type || 'ROYAL_DHOTI';
    const mainColor = this.profile.legs?.color || '#ea580c';
    const trimColor = this.profile.legs?.trim || '#facc15';

    // Left Leg (Behind / Lead)
    this.renderSingleLeg(ctx, -26, this.bones.leftLegAngle, this.bones.leftKneeAngle, mainColor, trimColor, legType, -1);

    // Right Leg (Front / Trail)
    this.renderSingleLeg(ctx, 26, this.bones.rightLegAngle, this.bones.rightKneeAngle, mainColor, trimColor, legType, 1);

    ctx.restore();
  }

  renderSingleLeg(ctx, hipX, hipAngle, kneeAngle, color, trim, type, side = 1) {
    ctx.save();
    ctx.translate(hipX, 110);
    ctx.rotate(hipAngle);

    // 1. Thigh & Cascading Pleated Dhoti / Greave
    const thighGrad = ctx.createLinearGradient(-18, 0, 18, 90);
    thighGrad.addColorStop(0, color);
    thighGrad.addColorStop(0.5, color);
    thighGrad.addColorStop(1, '#1e1104');

    ctx.fillStyle = thighGrad;
    ctx.strokeStyle = trim;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.quadraticCurveTo(-22, 45, -14, 88);
    ctx.lineTo(14, 88);
    ctx.quadraticCurveTo(22, 45, 18, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dhoti Silk Pleats (diagonal fold highlights)
    ctx.strokeStyle = trim + '77';
    ctx.lineWidth = 1.5;
    for (let p = 15; p <= 75; p += 18) {
      ctx.beginPath();
      ctx.moveTo(-14, p);
      ctx.lineTo(12, p + 6);
      ctx.stroke();
    }

    // Embroidered Zari border along thigh hem
    ctx.strokeStyle = trim;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-15, 84);
    ctx.lineTo(15, 84);
    ctx.stroke();

    // 2. Articulated Knee Cop / Rondel
    ctx.translate(0, 88);
    ctx.rotate(kneeAngle);

    // Golden knee medallion
    const kneeGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 13);
    kneeGrad.addColorStop(0, '#ffffff');
    kneeGrad.addColorStop(0.3, trim);
    kneeGrad.addColorStop(1, '#b45309');

    ctx.fillStyle = kneeGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center jewel in knee rondel
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // 3. Shin, Calf & Lower Dhoti / Greave
    ctx.fillStyle = thighGrad;
    ctx.strokeStyle = trim;
    ctx.lineWidth = 2.2;

    ctx.beginPath();
    ctx.moveTo(-13, 0);
    ctx.quadraticCurveTo(-16, 45, -10, 85);
    ctx.lineTo(10, 85);
    ctx.quadraticCurveTo(16, 45, 13, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Shin highlights / pleats
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(0, 75);
    ctx.stroke();

    // 4. Ankle & Sacred Ornate Payal / Ghungroos
    ctx.translate(0, 85);

    // Multi-tier Golden Payal
    ctx.fillStyle = trim;
    ctx.fillRect(-12, -4, 24, 5);
    // Ghungroo bells
    for (let g = -10; g <= 10; g += 5) {
      ctx.beginPath();
      ctx.arc(g, 3, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Foot Anatomy & Royal Paduka / Sandal
    // Foot arch
    ctx.fillStyle = this.profile.skin.base;
    ctx.beginPath();
    ctx.moveTo(-10, 2);
    ctx.lineTo(24, 2);
    ctx.quadraticCurveTo(26, 12, 22, 16);
    ctx.lineTo(-10, 16);
    ctx.closePath();
    ctx.fill();

    // Golden Sandal Sole
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.roundRect(-12, 14, 38, 5, 2);
    ctx.fill();

    // Royal Sandal Straps & Golden Toe Ring (Angutha)
    ctx.strokeStyle = trim;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, 3);
    ctx.lineTo(14, 14);
    ctx.moveTo(8, 3);
    ctx.lineTo(20, 14);
    ctx.stroke();

    // Golden Toe Stud
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(22, 9, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderCape(ctx) {
    ctx.save();
    const sway = this.bones.capeSway;
    const capeColor = this.profile.cape.color;
    const trimColor = this.profile.cape.trim || '#facc15';

    // Rich shaded velvet / royal silk gradient
    const capeGrad = ctx.createLinearGradient(0, -110, sway * 0.8, 330);
    capeGrad.addColorStop(0, '#0a0a0f');
    capeGrad.addColorStop(0.35, capeColor);
    capeGrad.addColorStop(0.85, capeColor);
    capeGrad.addColorStop(1, '#05070d');

    ctx.fillStyle = capeGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 22;

    // Fluid royal drape geometry
    ctx.beginPath();
    ctx.moveTo(-105, -110);
    ctx.quadraticCurveTo(-135 + sway * 0.7, 110, -165 + sway * 1.4, 335);
    ctx.quadraticCurveTo(-70 + sway * 0.9, 320, 0 + sway * 0.5, 338);
    ctx.quadraticCurveTo(70 + sway * 0.9, 320, 165 + sway * 1.4, 335);
    ctx.quadraticCurveTo(135 + sway * 0.7, 110, 105, -110);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;

    // Embroidered Golden Zari Border Hem
    ctx.strokeStyle = trimColor;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Inner embroidered filigree line
    ctx.strokeStyle = trimColor + '66';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-155 + sway * 1.4, 325);
    ctx.quadraticCurveTo(-70 + sway * 0.9, 312, 0 + sway * 0.5, 328);
    ctx.quadraticCurveTo(70 + sway * 0.9, 312, 155 + sway * 1.4, 325);
    ctx.stroke();

    // Corner Golden Medallions / Tassels
    ctx.fillStyle = trimColor;
    ctx.beginPath();
    ctx.arc(-165 + sway * 1.4, 335, 5, 0, Math.PI * 2);
    ctx.arc(165 + sway * 1.4, 335, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderBackHair(ctx) {
    ctx.save();
    const sway = this.bones.hairSway;
    const hairColor = this.profile.hair.color;

    // Multi-lock flowing hair with depth gradients
    const hairGrad = ctx.createLinearGradient(0, -160, 0, 120);
    hairGrad.addColorStop(0, '#020306');
    hairGrad.addColorStop(0.6, hairColor);
    hairGrad.addColorStop(1, '#090d16');

    ctx.fillStyle = hairGrad;

    // Left flowing locks (cascading layers)
    ctx.beginPath();
    ctx.moveTo(-60, -160);
    ctx.quadraticCurveTo(-110 + sway * 0.8, -40, -95 + sway * 1.2, 85);
    ctx.quadraticCurveTo(-70 + sway * 0.5, 50, -45, -120);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-45, -140);
    ctx.quadraticCurveTo(-90 + sway * 1.1, -10, -75 + sway * 1.6, 120);
    ctx.quadraticCurveTo(-50 + sway * 0.7, 70, -25, -100);
    ctx.fill();

    // Right flowing locks (cascading layers)
    ctx.beginPath();
    ctx.moveTo(60, -160);
    ctx.quadraticCurveTo(110 + sway * 0.8, -40, 95 + sway * 1.2, 85);
    ctx.quadraticCurveTo(70 + sway * 0.5, 50, 45, -120);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(45, -140);
    ctx.quadraticCurveTo(90 + sway * 1.1, -10, 75 + sway * 1.6, 120);
    ctx.quadraticCurveTo(50 + sway * 0.7, 70, 25, -100);
    ctx.fill();

    // Lustrous sheen strands
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-52, -130);
    ctx.quadraticCurveTo(-82 + sway, 0, -68 + sway * 1.3, 75);
    ctx.moveTo(52, -130);
    ctx.quadraticCurveTo(82 + sway, 0, 68 + sway * 1.3, 75);
    ctx.stroke();

    ctx.restore();
  }

  renderTorso(ctx) {
    ctx.save();
    ctx.rotate(this.bones.chestAngle);

    const t = this.profile.torso;
    const skin = this.profile.skin;

    // Muscular Cuirass / Robe Form with 3D volumetric shading
    const grad = ctx.createLinearGradient(-90, -120, 90, 120);
    grad.addColorStop(0, t.highlight);
    grad.addColorStop(0.5, t.main);
    grad.addColorStop(1, t.shadow);

    ctx.fillStyle = grad;
    ctx.strokeStyle = t.trim;
    ctx.lineWidth = 3.2;

    // Contoured anatomical chest / armor silhouette
    ctx.beginPath();
    ctx.moveTo(-70, -112);
    ctx.quadraticCurveTo(0, -118, 70, -112);
    ctx.quadraticCurveTo(86, -50, 80, 5);
    ctx.quadraticCurveTo(72, 65, 58, 120);
    ctx.lineTo(-58, 120);
    ctx.quadraticCurveTo(-72, 65, -80, 5);
    ctx.quadraticCurveTo(-86, -50, -70, -112);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pectoral Plate Contouring
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.lineWidth = 2.0;
    // Left pec
    ctx.beginPath();
    ctx.arc(-26, -50, 28, 0.2, Math.PI - 0.4);
    ctx.stroke();
    // Right pec
    ctx.beginPath();
    ctx.arc(26, -50, 28, 0.4, Math.PI - 0.2);
    ctx.stroke();

    // Pectoral Highlight Sheen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(-28, -58, 22, -0.6, 0.6);
    ctx.moveTo(28, -58);
    ctx.arc(28, -58, 22, Math.PI - 0.6, Math.PI + 0.6);
    ctx.stroke();

    // Sacred Diagonal Janeu Thread (Yajnopavita)
    ctx.save();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(-45, -110);
    ctx.quadraticCurveTo(-10, 0, 50, 115);
    ctx.stroke();
    // Second strand
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-41, -110);
    ctx.quadraticCurveTo(-6, 0, 54, 115);
    ctx.stroke();
    ctx.restore();

    // Royal 12-Petaled Padma Sunburst Chest Medallion
    ctx.save();
    ctx.translate(0, -32);

    // Golden base disc
    const medGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
    medGrad.addColorStop(0, '#ffffff');
    medGrad.addColorStop(0.4, t.trim);
    medGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = medGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 12 Radiating Embossed Sacred Petals
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
      ctx.lineTo(Math.cos(angle) * 23, Math.sin(angle) * 23);
      ctx.stroke();
    }

    // Faceted Center Gemstone (Ruby / Emerald / Sapphire)
    const gemColor = this.profile.eyes.glow || '#ef4444';
    const gemGrad = ctx.createRadialGradient(-3, -3, 1, 0, 0, 9);
    gemGrad.addColorStop(0, '#ffffff');
    gemGrad.addColorStop(0.3, gemColor);
    gemGrad.addColorStop(1, '#450a0a');
    ctx.fillStyle = gemGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();

    // Ornate Multi-Tiered Golden Kamarbandh (Waistband & Pleated Sash)
    // Waistband
    const beltGrad = ctx.createLinearGradient(-65, 105, 65, 120);
    beltGrad.addColorStop(0, '#b45309');
    beltGrad.addColorStop(0.5, t.trim);
    beltGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = beltGrad;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-64, 104, 128, 16, 4);
    ctx.fill();
    ctx.stroke();

    // Gem studs on belt
    for (let bx = -50; bx <= 50; bx += 20) {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(bx, 112, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Central Royal Buckle
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 112, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cascading Center Pleated Sash (Patka)
    ctx.fillStyle = t.main;
    ctx.strokeStyle = t.trim;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, 120);
    ctx.lineTo(16, 120);
    ctx.lineTo(20, 185);
    ctx.lineTo(0, 195);
    ctx.lineTo(-20, 185);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Golden fringe at bottom of sash
    ctx.strokeStyle = t.trim;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-18, 183);
    ctx.lineTo(0, 193);
    ctx.lineTo(18, 183);
    ctx.stroke();

    ctx.restore();
  }

  renderNeck(ctx) {
    ctx.save();
    const skin = this.profile.skin;

    // Muscular neck cylinder with anatomical sternocleidomastoid shading
    const neckGrad = ctx.createLinearGradient(-30, -160, 30, -110);
    neckGrad.addColorStop(0, skin.shadow);
    neckGrad.addColorStop(0.5, skin.base);
    neckGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(-28, -160);
    ctx.lineTo(28, -160);
    ctx.lineTo(36, -110);
    ctx.lineTo(-36, -110);
    ctx.closePath();
    ctx.fill();

    // Neck tendon shadows & jugular notch
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-16, -155);
    ctx.lineTo(-7, -118);
    ctx.moveTo(16, -155);
    ctx.lineTo(7, -118);
    ctx.stroke();

    // Clavicle (Collarbone) Highlight
    ctx.strokeStyle = skin.highlight;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-50, -110);
    ctx.quadraticCurveTo(-18, -112, -4, -116);
    ctx.moveTo(50, -110);
    ctx.quadraticCurveTo(18, -112, 4, -116);
    ctx.stroke();

    // Sacred Neck Ornaments
    const orn = this.profile.ornaments?.necklace;

    if (orn === 'RUDRAKSHA_COBRA') {
      // 1. Coiled Emerald Naga Cobra around neck
      ctx.save();
      // Cobra body
      const cobraGrad = ctx.createLinearGradient(-35, -135, 35, -115);
      cobraGrad.addColorStop(0, '#064e3b');
      cobraGrad.addColorStop(0.5, '#10b981');
      cobraGrad.addColorStop(1, '#022c22');
      ctx.strokeStyle = cobraGrad;
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.arc(0, -125, 27, 0.15, Math.PI - 0.15);
      ctx.stroke();

      // Golden belly bands on serpent
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      for (let s = 0.4; s < Math.PI - 0.4; s += 0.35) {
        const sx = Math.cos(s) * 27;
        const sy = -125 + Math.sin(s) * 27;
        ctx.beginPath();
        ctx.arc(sx, sy, 5, s - 0.3, s + 0.3);
        ctx.stroke();
      }

      // Flared Cobra Head
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.ellipse(29, -128, 10, 7, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Ruby red cobra eye
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(33, -129, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Forked golden tongue
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(38, -127);
      ctx.lineTo(44, -126);
      ctx.lineTo(47, -128);
      ctx.moveTo(44, -126);
      ctx.lineTo(47, -124);
      ctx.stroke();
      ctx.restore();

    } else if (orn === 'RUDRAKSHA_MALA' || orn === 'LOTUS_SEED_MALA') {
      // 3D Spherical Rudraksha / Sacred Lotus Beads with Golden Capping
      ctx.save();
      const beadCount = 14;
      for (let i = 0; i <= beadCount; i++) {
        const theta = 0.15 + (i / beadCount) * (Math.PI - 0.3);
        const bx = Math.cos(theta) * 31;
        const by = -124 + Math.sin(theta) * 31;

        // Gold bead cap
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(bx, by, 6.2, 0, Math.PI * 2);
        ctx.fill();

        // 3D Rudraksha bead
        const beadGrad = ctx.createRadialGradient(bx - 1.5, by - 1.5, 1, bx, by, 5);
        beadGrad.addColorStop(0, '#b45309');
        beadGrad.addColorStop(0.6, '#78350f');
        beadGrad.addColorStop(1, '#291104');
        ctx.fillStyle = beadGrad;
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central Golden Guru Bead Pendant
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -92, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

    } else {
      // Ornate Royal Gold Haram / Choker with Cascading Jewel Drops
      ctx.save();
      const goldGrad = ctx.createLinearGradient(-35, -135, 35, -115);
      goldGrad.addColorStop(0, '#facc15');
      goldGrad.addColorStop(0.5, '#fef08a');
      goldGrad.addColorStop(1, '#d97706');

      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, -124, 29, 0.12, Math.PI - 0.12);
      ctx.stroke();

      // Dangling Pearl / Ruby Drops
      for (let i = 2; i <= 8; i++) {
        const theta = (i / 10) * Math.PI;
        const dx = Math.cos(theta) * 29;
        const dy = -124 + Math.sin(theta) * 29;

        // Gold prong
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(dx, dy + 7);
        ctx.stroke();

        // Teardrop pearl
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dx, dy + 9, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  renderHead(ctx) {
    ctx.save();
    const skin = this.profile.skin;

    // Sculpted cranial mass with multi-stop radial lighting
    const headGrad = ctx.createRadialGradient(-10, -35, 12, 0, -20, 85);
    headGrad.addColorStop(0, skin.highlight);
    headGrad.addColorStop(0.55, skin.base);
    headGrad.addColorStop(0.9, skin.shadow);
    headGrad.addColorStop(1, skin.rim || skin.shadow);

    ctx.fillStyle = headGrad;
    ctx.strokeStyle = skin.rim || skin.highlight;
    ctx.lineWidth = 1.8;

    // Anatomical Head Silhouette: Chiseled zygomatics & sculpted jaw
    ctx.beginPath();
    ctx.moveTo(-50, -78);
    // Left cranial curve to cheekbone
    ctx.quadraticCurveTo(-54, -30, -46, 22);
    // Left jawline to chin
    ctx.quadraticCurveTo(-38, 54, -20, 68);
    // Chiseled chin
    ctx.quadraticCurveTo(0, 74, 20, 68);
    // Right jawline from chin
    ctx.quadraticCurveTo(38, 54, 46, 22);
    // Right cheekbone to temple
    ctx.quadraticCurveTo(54, -30, 50, -78);
    // Cranium top
    ctx.quadraticCurveTo(0, -108, -50, -78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cheekbone (Zygomatic) Soft Warm Highlight
    const cheekGradL = ctx.createRadialGradient(-32, -6, 2, -32, -6, 20);
    cheekGradL.addColorStop(0, skin.highlight + 'aa');
    cheekGradL.addColorStop(1, 'transparent');
    ctx.fillStyle = cheekGradL;
    ctx.beginPath();
    ctx.arc(-32, -6, 20, 0, Math.PI * 2);
    ctx.fill();

    const cheekGradR = ctx.createRadialGradient(32, -6, 2, 32, -6, 20);
    cheekGradR.addColorStop(0, skin.highlight + 'aa');
    cheekGradR.addColorStop(1, 'transparent');
    ctx.fillStyle = cheekGradR;
    ctx.beginPath();
    ctx.arc(32, -6, 20, 0, Math.PI * 2);
    ctx.fill();

    // Ambient Occlusion Shadow Under Jaw & Chin
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-36, 52);
    ctx.quadraticCurveTo(0, 78, 36, 52);
    ctx.stroke();

    // Ears with Sculpted Helix, Tragus & Kundala Earrings
    [-50, 50].forEach((earX, sideIdx) => {
      ctx.save();
      const side = sideIdx === 0 ? -1 : 1;

      // Ear Base
      ctx.fillStyle = skin.base;
      ctx.beginPath();
      ctx.ellipse(earX, -2, 11, 16, side * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Inner Ear Cartilage (Concha depth shadow)
      ctx.fillStyle = skin.shadow;
      ctx.beginPath();
      ctx.ellipse(earX + side * 2, -2, 6, 9, side * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Ear Rim Highlight
      ctx.strokeStyle = skin.highlight;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(earX, -4, 9, side === -1 ? Math.PI * 0.4 : -Math.PI * 0.4, side === -1 ? Math.PI * 1.6 : Math.PI * 0.6);
      ctx.stroke();

      // Ornate Heavy Golden Makara Kundala Earring
      const earAngle = this.bones.headAngle * 0.5;
      ctx.translate(earX + side * 2, 14);
      ctx.rotate(earAngle);

      // Gold stud / hook
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      // Suspended Filigree Ring
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(0, 9, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Dangling Ruby Teardrop
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.moveTo(0, 17);
      ctx.quadraticCurveTo(-4, 25, 0, 29);
      ctx.quadraticCurveTo(4, 25, 0, 17);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    // Facial Hair
    const fh = this.profile.facialHair;
    if (fh === 'FULL_WHITE_BEARD') {
      // Flowing Ascetic Sage Beard with Layered Volume
      const beardGrad = ctx.createLinearGradient(0, 25, 0, 145);
      beardGrad.addColorStop(0, '#f8fafc');
      beardGrad.addColorStop(0.7, '#e2e8f0');
      beardGrad.addColorStop(1, '#94a3b8');

      ctx.fillStyle = beardGrad;
      ctx.beginPath();
      ctx.moveTo(-38, 25);
      ctx.quadraticCurveTo(-52, 95, -12, 145);
      ctx.quadraticCurveTo(0, 152, 12, 145);
      ctx.quadraticCurveTo(52, 95, 38, 25);
      ctx.quadraticCurveTo(0, 48, -38, 25);
      ctx.closePath();
      ctx.fill();

      // Flowing beard hair strands
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      for (let s = -24; s <= 24; s += 8) {
        ctx.beginPath();
        ctx.moveTo(s, 40);
        ctx.quadraticCurveTo(s * 0.7, 95, s * 0.3, 140);
        ctx.stroke();
      }
    } else if (fh === 'WARRIOR_MUSTACHE') {
      // Royal Kshatriya / Rajput Curved Mustache
      ctx.fillStyle = '#09090b';
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(-36, 26);
      ctx.quadraticCurveTo(-20, 14, 0, 22);
      ctx.quadraticCurveTo(20, 14, 36, 26);
      ctx.quadraticCurveTo(44, 20, 42, 14); // upturned tip right
      ctx.quadraticCurveTo(34, 18, 18, 26);
      ctx.quadraticCurveTo(0, 31, -18, 26);
      ctx.quadraticCurveTo(-34, 18, -42, 14); // upturned tip left
      ctx.quadraticCurveTo(-44, 20, -36, 26);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (fh === 'SHORT_STUBBLE') {
      // Subtle masculine stubble
      ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
      ctx.beginPath();
      ctx.arc(0, 52, 28, 0.1, Math.PI - 0.1);
      ctx.fill();
    }

    ctx.restore();
  }

  renderFacialFeatures(ctx) {
    ctx.save();
    const skin = this.profile.skin;
    const eyes = this.profile.eyes;
    const eyeScale = eyes.size || 1.0;

    // 1. Sacred Markings & Tilaks
    const m = this.profile.markings;
    if (m === 'TRIPUNDRA_CHANDAN') {
      // 3 curved sacred vibhuti ash lines
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 3.5;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-28, -55 + i * 6.5);
        ctx.quadraticCurveTo(0, -58 + i * 6.5, 28, -55 + i * 6.5);
        ctx.stroke();
      }
      // Center Sacred Kumkum Dot with Golden Sandalwood Core
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -55, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -55, 1.8, 0, Math.PI * 2);
      ctx.fill();

    } else if (m === 'CHANDAN_TILAK' || m === 'VISHNU_TILAK') {
      // Urdhva Pundra (Sacred Chandan U-Shape & Central Vermillion Line)
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(-7, -72);
      ctx.lineTo(7, -72);
      ctx.lineTo(4, -40);
      ctx.lineTo(0, -34);
      ctx.lineTo(-4, -40);
      ctx.closePath();
      ctx.fill();

      // Central Sri Churna red line
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, -70);
      ctx.lineTo(0, -36);
      ctx.stroke();

    } else if (m === 'DEVI_RED_BINDI') {
      // Royal Vermillion Bindi with Chandana Chhaya (Pearl/Chandan ring dots)
      ctx.save();
      ctx.fillStyle = '#b91c1c';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, -48, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner gold dot
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -48, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Delicate sandalwood chandan dots arching above brows
      ctx.fillStyle = '#fef9c3';
      for (let dot = -22; dot <= 22; dot += 5.5) {
        if (Math.abs(dot) < 4) continue;
        const dY = -42 - Math.cos((dot / 22) * Math.PI * 0.5) * 8;
        ctx.beginPath();
        ctx.arc(dot, dY, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

    } else if (m === 'ASURA_WAR_RUNES') {
      // Glowing Obsidian / Crimson Battle War Glyphs
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(-24, -62);
      ctx.lineTo(-12, -52);
      ctx.lineTo(-20, -42);
      ctx.moveTo(24, -62);
      ctx.lineTo(12, -52);
      ctx.lineTo(20, -42);
      ctx.stroke();
    }

    // 2. Cosmic Third Eye (Trinetra)
    if (eyes.thirdEye) {
      ctx.save();
      // Golden lotus frame
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -72);
      ctx.quadraticCurveTo(9, -56, 0, -40);
      ctx.quadraticCurveTo(-9, -56, 0, -72);
      ctx.stroke();

      // Burning cosmic ruby core
      const triGrad = ctx.createRadialGradient(0, -56, 1, 0, -56, 8);
      triGrad.addColorStop(0, '#ffffff');
      triGrad.addColorStop(0.35, '#fef08a');
      triGrad.addColorStop(0.7, '#ef4444');
      triGrad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = triGrad;
      ctx.fill();

      // Cosmic flare sparks
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -56, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Arched Sculpted Eyebrows
    ctx.fillStyle = '#09090b';
    [-1, 1].forEach(side => {
      ctx.beginPath();
      ctx.moveTo(side * 38, -32);
      ctx.quadraticCurveTo(side * 22, -40, side * 6, -31);
      ctx.quadraticCurveTo(side * 20, -35, side * 38, -29);
      ctx.closePath();
      ctx.fill();
    });

    // 4. Luminous Expressive Eyes (Parametric Blinking, Gaze & Limbal Ring Depth)
    const blink = this.bones.eyeBlink;
    const lookX = this.bones.eyeLookX * 4.5;
    const lookY = this.bones.eyeLookY * 3.5;

    [-23, 23].forEach((eyeX, idx) => {
      ctx.save();
      const side = idx === 0 ? -1 : 1;
      ctx.translate(eyeX, -16);
      ctx.scale(eyeScale, eyeScale * (1.0 - blink));

      // Sclera with subtle top ambient occlusion shadow
      const scleraGrad = ctx.createLinearGradient(0, -9, 0, 9);
      scleraGrad.addColorStop(0, '#cbd5e1');
      scleraGrad.addColorStop(0.35, '#f8fafc');
      scleraGrad.addColorStop(1, '#f1f5f9');

      ctx.fillStyle = scleraGrad;
      ctx.beginPath();
      // Classical Almond Eye Contour
      ctx.moveTo(-16, 0);
      ctx.quadraticCurveTo(0, -9.5, 16, 0);
      ctx.quadraticCurveTo(0, 9.0, -16, 0);
      ctx.closePath();
      ctx.fill();

      // Eyelid Clip for Iris & Pupil
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.quadraticCurveTo(0, -9.5, 16, 0);
      ctx.quadraticCurveTo(0, 9.0, -16, 0);
      ctx.closePath();
      ctx.clip();

      // Outer Limbal Ring (Dark intense rim gives deep lifelike eyes)
      ctx.fillStyle = '#050811';
      ctx.beginPath();
      ctx.arc(lookX, lookY, 6.8, 0, Math.PI * 2);
      ctx.fill();

      // Multi-Layered Luminous Iris Radial Gradient
      const irisGrad = ctx.createRadialGradient(lookX, lookY, 1, lookX, lookY, 6.2);
      irisGrad.addColorStop(0, '#ffffff');
      irisGrad.addColorStop(0.3, eyes.glow || eyes.iris);
      irisGrad.addColorStop(0.8, eyes.iris || '#facc15');
      irisGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.arc(lookX, lookY, 6.0, 0, Math.PI * 2);
      ctx.fill();

      // Deep Obsidian Pupil
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(lookX, lookY, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Primary Specular Keylight Glint (Top-Left)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(lookX - 1.8, lookY - 1.8, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Secondary Bounce Light Glint (Bottom-Right)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.arc(lookX + 1.6, lookY + 1.5, 0.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end clip

      // Upper Eyeliner (Winged Kohl / Kajal)
      ctx.strokeStyle = '#050811';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-17, 1);
      ctx.quadraticCurveTo(0, -10.5, 17, 0);
      // Winged tip
      ctx.lineTo(19 * side, -2.5);
      ctx.stroke();

      // Delicate Lower Waterline
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(-15, 1);
      ctx.quadraticCurveTo(0, 9.2, 15, 1);
      ctx.stroke();

      // Eyelid Upper Crease Fold
      ctx.strokeStyle = skin.shadow;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, -4, 15, Math.PI + 0.35, -0.35);
      ctx.stroke();

      ctx.restore();
    });

    // 5. Sculpted 3D Anatomical Nose
    ctx.save();
    // Nose Bridge Lateral Shading
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-3, -24);
    ctx.quadraticCurveTo(-4, 0, -6, 17);
    ctx.stroke();

    // Nose Bridge Highlight
    ctx.strokeStyle = skin.highlight;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(0, 16);
    ctx.stroke();

    // Nasal Tip Bulb (Soft Highlighted Dome)
    ctx.fillStyle = skin.highlight;
    ctx.beginPath();
    ctx.arc(0, 18, 4.2, 0, Math.PI * 2);
    ctx.fill();

    // Nostril Wings & Cavity
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.ellipse(-6, 20, 3.2, 1.8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(6, 20, 3.2, 1.8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Devi / Divine Nose Ring (Nath / Mukku Pudaka)
    if (this.profile.id === 'DEVI' || this.profile.id === 'YAKSHI') {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(9, 20, 4.5, 0, Math.PI * 2);
      ctx.stroke();
      // Tiny Pearl Drop
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(12, 24, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 6. Real-Time Expressive Lip-Sync Mouth (Cupid's Bow, Shaded Cavity & Gloss)
    ctx.save();
    ctx.translate(0, 44);
    const jaw = this.bones.jawOpen;
    const mw = this.bones.mouthWidth;

    if (jaw < 0.12) {
      // Closed Rest Lips: Sculpted Cupid's Bow & Glossy Lower Lip
      // Upper lip
      ctx.fillStyle = '#9f1239'; // rich rose
      ctx.beginPath();
      ctx.moveTo(-16 * mw, 0);
      ctx.quadraticCurveTo(-7 * mw, -4.2, 0, -2.5); // left crest
      ctx.quadraticCurveTo(7 * mw, -4.2, 16 * mw, 0); // right crest
      ctx.quadraticCurveTo(0, 1.5, -16 * mw, 0);
      ctx.closePath();
      ctx.fill();

      // Lower lip
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.moveTo(-15 * mw, 0);
      ctx.quadraticCurveTo(0, 1.2, 15 * mw, 0);
      ctx.quadraticCurveTo(0, 7.5, -15 * mw, 0);
      ctx.closePath();
      ctx.fill();

      // Lower lip specular gloss highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 3.5, 5 * mw, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle lip separation line
      ctx.strokeStyle = '#4c0519';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-16 * mw, 0);
      ctx.quadraticCurveTo(0, 1.0, 16 * mw, 0);
      ctx.stroke();

    } else {
      // Dynamic Talking Oral Cavity (with Teeth & Soft Tongue Depth)
      ctx.beginPath();
      ctx.moveTo(-17 * mw, 0);
      ctx.quadraticCurveTo(0, -8 * jaw, 17 * mw, 0);
      ctx.quadraticCurveTo(0, 18 * jaw, -17 * mw, 0);
      ctx.closePath();

      // Shaded deep oral interior
      ctx.fillStyle = '#1c0712';
      ctx.fill();
      ctx.strokeStyle = '#881337';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Upper Dental Arch (Teeth)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-9 * mw, -4 * jaw, 18 * mw, 6 * jaw, [0, 0, 3, 3]);
      ctx.fill();

      // Soft Tongue Contour
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(0, 11 * jaw, 8 * mw, 4 * jaw, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lip Borders
      ctx.strokeStyle = '#9f1239';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(-17 * mw, 0);
      ctx.quadraticCurveTo(0, -8 * jaw, 17 * mw, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-17 * mw, 0);
      ctx.quadraticCurveTo(0, 18 * jaw, 17 * mw, 0);
      ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
  }

  renderCrownAndFrontHair(ctx) {
    ctx.save();
    const hg = this.profile.headgear;
    const hairColor = this.profile.hair.color;

    // 1. Front Forehead Hair Strands
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.moveTo(-48, -75);
    ctx.quadraticCurveTo(-25, -60, 0, -74);
    ctx.quadraticCurveTo(25, -60, 48, -75);
    ctx.quadraticCurveTo(0, -95, -48, -75);
    ctx.fill();

    // 2. Specialized Iconic Headgear Archetypes
    if (hg === 'CRESCENT_MOON_SERPENT') {
      // Rudra's Matted Jata Bun, Crescent Chandra & Coiled Naga
      // Jata Bun
      const jataGrad = ctx.createRadialGradient(-10, -105, 5, 0, -100, 42);
      jataGrad.addColorStop(0, '#334155');
      jataGrad.addColorStop(0.5, hairColor);
      jataGrad.addColorStop(1, '#020617');
      ctx.fillStyle = jataGrad;
      ctx.beginPath();
      ctx.arc(0, -100, 42, 0, Math.PI * 2);
      ctx.fill();

      // Woven golden jata cords
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.0;
      for (let j = -20; j <= 20; j += 10) {
        ctx.beginPath();
        ctx.arc(j, -100, 36, 0.4, Math.PI - 0.4);
        ctx.stroke();
      }

      // Glowing Silver Crescent Moon (Chandra)
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(32, -104, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.arc(26, -104, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Coiled Kundalini Serpent Crowning Jata
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, -135, 14, 0.2, Math.PI * 2 - 0.2);
      ctx.stroke();
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(14, -137, 5, 0, Math.PI * 2);
      ctx.fill();

    } else if (hg === 'SPIKED_HORNED_CROWN') {
      // Ravana / Asura Obsidian Spiked Horns with Fiery Magma Veins
      [-1, 1].forEach(side => {
        ctx.save();
        // Obsidian Horn Base
        const hornGrad = ctx.createLinearGradient(0, -75, side * 85, -185);
        hornGrad.addColorStop(0, '#27272a');
        hornGrad.addColorStop(0.5, '#18181b');
        hornGrad.addColorStop(1, '#09090b');

        ctx.fillStyle = hornGrad;
        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(side * 42, -75);
        ctx.quadraticCurveTo(side * 95, -130, side * 82, -185);
        ctx.quadraticCurveTo(side * 68, -125, side * 30, -85);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Fiery Magma Fissure Veins
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(side * 36, -80);
        ctx.lineTo(side * 52, -110);
        ctx.lineTo(side * 64, -145);
        ctx.lineTo(side * 78, -180);
        ctx.stroke();

        ctx.restore();
      });

      // Central Skull / War Crest
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.moveTo(0, -105);
      ctx.lineTo(12, -85);
      ctx.lineTo(0, -75);
      ctx.lineTo(-12, -85);
      ctx.closePath();
      ctx.fill();

    } else if (hg === 'GOLDEN_LOTUS_TIARA' || hg === 'SILVER_GOLD_WAR_MUKUT' || hg === 'VAJRA_DIAMOND_CROWN' || hg === 'SUN_SURYA_MUKUT') {
      // Ornate Multi-Tiered Vedic Golden Mukut (Repoussé Filigree & Faceted Jewels)
      ctx.save();

      // Tier 1: Gold Crown Base Band
      const baseGrad = ctx.createLinearGradient(-55, -78, 55, -78);
      baseGrad.addColorStop(0, '#d97706');
      baseGrad.addColorStop(0.5, '#fef08a');
      baseGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = baseGrad;
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.0;

      ctx.beginPath();
      ctx.moveTo(-52, -76);
      ctx.lineTo(52, -76);
      ctx.lineTo(56, -90);
      ctx.lineTo(-56, -90);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tier 2: Architectural Tiered Peaks (5 Lotus Spires)
      const mukutGrad = ctx.createLinearGradient(0, -90, 0, -185);
      mukutGrad.addColorStop(0, '#facc15');
      mukutGrad.addColorStop(0.5, '#fef08a');
      mukutGrad.addColorStop(1, '#b45309');

      ctx.fillStyle = mukutGrad;
      ctx.beginPath();
      ctx.moveTo(-54, -90);
      ctx.lineTo(-38, -135);
      ctx.lineTo(-24, -120);
      ctx.lineTo(0, -182); // tall center peak
      ctx.lineTo(24, -120);
      ctx.lineTo(38, -135);
      ctx.lineTo(54, -90);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Embossed Filigree Inlay Lines
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, -180);
      ctx.lineTo(0, -90);
      ctx.moveTo(-24, -120);
      ctx.lineTo(0, -145);
      ctx.lineTo(24, -120);
      ctx.stroke();

      // Large Faceted Glowing Ruby/Emerald Gemstone in Center Peak
      const crownGemColor = hg === 'VAJRA_DIAMOND_CROWN' ? '#38bdf8' : (hg === 'SUN_SURYA_MUKUT' ? '#f59e0b' : '#dc2626');
      const gemGrad = ctx.createRadialGradient(-2, -126, 1, 0, -124, 11);
      gemGrad.addColorStop(0, '#ffffff');
      gemGrad.addColorStop(0.35, crownGemColor);
      gemGrad.addColorStop(1, '#450a0a');

      ctx.fillStyle = gemGrad;
      ctx.beginPath();
      ctx.arc(0, -124, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Dangling Pearl Fringe along Mukut Rim
      ctx.fillStyle = '#ffffff';
      for (let p = -48; p <= 48; p += 12) {
        ctx.beginPath();
        ctx.arc(p, -72, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

    } else if (hg === 'RUDRAKSHA_BEAD_BAND') {
      // Ascetic Sage Rudraksha Mala Band
      ctx.save();
      for (let x = -44; x <= 44; x += 11) {
        // Gold capping
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(x, -76, 6, 0, Math.PI * 2);
        ctx.fill();

        // Rudraksha bead
        const beadGrad = ctx.createRadialGradient(x - 1, -77, 1, x, -76, 5);
        beadGrad.addColorStop(0, '#b45309');
        beadGrad.addColorStop(0.7, '#78350f');
        beadGrad.addColorStop(1, '#291104');
        ctx.fillStyle = beadGrad;
        ctx.beginPath();
        ctx.arc(x, -76, 4.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

    } else if (hg === 'JASMINE_FLOWER_TIARA') {
      // Yakshi's Fresh Jasmine Garland Tiara
      ctx.save();
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.arc(0, -76, 48, 0.4, Math.PI - 0.4);
      ctx.stroke();

      for (let fl = -40; fl <= 40; fl += 10) {
        // 5 white jasmine petals
        ctx.fillStyle = '#ffffff';
        for (let pet = 0; pet < 5; pet++) {
          const pa = (pet / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(fl + Math.cos(pa) * 4, -76 + Math.sin(pa) * 4, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        // Gold pollen center
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(fl, -76, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  renderArms(ctx) {
    ctx.save();
    const skin = this.profile.skin;
    const t = this.profile.torso;

    // Left Arm (Back / Lead)
    this.renderSingleArm(ctx, -75, -100, this.bones.leftArmAngle, this.bones.leftForearmAngle, skin, t.trim, -1);

    // Right Arm (Front / Gesture)
    this.renderSingleArm(ctx, 75, -100, this.bones.rightArmAngle, this.bones.rightForearmAngle, skin, t.trim, 1);

    ctx.restore();
  }

  renderSingleArm(ctx, shoulderX, shoulderY, armAngle, forearmAngle, skin, trim, side) {
    ctx.save();
    ctx.translate(shoulderX, shoulderY);

    // 1. Ornate Shoulder Pauldron (Kandhadhara / Armor Cop)
    const pauldronGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
    pauldronGrad.addColorStop(0, '#ffffff');
    pauldronGrad.addColorStop(0.35, trim);
    pauldronGrad.addColorStop(1, '#92400e');

    ctx.fillStyle = pauldronGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Embossed concentric ring
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Upper Bicep
    ctx.rotate(armAngle);

    const bicepGrad = ctx.createLinearGradient(-13, 0, 13, 75);
    bicepGrad.addColorStop(0, skin.highlight);
    bicepGrad.addColorStop(0.5, skin.base);
    bicepGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = bicepGrad;
    ctx.strokeStyle = skin.rim || skin.highlight;
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.moveTo(-13, 0);
    ctx.quadraticCurveTo(-16, 38, -11, 75);
    ctx.lineTo(11, 75);
    ctx.quadraticCurveTo(16, 38, 13, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Golden Armlet (Bajubandh / Vanki) around Bicep
    ctx.save();
    ctx.translate(0, 32);
    ctx.fillStyle = trim;
    ctx.fillRect(-14, -4, 28, 8);
    // Center gem on armlet
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Elbow, Forearm & Wrist Bracer (Kada)
    ctx.translate(0, 75);
    ctx.rotate(forearmAngle);

    // Ornate Golden Kada / Wrist Bracer
    const kadaGrad = ctx.createLinearGradient(-14, 0, 14, 20);
    kadaGrad.addColorStop(0, '#fef08a');
    kadaGrad.addColorStop(0.5, trim);
    kadaGrad.addColorStop(1, '#b45309');

    ctx.fillStyle = kadaGrad;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-14, 0, 28, 18, 3);
    ctx.fill();
    ctx.stroke();

    // Forearm with muscle contour
    ctx.fillStyle = bicepGrad;
    ctx.strokeStyle = skin.rim || skin.highlight;
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.moveTo(-11, 18);
    ctx.quadraticCurveTo(-13, 48, -9, 78);
    ctx.lineTo(9, 78);
    ctx.quadraticCurveTo(13, 48, 11, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. Expressive Sculpted Hand with Classical Mudra
    ctx.translate(0, 78);

    // Palm base
    ctx.fillStyle = skin.highlight;
    ctx.beginPath();
    ctx.ellipse(0, 6, 11, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sacred Red Alta / Henna Dye on Palm Center
    const isDivine = this.profile.id === 'DEVI' || this.profile.id === 'YAKSHI' || this.profile.id === 'RUDRA';
    if (isDivine) {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, 6, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Natural Thumb
    ctx.save();
    ctx.translate(side === 1 ? -9 : 9, 3);
    ctx.rotate(side === 1 ? -0.45 : 0.45);
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.roundRect(-3.5, 0, 7, 14, 3.5);
    ctx.fill();
    if (isDivine) {
      // Red Alta on thumb tip
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, 11, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4 Tapered Graceful Fingers (held in classical Mudra posture)
    const fingerOffsets = [-7, -2.5, 2.5, 7];
    const fingerLengths = [15, 18, 17, 14];

    fingerOffsets.forEach((fx, fIdx) => {
      const fl = fingerLengths[fIdx];
      ctx.save();
      ctx.translate(fx, 11);
      ctx.rotate((fx / 12) * 0.15); // gentle fan

      ctx.fillStyle = skin.base;
      ctx.beginPath();
      ctx.roundRect(-2.8, 0, 5.6, fl, 2.8);
      ctx.fill();

      // Red Alta on fingertip
      if (isDivine) {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(0, fl - 2, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.restore();
  }
}

// Global window registration for browser and module environments
if (typeof window !== 'undefined') {
  window.CharacterRig = CharacterRig;
  window.CHARACTER_PROFILES = CHARACTER_PROFILES;
}
if (typeof global !== 'undefined') {
  global.CharacterRig = CharacterRig;
  global.CHARACTER_PROFILES = CHARACTER_PROFILES;
}
