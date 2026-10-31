/**
 * VISUAL STORY GENERATOR - MANO LAB
 * character-rig.js - Parametric 2.5D Rigged Character Engine with Articulated Limbs & Locomotion
 * 
 * Features:
 * - Neutral & Modern Everyday Archetypes (Creator, Professional, Casual, Student, Artist, Host) + Mythic/Fantasy Presets
 * - Full Customization: Outfits (Hoodie, Blazer, T-Shirt, Sweater, Shirt, Jacket), Hair, Skin, Eyes, Accessories
 * - Articulated Limbs: Thighs, Knees, Shins, Modern Sneakers/Shoes, Biceps, Forearms, Expressive Hands
 * - Walking Locomotion: Natural forward/backward leg cycle, hip sway, and foot planting across stage coordinates
 * - Expressive Head, Jaw & Phoneme Lip-Sync (A, O, E, REST, FIERCE)
 * - Modern Accessories: Stylish Glasses, Studio Headphones, Smartwatches
 */

// Universal Archetype Profiles
const CHARACTER_PROFILES = {
  // --- Modern & Neutral Everyday Archetypes (Default) ---
  ALEX: {
    id: 'ALEX',
    name: 'Alex: Creator',
    role: 'Tech Creator & Storyteller',
    emoji: '🎙️',
    gender: 'M',
    skin: { base: '#d4a373', highlight: '#faedcd', shadow: '#996633', rim: '#ffffff' },
    eyes: { size: 1.05, shape: 'ROUND_EXPRESSIVE', iris: '#3e2723', glow: '#451a03', thirdEye: false },
    hair: { color: '#18181b', style: 'MODERN_FADE', sway: 0.5 },
    facialHair: 'SHORT_STUBBLE',
    headgear: 'NONE',
    accessories: 'STUDIO_HEADPHONES',
    torso: { type: 'CASUAL_HOODIE', main: '#1e293b', highlight: '#334155', shadow: '#0f172a', trim: '#38bdf8' },
    legs: { type: 'SLIM_JEANS', color: '#1e293b', trim: '#f8fafc' },
    cape: { enabled: false, color: '#000000', trim: '#000000' },
    ornaments: { necklace: 'NONE', earrings: 'NONE', wrists: 'SMART_WATCH' },
    markings: 'NONE',
    aura: false
  },

  MAYA: {
    id: 'MAYA',
    name: 'Maya: Product Lead',
    role: 'Strategist & Product Lead',
    emoji: '💼',
    gender: 'F',
    skin: { base: '#b46e45', highlight: '#d98e64', shadow: '#784325', rim: '#fed7aa' },
    eyes: { size: 1.15, shape: 'ALMOND_DIVINE', iris: '#1e3a8a', glow: '#3b82f6', thirdEye: false },
    hair: { color: '#09090b', style: 'SLEEK_BOB', sway: 0.7 },
    facialHair: 'NONE',
    headgear: 'NONE',
    accessories: 'STYLISH_GLASSES',
    torso: { type: 'SMART_BLAZER', main: '#0f172a', highlight: '#1e293b', shadow: '#020617', trim: '#f43f5e' },
    legs: { type: 'CHINO_TROUSERS', color: '#334155', trim: '#e2e8f0' },
    cape: { enabled: false, color: '#000000', trim: '#000000' },
    ornaments: { necklace: 'SILVER_PENDANT', earrings: 'PEARL_STUDS', wrists: 'NONE' },
    markings: 'NONE',
    aura: false
  },

  SAM: {
    id: 'SAM',
    name: 'Sam: Everyday',
    role: 'Friendly Neighbor & Host',
    emoji: '☕',
    gender: 'M',
    skin: { base: '#e6a66b', highlight: '#fed7aa', shadow: '#9a5c2d', rim: '#ffedd5' },
    eyes: { size: 1.05, shape: 'WIDE_INNOCENT', iris: '#78350f', glow: '#d97706', thirdEye: false },
    hair: { color: '#451a03', style: 'TEXTURED_CROP', sway: 0.5 },
    facialHair: 'NONE',
    headgear: 'NONE',
    accessories: 'NONE',
    torso: { type: 'COTTON_TSHIRT', main: '#0284c7', highlight: '#38bdf8', shadow: '#0369a1', trim: '#ffffff' },
    legs: { type: 'SLIM_JEANS', color: '#1e3a8a', trim: '#f8fafc' },
    cape: { enabled: false, color: '#000000', trim: '#000000' },
    ornaments: { necklace: 'NONE', earrings: 'NONE', wrists: 'NONE' },
    markings: 'NONE',
    aura: false
  },

  PRIYA: {
    id: 'PRIYA',
    name: 'Priya: Designer',
    role: 'Creative Designer & Storyteller',
    emoji: '🎨',
    gender: 'F',
    skin: { base: '#c08552', highlight: '#ddb892', shadow: '#7f5539', rim: '#ede0d4' },
    eyes: { size: 1.2, shape: 'ALMOND_DIVINE', iris: '#15803d', glow: '#22c55e', thirdEye: false },
    hair: { color: '#171717', style: 'LONG_WAVES', sway: 1.1 },
    facialHair: 'NONE',
    headgear: 'NONE',
    accessories: 'NONE',
    torso: { type: 'COZY_SWEATER', main: '#d97706', highlight: '#f59e0b', shadow: '#b45309', trim: '#fef3c7' },
    legs: { type: 'CASUAL_SKIRT', color: '#1e293b', trim: '#f1f5f9' },
    cape: { enabled: false, color: '#000000', trim: '#000000' },
    ornaments: { necklace: 'SILVER_PENDANT', earrings: 'GOLD_HOOPS', wrists: 'NONE' },
    markings: 'NONE',
    aura: false
  },

  DAVID: {
    id: 'DAVID',
    name: 'David: Speaker',
    role: 'Analyst & Keynote Speaker',
    emoji: '📊',
    gender: 'M',
    skin: { base: '#7c533e', highlight: '#a27054', shadow: '#4d2d1f', rim: '#d6a284' },
    eyes: { size: 1.0, shape: 'SERENE_MEDITATIVE', iris: '#1f2937', glow: '#374151', thirdEye: false },
    hair: { color: '#0a0a0a', style: 'SIDE_PART', sway: 0.4 },
    facialHair: 'SHORT_STUBBLE',
    headgear: 'NONE',
    accessories: 'STYLISH_GLASSES',
    torso: { type: 'CLASSIC_SHIRT', main: '#f8fafc', highlight: '#ffffff', shadow: '#cbd5e1', trim: '#0284c7' },
    legs: { type: 'CHINO_TROUSERS', color: '#18181b', trim: '#3f3f46' },
    cape: { enabled: false, color: '#000000', trim: '#000000' },
    ornaments: { necklace: 'NONE', earrings: 'NONE', wrists: 'SMART_WATCH' },
    markings: 'NONE',
    aura: false
  },

  ELENA: {
    id: 'ELENA',
    name: 'Elena: Explorer',
    role: 'Traveler & Documentarian',
    emoji: '🧭',
    gender: 'F',
    skin: { base: '#e0a96d', highlight: '#eed7a1', shadow: '#9c6f44', rim: '#fff1d0' },
    eyes: { size: 1.15, shape: 'ROUND_EXPRESSIVE', iris: '#0891b2', glow: '#22d3ee', thirdEye: false },
    hair: { color: '#7c2d12', style: 'PONYTAIL', sway: 1.2 },
    facialHair: 'NONE',
    headgear: 'NONE',
    accessories: 'NONE',
    torso: { type: 'JACKET', main: '#059669', highlight: '#10b981', shadow: '#047857', trim: '#fef08a' },
    legs: { type: 'SLIM_JEANS', color: '#1e293b', trim: '#f8fafc' },
    cape: { enabled: false, color: '#000000', trim: '#000000' },
    ornaments: { necklace: 'NONE', earrings: 'NONE', wrists: 'SMART_WATCH' },
    markings: 'NONE',
    aura: false
  },

  ROHAN: {
    id: 'ROHAN',
    name: 'Rohan: Student',
    role: 'Curious Learner & Coder',
    emoji: '💻',
    gender: 'M',
    skin: { base: '#b46e45', highlight: '#d98e64', shadow: '#784325', rim: '#fed7aa' },
    eyes: { size: 1.1, shape: 'WIDE_INNOCENT', iris: '#3e2723', glow: '#78350f', thirdEye: false },
    hair: { color: '#18181b', style: 'TEXTURED_CROP', sway: 0.7 },
    facialHair: 'NONE',
    headgear: 'NONE',
    accessories: 'STYLISH_GLASSES',
    torso: { type: 'CASUAL_HOODIE', main: '#4f46e5', highlight: '#6366f1', shadow: '#3730a3', trim: '#f8fafc' },
    legs: { type: 'SLIM_JEANS', color: '#111827', trim: '#ffffff' },
    cape: { enabled: false, color: '#000000', trim: '#000000' },
    ornaments: { necklace: 'NONE', earrings: 'NONE', wrists: 'NONE' },
    markings: 'NONE',
    aura: false
  },

  ZOE: {
    id: 'ZOE',
    name: 'Zoe: Podcaster',
    role: 'Show Host & Cultural Critic',
    emoji: '🎧',
    gender: 'F',
    skin: { base: '#5c3d2e', highlight: '#855842', shadow: '#3a241b', rim: '#b5856b' },
    eyes: { size: 1.25, shape: 'ALMOND_DIVINE', iris: '#d97706', glow: '#fbbf24', thirdEye: false },
    hair: { color: '#0a0a0a', style: 'CURLY_VOLUME', sway: 1.0 },
    facialHair: 'NONE',
    headgear: 'NONE',
    accessories: 'STUDIO_HEADPHONES',
    torso: { type: 'COZY_SWEATER', main: '#e11d48', highlight: '#f43f5e', shadow: '#be123c', trim: '#fef08a' },
    legs: { type: 'CHINO_TROUSERS', color: '#18181b', trim: '#ffffff' },
    cape: { enabled: false, color: '#000000', trim: '#000000' },
    ornaments: { necklace: 'SILVER_PENDANT', earrings: 'GOLD_HOOPS', wrists: 'NONE' },
    markings: 'NONE',
    aura: false
  },

  // --- Historical & Mythological Presets (Preserved for full variety) ---
  RUDRA: {
    id: 'RUDRA',
    name: 'Rudra: Yogi',
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
    markings: 'TRIPUNDRA_CHANDAN',
    aura: true
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
    ornaments: { necklace: 'RUDRAKSHA_MALA', earrings: 'NONE', wrists: 'KUSHA_GRASS' },
    markings: 'CHANDAN_TILAK',
    aura: true
  },

  DEVI: {
    id: 'DEVI',
    name: 'Devi Mahamaya',
    role: 'Divine Protector',
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
    markings: 'DEVI_RED_BINDI',
    aura: true
  },

  SHESHANAGA: {
    id: 'SHESHANAGA',
    name: 'Sheshanaga',
    role: 'The Cosmic Horizon',
    emoji: '🌌',
    skin: { base: '#253d6e', highlight: '#60a5fa', shadow: '#172554', rim: '#bfdbfe' },
    eyes: { size: 1.2, shape: 'SERENE_MEDITATIVE', iris: '#38bdf8', glow: '#93c5fd', thirdEye: false },
    hair: { color: '#0f172a', style: 'CELESTIAL_WAVES', sway: 1.0 },
    facialHair: 'NONE',
    headgear: 'COSMIC_THOUSAND_HOODS',
    torso: { type: 'CELESTIAL_SILK_VEST', main: '#1e40af', highlight: '#3b82f6', shadow: '#1e3a8a', trim: '#facc15' },
    legs: { type: 'OCEAN_BLUE_DHOTI', color: '#1d4ed8', trim: '#fef08a' },
    cape: { enabled: true, color: '#172554', trim: '#60a5fa' },
    ornaments: { necklace: 'COSMIC_STAR_MALAS', earrings: 'NONE', wrists: 'GOLD_BANDS' },
    markings: 'VISHNU_TILAK',
    aura: true
  },

  VASUKI: {
    id: 'VASUKI',
    name: 'Vasuki: Serpent King',
    role: 'Monarch of Patala',
    emoji: '🐍',
    skin: { base: '#1b4d4f', highlight: '#2dd4bf', shadow: '#0f292a', rim: '#5eead4' },
    eyes: { size: 1.1, shape: 'BURNING_ASURA', iris: '#10b981', glow: '#34d399', thirdEye: false },
    hair: { color: '#042f2e', style: 'SERPENT_HOOD_CROWN', sway: 1.1 },
    facialHair: 'NONE',
    headgear: 'SEVEN_HOODED_NAGA',
    torso: { type: 'SCALE_GOLD_ARMOR', main: '#115e59', highlight: '#14b8a6', shadow: '#042f2e', trim: '#facc15' },
    legs: { type: 'SERPENT_SCALE_DHOTI', color: '#0f766e', trim: '#facc15' },
    cape: { enabled: true, color: '#042f2e', trim: '#2dd4bf' },
    ornaments: { necklace: 'EMERALD_SERPENT_TORC', earrings: 'NONE', wrists: 'SERPENT_COILS' },
    markings: 'NAGA_SCALES',
    aura: true
  }
};

class CharacterRig {
  constructor(profileKey = 'ALEX') {
    this.profile = JSON.parse(JSON.stringify(CHARACTER_PROFILES[profileKey] || CHARACTER_PROFILES.ALEX));

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
      leftArmAngle: 0.15,
      rightArmAngle: -0.15,
      leftForearmAngle: 0.25,
      rightForearmAngle: -0.25,
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

  setArchetype(profileKey) {
    this.setProfile(profileKey);
  }

  setCustomParam(category, key, value) {
    if (this.profile[category] && this.profile[category][key] !== undefined) {
      this.profile[category][key] = value;
    } else if (this.profile[key] !== undefined) {
      this.profile[key] = value;
    }
  }

  setName(name) {
    this.profile.name = name;
  }

  setOutfit(type, mainColor, accentColor) {
    if (!this.profile.torso) this.profile.torso = {};
    if (type) this.profile.torso.type = type;
    if (mainColor) {
      this.profile.torso.main = mainColor;
      this.profile.torso.highlight = mainColor;
    }
    if (accentColor) this.profile.torso.trim = accentColor;
  }

  setHair(style, color) {
    if (!this.profile.hair) this.profile.hair = {};
    if (style) this.profile.hair.style = style;
    if (color) this.profile.hair.color = color;
  }

  setSkinTone(base, highlight, shadow) {
    this.profile.skin = { base, highlight: highlight || base, shadow: shadow || base, rim: '#ffffff' };
  }

  setEyes(irisColor, size) {
    if (!this.profile.eyes) this.profile.eyes = {};
    if (irisColor) {
      this.profile.eyes.iris = irisColor;
      this.profile.eyes.glow = irisColor;
    }
    if (size) this.profile.eyes.size = size;
  }

  setAccessory(acc) {
    this.profile.accessories = acc;
  }

  randomizeNewCharacter() {
    const names = ['Alex', 'Maya', 'Jordan', 'Sam', 'Taylor', 'Chris', 'Elena', 'David', 'Priya', 'Leo', 'Zoe', 'Morgan'];
    const roles = ['Creator', 'Host', 'Thinker', 'Designer', 'Student', 'Writer', 'Analyst', 'Traveler'];
    const skinTones = [
      { base: '#f7d7c4', highlight: '#fff0e5', shadow: '#e0b89f', rim: '#ffffff' }, // Fair
      { base: '#d4a373', highlight: '#faedcd', shadow: '#996633', rim: '#ffffff' }, // Warm wheatish
      { base: '#e6a66b', highlight: '#fed7aa', shadow: '#9a5c2d', rim: '#ffedd5' }, // Honey tan
      { base: '#b46e45', highlight: '#d98e64', shadow: '#784325', rim: '#fed7aa' }, // Golden bronze
      { base: '#7c533e', highlight: '#a27054', shadow: '#4d2d1f', rim: '#d6a284' }, // Rich brown
      { base: '#4a2c1d', highlight: '#70422c', shadow: '#2d180e', rim: '#9c6644' }  // Deep espresso
    ];
    const hairStyles = ['MODERN_FADE', 'SLEEK_BOB', 'TEXTURED_CROP', 'LONG_WAVES', 'SIDE_PART', 'PONYTAIL', 'CURLY_VOLUME'];
    const hairColors = ['#18181b', '#09090b', '#451a03', '#7c2d12', '#d97706', '#94a3b8'];
    const eyeColors = ['#3e2723', '#1e3a8a', '#15803d', '#78350f', '#0891b2', '#0f172a'];
    const outfits = ['CASUAL_HOODIE', 'SMART_BLAZER', 'COTTON_TSHIRT', 'COZY_SWEATER', 'CLASSIC_SHIRT', 'JACKET'];
    const outfitColors = ['#1e293b', '#0f172a', '#0284c7', '#d97706', '#4f46e5', '#059669', '#e11d48', '#334155'];
    const accessories = ['NONE', 'STYLISH_GLASSES', 'STUDIO_HEADPHONES'];

    const chosenName = names[Math.floor(Math.random() * names.length)];
    const chosenRole = roles[Math.floor(Math.random() * roles.length)];
    const chosenSkin = skinTones[Math.floor(Math.random() * skinTones.length)];
    const chosenHair = hairStyles[Math.floor(Math.random() * hairStyles.length)];
    const chosenHairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
    const chosenEyeColor = eyeColors[Math.floor(Math.random() * eyeColors.length)];
    const chosenOutfit = outfits[Math.floor(Math.random() * outfits.length)];
    const chosenOutfitColor = outfitColors[Math.floor(Math.random() * outfitColors.length)];
    const chosenAccessory = accessories[Math.floor(Math.random() * accessories.length)];

    this.profile = {
      id: 'CUSTOM_' + Date.now(),
      name: `${chosenName}: ${chosenRole}`,
      role: chosenRole,
      emoji: '👤',
      skin: chosenSkin,
      eyes: {
        size: 0.95 + Math.random() * 0.3,
        shape: 'ROUND_EXPRESSIVE',
        iris: chosenEyeColor,
        glow: chosenEyeColor,
        thirdEye: false
      },
      hair: {
        color: chosenHairColor,
        style: chosenHair,
        sway: 0.7
      },
      facialHair: Math.random() > 0.6 ? 'SHORT_STUBBLE' : 'NONE',
      headgear: 'NONE',
      accessories: chosenAccessory,
      torso: {
        type: chosenOutfit,
        main: chosenOutfitColor,
        highlight: chosenOutfitColor,
        shadow: '#0f172a',
        trim: '#f8fafc'
      },
      legs: {
        type: Math.random() > 0.4 ? 'SLIM_JEANS' : 'CHINO_TROUSERS',
        color: '#1e293b',
        trim: '#ffffff'
      },
      cape: { enabled: false, color: '#000000', trim: '#000000' },
      ornaments: { necklace: 'NONE', earrings: 'NONE', wrists: Math.random() > 0.5 ? 'SMART_WATCH' : 'NONE' },
      markings: 'NONE',
      aura: false
    };

    return this.profile;
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

    // Layer 0: Divine Prabhavali (Sacred Radiance & Aura) - only if enabled
    this.renderPrabhavali(ctx);

    // Layer 1: Back Cape & Hair
    if (this.profile.cape && this.profile.cape.enabled) {
      this.renderCape(ctx);
    }
    this.renderBackHair(ctx);

    // Layer 2: Articulated Legs & Walking Sandal/Sneakers
    this.renderLegs(ctx);

    // Layer 3: Torso Cuirass / Modern Clothing & Shoulders
    this.renderTorso(ctx);

    // Layer 4: Neck & Collar / Ornaments
    this.renderNeck(ctx);

    // Layer 5: Head, Facial Structure, Eyes, Glasses, Nose & Lip-Sync Mouth
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
    if (!this.profile.aura) return; // Modern neutral characters do NOT have halos!

    ctx.save();
    ctx.translate(this.bones.headOffsetX * 0.5, -150);
    const pulse = 1.0 + Math.sin(this.time * 2.2) * 0.04;
    const auraRadius = 115 * pulse;
    const auraColor = this.profile.eyes?.glow || this.profile.torso?.trim || '#facc15';

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

    ctx.restore();
  }

  /* ------------------- ARTICULATED LIMB RENDERING ------------------- */

  renderLegs(ctx) {
    ctx.save();
    const legType = this.profile.legs?.type || 'SLIM_JEANS';
    const mainColor = this.profile.legs?.color || '#1e293b';
    const trimColor = this.profile.legs?.trim || '#f8fafc';

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

    const isModernPants = type === 'SLIM_JEANS' || type === 'CHINO_TROUSERS' || type === 'CASUAL_SKIRT';

    if (isModernPants) {
      // Modern Trousers / Jeans
      const pantGrad = ctx.createLinearGradient(-16, 0, 16, 90);
      pantGrad.addColorStop(0, color);
      pantGrad.addColorStop(0.6, color);
      pantGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = pantGrad;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 1.5;

      // Thigh
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.quadraticCurveTo(-18, 45, -13, 86);
      ctx.lineTo(13, 86);
      ctx.quadraticCurveTo(18, 45, 16, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Subtle Denim Side Seam
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(12, 10);
      ctx.lineTo(10, 80);
      ctx.stroke();

      // Knee joint
      ctx.translate(0, 86);
      ctx.rotate(kneeAngle);

      // Shin / Lower Leg
      ctx.fillStyle = pantGrad;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(-13, 0);
      ctx.quadraticCurveTo(-15, 45, -11, 85);
      ctx.lineTo(11, 85);
      ctx.quadraticCurveTo(15, 45, 13, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ankle & Modern Clean Sneakers
      ctx.translate(0, 85);

      // Sneaker Silhouette - Chunky Streetwear Cupsole
      // White rubber midsole with tread notches
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-13, 13, 40, 7, 3);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Bottom tread texture
      ctx.fillStyle = '#94a3b8';
      for (let tx = -9; tx <= 22; tx += 6) {
        ctx.fillRect(tx, 18, 3, 2);
      }

      // Sneaker Upper (Accent color or crisp white/leather)
      ctx.fillStyle = trim === '#f8fafc' || trim === '#ffffff' ? '#f1f5f9' : trim;
      ctx.beginPath();
      ctx.moveTo(-12, 1);
      ctx.lineTo(13, 1);
      ctx.quadraticCurveTo(24, 5, 26, 13);
      ctx.lineTo(-12, 13);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Toe Cap Bumper
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(16, 8);
      ctx.quadraticCurveTo(25, 9, 26, 13);
      ctx.lineTo(16, 13);
      ctx.closePath();
      ctx.fill();

      // Padded Tongue & Eyelet Rows
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, 0, 11, 4);

      // Crisscross Laces
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-2, 4); ctx.lineTo(8, 7);
      ctx.moveTo(8, 4); ctx.lineTo(-2, 7);
      ctx.moveTo(-2, 8); ctx.lineTo(8, 11);
      ctx.moveTo(8, 8); ctx.lineTo(-2, 11);
      ctx.stroke();

      // Rear Heel Pull Tab
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-13, 3, 2.5, 6);

    } else {
      // Traditional Pleated Dhoti / Greaves
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

      // Knee joint
      ctx.translate(0, 88);
      ctx.rotate(kneeAngle);

      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = trim;
      ctx.fill();

      // Shin
      ctx.fillStyle = thighGrad;
      ctx.beginPath();
      ctx.moveTo(-13, 0);
      ctx.quadraticCurveTo(-16, 45, -10, 85);
      ctx.lineTo(10, 85);
      ctx.quadraticCurveTo(16, 45, 13, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sandal
      ctx.translate(0, 85);
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.roundRect(-12, 14, 38, 5, 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderCape(ctx) {
    if (!this.profile.cape || !this.profile.cape.enabled) return;

    ctx.save();
    const sway = this.bones.capeSway;
    const capeColor = this.profile.cape.color;
    const trimColor = this.profile.cape.trim || '#facc15';

    const capeGrad = ctx.createLinearGradient(0, -110, sway * 0.8, 330);
    capeGrad.addColorStop(0, '#0a0a0f');
    capeGrad.addColorStop(0.35, capeColor);
    capeGrad.addColorStop(0.85, capeColor);
    capeGrad.addColorStop(1, '#05070d');

    ctx.fillStyle = capeGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 22;

    ctx.beginPath();
    ctx.moveTo(-105, -110);
    ctx.quadraticCurveTo(-135 + sway * 0.7, 110, -165 + sway * 1.4, 335);
    ctx.quadraticCurveTo(-70 + sway * 0.9, 320, 0 + sway * 0.5, 338);
    ctx.quadraticCurveTo(70 + sway * 0.9, 320, 165 + sway * 1.4, 335);
    ctx.quadraticCurveTo(135 + sway * 0.7, 110, 105, -110);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = trimColor;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.restore();
  }

  renderBackHair(ctx) {
    const hairStyle = this.profile.hair?.style || 'MODERN_FADE';
    // Short modern hairstyles don't drape long strands down the back
    if (hairStyle === 'MODERN_FADE' || hairStyle === 'SHORT_CROP' || hairStyle === 'TEXTURED_CROP' || hairStyle === 'SIDE_PART') {
      return;
    }

    ctx.save();
    const sway = this.bones.hairSway;
    const hairColor = this.profile.hair?.color || '#18181b';

    const hairGrad = ctx.createLinearGradient(0, -160, 0, 120);
    hairGrad.addColorStop(0, '#020306');
    hairGrad.addColorStop(0.6, hairColor);
    hairGrad.addColorStop(1, '#090d16');

    ctx.fillStyle = hairGrad;

    // Natural flowing hair layers for long hair styles
    ctx.beginPath();
    ctx.moveTo(-55, -150);
    ctx.quadraticCurveTo(-95 + sway * 0.8, -30, -80 + sway * 1.2, 80);
    ctx.quadraticCurveTo(-55 + sway * 0.5, 45, -35, -110);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(55, -150);
    ctx.quadraticCurveTo(95 + sway * 0.8, -30, 80 + sway * 1.2, 80);
    ctx.quadraticCurveTo(55 + sway * 0.5, 45, 35, -110);
    ctx.fill();

    ctx.restore();
  }

  renderTorso(ctx) {
    ctx.save();
    ctx.rotate(this.bones.chestAngle);

    const t = this.profile.torso || {};
    const outfitType = t.type || 'CASUAL_HOODIE';
    const mainColor = t.main || '#1e293b';
    const trimColor = t.trim || '#38bdf8';

    if (outfitType === 'CASUAL_HOODIE') {
      // 1. Modern Casual Hoodie
      const hoodieGrad = ctx.createLinearGradient(-75, -115, 75, 120);
      hoodieGrad.addColorStop(0, t.highlight || '#334155');
      hoodieGrad.addColorStop(0.5, mainColor);
      hoodieGrad.addColorStop(1, t.shadow || '#0f172a');

      ctx.fillStyle = hoodieGrad;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 2.0;

      // Soft curved hoodie torso
      ctx.beginPath();
      ctx.moveTo(-68, -112);
      ctx.quadraticCurveTo(0, -118, 68, -112);
      ctx.quadraticCurveTo(82, -40, 76, 15);
      ctx.quadraticCurveTo(68, 70, 56, 120);
      ctx.lineTo(-56, 120);
      ctx.quadraticCurveTo(-68, 70, -76, 15);
      ctx.quadraticCurveTo(-82, -40, -68, -112);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Hood Drape Collar around neck
      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.moveTo(-45, -112);
      ctx.quadraticCurveTo(0, -90, 45, -112);
      ctx.quadraticCurveTo(35, -82, 0, -85);
      ctx.quadraticCurveTo(-35, -82, -45, -112);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // White Drawstrings with metallic aglets
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-14, -85);
      ctx.quadraticCurveTo(-18, -35, -15, -10);
      ctx.moveTo(14, -85);
      ctx.quadraticCurveTo(18, -35, 15, -10);
      ctx.stroke();
      // Metallic aglet tips
      ctx.fillStyle = trimColor;
      ctx.fillRect(-17, -10, 4, 8);
      ctx.fillRect(13, -10, 4, 8);

      // Front Kangaroo Pouch Pocket with double-needle stitching
      ctx.fillStyle = t.highlight || '#334155';
      ctx.beginPath();
      ctx.moveTo(-44, 25);
      ctx.lineTo(44, 25);
      ctx.quadraticCurveTo(52, 65, 42, 95);
      ctx.lineTo(-42, 95);
      ctx.quadraticCurveTo(-52, 65, -44, 25);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Pocket entry seams & subtle cloth drape lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-42, 36);
      ctx.lineTo(-40, 80);
      ctx.moveTo(42, 36);
      ctx.lineTo(40, 80);
      ctx.moveTo(-25, 45);
      ctx.quadraticCurveTo(0, 52, 25, 45);
      ctx.stroke();

      // Ribbed Waistband with vertical elastic stitch texture
      ctx.fillStyle = t.shadow || '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-58, 110, 116, 14, 3);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 0.8;
      for (let rx = -52; rx <= 52; rx += 8) {
        ctx.beginPath();
        ctx.moveTo(rx, 111);
        ctx.lineTo(rx, 123);
        ctx.stroke();
      }

    } else if (outfitType === 'SMART_BLAZER') {
      // 2. Modern Tailored Blazer with V-Neck Top
      const blazerGrad = ctx.createLinearGradient(-75, -115, 75, 120);
      blazerGrad.addColorStop(0, t.highlight || '#1e293b');
      blazerGrad.addColorStop(0.5, mainColor);
      blazerGrad.addColorStop(1, '#020617');

      ctx.fillStyle = blazerGrad;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 2.0;

      // Outer blazer silhouette
      ctx.beginPath();
      ctx.moveTo(-70, -112);
      ctx.quadraticCurveTo(0, -116, 70, -112);
      ctx.quadraticCurveTo(84, -40, 78, 15);
      ctx.lineTo(58, 120);
      ctx.lineTo(-58, 120);
      ctx.lineTo(-78, 15);
      ctx.quadraticCurveTo(-84, -40, -70, -112);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner Shirt / Top (V-neck)
      ctx.fillStyle = trimColor || '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-28, -112);
      ctx.lineTo(28, -112);
      ctx.lineTo(0, 10);
      ctx.closePath();
      ctx.fill();

      // Notched Lapels with Subtle Drop Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = blazerGrad;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 2.0;

      // Left lapel
      ctx.beginPath();
      ctx.moveTo(-50, -112);
      ctx.lineTo(-24, -55);
      ctx.lineTo(-38, -48);
      ctx.lineTo(-8, 35);
      ctx.lineTo(-4, 35);
      ctx.lineTo(-28, -112);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right lapel
      ctx.beginPath();
      ctx.moveTo(50, -112);
      ctx.lineTo(24, -55);
      ctx.lineTo(38, -48);
      ctx.lineTo(8, 35);
      ctx.lineTo(4, 35);
      ctx.lineTo(28, -112);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Breast Welt Pocket with Folded Pocket Square
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-52, -28, 22, 5);
      ctx.fillStyle = trimColor || '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-48, -28);
      ctx.lineTo(-42, -35);
      ctx.lineTo(-36, -28);
      ctx.closePath();
      ctx.fill();

      // Tailored Horn Button with Cross-Stitch Holes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 50, 5.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // 4 thread stitch dots
      ctx.fillStyle = '#ffffff';
      [-1.5, 1.5].forEach(dx => {
        [-1.5, 1.5].forEach(dy => {
          ctx.beginPath();
          ctx.arc(dx, 50 + dy, 0.6, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Lower Pocket flaps
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-52, 70, 28, 8);
      ctx.fillRect(24, 70, 28, 8);

    } else if (outfitType === 'COTTON_TSHIRT' || outfitType === 'COZY_SWEATER' || outfitType === 'CLASSIC_SHIRT' || outfitType === 'JACKET') {
      // 3. Modern T-Shirt / Sweater / Casual Top
      const topGrad = ctx.createLinearGradient(-75, -115, 75, 120);
      topGrad.addColorStop(0, t.highlight || '#38bdf8');
      topGrad.addColorStop(0.5, mainColor);
      topGrad.addColorStop(1, t.shadow || '#0369a1');

      ctx.fillStyle = topGrad;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.moveTo(-68, -112);
      ctx.quadraticCurveTo(0, -116, 68, -112);
      ctx.quadraticCurveTo(80, -40, 74, 15);
      ctx.lineTo(56, 120);
      ctx.lineTo(-56, 120);
      ctx.lineTo(-74, 15);
      ctx.quadraticCurveTo(-80, -40, -68, -112);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Crewneck Collar
      ctx.fillStyle = t.shadow || '#0369a1';
      ctx.beginPath();
      ctx.arc(0, -112, 28, 0.2, Math.PI - 0.2);
      ctx.lineTo(24, -112);
      ctx.arc(0, -112, 24, Math.PI - 0.2, 0.2, true);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (outfitType === 'CLASSIC_SHIRT') {
        // Vertical button placket
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -85);
        ctx.lineTo(0, 115);
        ctx.stroke();

        // Buttons
        for (let b = -60; b <= 90; b += 30) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, b, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (outfitType === 'JACKET') {
        // Metallic zipper line
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -85);
        ctx.lineTo(0, 120);
        ctx.stroke();
      }

    } else {
      // 4. Traditional / Armored Cuirass (for historical presets)
      const grad = ctx.createLinearGradient(-90, -120, 90, 120);
      grad.addColorStop(0, t.highlight || '#ea580c');
      grad.addColorStop(0.5, mainColor);
      grad.addColorStop(1, t.shadow || '#7c2d12');

      ctx.fillStyle = grad;
      ctx.strokeStyle = trimColor;
      ctx.lineWidth = 3.2;

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

      // Royal chest plate
      ctx.fillStyle = trimColor;
      ctx.beginPath();
      ctx.arc(0, -32, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderNeck(ctx) {
    ctx.save();
    const skin = this.profile.skin || { base: '#d4a373', shadow: '#996633' };

    // Anatomical neck cylinder
    const neckGrad = ctx.createLinearGradient(-30, -160, 30, -110);
    neckGrad.addColorStop(0, skin.shadow);
    neckGrad.addColorStop(0.5, skin.base);
    neckGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(-28, -160);
    ctx.lineTo(28, -160);
    ctx.lineTo(34, -110);
    ctx.lineTo(-34, -110);
    ctx.closePath();
    ctx.fill();

    // Neck tendon shadows
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-14, -155);
    ctx.lineTo(-6, -118);
    ctx.moveTo(14, -155);
    ctx.lineTo(6, -118);
    ctx.stroke();

    // Clavicle Highlight
    ctx.strokeStyle = skin.highlight || skin.base;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-45, -110);
    ctx.quadraticCurveTo(-15, -112, -4, -116);
    ctx.moveTo(45, -110);
    ctx.quadraticCurveTo(15, -112, 4, -116);
    ctx.stroke();

    // Subtle modern chain / pendant if specified
    const orn = this.profile.ornaments?.necklace;
    if (orn === 'SILVER_PENDANT' || orn === 'MINIMAL_CORD') {
      ctx.strokeStyle = orn === 'SILVER_PENDANT' ? '#e2e8f0' : '#475569';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, -125, 26, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Small modern geometric pendant
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, -99, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (orn === 'RUDRAKSHA_COBRA') {
      // Cobra for Rudra preset
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.arc(0, -125, 26, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else if (orn === 'RUDRAKSHA_MALA') {
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, -125, 28, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    ctx.restore();
  }

  renderHead(ctx) {
    ctx.save();
    const skin = this.profile.skin || { base: '#d4a373', highlight: '#faedcd', shadow: '#996633' };

    // Ambient drop shadow beneath the jaw/chin for true 3D floating depth
    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.28)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.moveTo(-46, -20);
    ctx.quadraticCurveTo(-36, 56, -18, 70);
    ctx.quadraticCurveTo(0, 76, 18, 70);
    ctx.quadraticCurveTo(36, 56, 46, -20);
    ctx.closePath();
    ctx.fillStyle = skin.shadow;
    ctx.fill();
    ctx.restore();

    // Sculpted cranial mass with multi-stop radial lighting
    const headGrad = ctx.createRadialGradient(-10, -35, 12, 0, -15, 88);
    headGrad.addColorStop(0, skin.highlight || skin.base);
    headGrad.addColorStop(0.55, skin.base);
    headGrad.addColorStop(0.88, skin.shadow);
    headGrad.addColorStop(1, skin.rim || skin.shadow);

    ctx.fillStyle = headGrad;
    ctx.strokeStyle = skin.rim || skin.highlight;
    ctx.lineWidth = 1.6;

    // Head Silhouette - Anatomical jawline and chin contour
    ctx.beginPath();
    ctx.moveTo(-48, -78);
    ctx.quadraticCurveTo(-52, -30, -45, 22);
    ctx.quadraticCurveTo(-36, 54, -18, 68);
    ctx.quadraticCurveTo(0, 74, 18, 68);
    ctx.quadraticCurveTo(36, 54, 45, 22);
    ctx.quadraticCurveTo(52, -30, 48, -78);
    ctx.quadraticCurveTo(0, -108, -48, -78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Soft Chin Cleft & Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 64, 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle Cheekbone Warm Highlights & Natural Healthy Blush
    const cheekGradL = ctx.createRadialGradient(-28, -2, 2, -28, -2, 20);
    cheekGradL.addColorStop(0, 'rgba(244, 63, 94, 0.22)');
    cheekGradL.addColorStop(0.6, (skin.highlight || '#fff') + '44');
    cheekGradL.addColorStop(1, 'transparent');
    ctx.fillStyle = cheekGradL;
    ctx.beginPath();
    ctx.arc(-28, -2, 20, 0, Math.PI * 2);
    ctx.fill();

    const cheekGradR = ctx.createRadialGradient(28, -2, 2, 28, -2, 20);
    cheekGradR.addColorStop(0, 'rgba(244, 63, 94, 0.22)');
    cheekGradR.addColorStop(0.6, (skin.highlight || '#fff') + '44');
    cheekGradR.addColorStop(1, 'transparent');
    ctx.fillStyle = cheekGradR;
    ctx.beginPath();
    ctx.arc(28, -2, 20, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted Human Ears with Concha & Antihelix
    [-48, 48].forEach((earX, sideIdx) => {
      ctx.save();
      const side = sideIdx === 0 ? -1 : 1;
      
      // Outer helix
      ctx.fillStyle = skin.base;
      ctx.strokeStyle = skin.shadow;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(earX, -2, 10, 16, side * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner concha shadow
      ctx.fillStyle = skin.shadow;
      ctx.beginPath();
      ctx.ellipse(earX + side * 2, -2, 5, 9, side * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Antihelix ridge highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(earX + side * 3, -3, 4, -0.8, 1.2);
      ctx.stroke();

      // Earrings (Delicate hoops / studs if enabled)
      const earType = this.profile.ornaments?.earrings;
      if (earType === 'GOLD_HOOPS') {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(earX + side * 2, 12, 6.5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (earType === 'PEARL_STUDS') {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(earX + side * 2, 11, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      } else if (earType === 'KUNDALAS' || earType === 'JHUMKAS') {
        // Traditional earring
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(earX + side * 2, 14, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // Facial Hair
    const fh = this.profile.facialHair;
    if (fh === 'SHORT_STUBBLE') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
      ctx.beginPath();
      ctx.arc(0, 50, 26, 0.1, Math.PI - 0.1);
      ctx.fill();
    } else if (fh === 'FULL_WHITE_BEARD') {
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(-36, 25);
      ctx.quadraticCurveTo(-50, 95, 0, 145);
      ctx.quadraticCurveTo(50, 95, 36, 25);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  renderFacialFeatures(ctx) {
    ctx.save();
    const skin = this.profile.skin || { base: '#d4a373', shadow: '#996633' };
    const eyes = this.profile.eyes || {};
    const eyeScale = eyes.size || 1.0;
    const speechInfluence = Math.min(1.0, (this.bones.jawOpen || 0) * 1.5);

    // 1. Tilaks / Markings ONLY if requested
    const m = this.profile.markings;
    if (m === 'TRIPUNDRA_CHANDAN') {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 3.2;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-26, -55 + i * 6);
        ctx.lineTo(26, -55 + i * 6);
        ctx.stroke();
      }
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -55, 3.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (m === 'DEVI_RED_BINDI') {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -48, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Third Eye ONLY if enabled
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
    }

    // 3. Natural Arched Feathered Eyebrows (Dynamic speech-reactive tilt)
    const browTilt = Math.sin(this.time * 2.0) * 0.05 * speechInfluence;
    ctx.fillStyle = '#09090b';
    [-1, 1].forEach(side => {
      ctx.save();
      ctx.rotate(side * browTilt);
      ctx.beginPath();
      ctx.moveTo(side * 37, -32);
      ctx.quadraticCurveTo(side * 22, -39 - speechInfluence * 2, side * 6, -31);
      ctx.quadraticCurveTo(side * 20, -35, side * 37, -29);
      ctx.closePath();
      ctx.fill();

      // Feathered brow hair strokes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.8;
      for (let bx = side * 10; Math.abs(bx) < 34; bx += side * 5) {
        ctx.beginPath();
        ctx.moveTo(bx, -33);
        ctx.lineTo(bx + side * 3, -37);
        ctx.stroke();
      }
      ctx.restore();
    });

    // 4. Luminous Expressive Eyes (Blinking, Gaze, Multi-Ring Iris & Dual Glints)
    const blink = this.bones.eyeBlink;
    const lookX = this.bones.eyeLookX * 4.5;
    const lookY = this.bones.eyeLookY * 3.5;

    [-22, 22].forEach((eyeX, idx) => {
      ctx.save();
      const side = idx === 0 ? -1 : 1;
      ctx.translate(eyeX, -16);
      ctx.scale(eyeScale, eyeScale * (1.0 - blink));

      // Upper Eyelid Crease Shadow (Orbital Depth)
      ctx.strokeStyle = skin.shadow;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-16, -11);
      ctx.quadraticCurveTo(0, -15, 16, -11);
      ctx.stroke();

      // Sclera with soft vertical gradient
      const scleraGrad = ctx.createLinearGradient(0, -9, 0, 9);
      scleraGrad.addColorStop(0, '#cbd5e1');
      scleraGrad.addColorStop(0.35, '#f8fafc');
      scleraGrad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = scleraGrad;

      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.quadraticCurveTo(0, -9.2, 15, 0);
      ctx.quadraticCurveTo(0, 8.8, -15, 0);
      ctx.closePath();
      ctx.fill();

      // Tear duct / Caruncle (inner canthus)
      ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
      ctx.beginPath();
      ctx.arc(side === -1 ? 14 : -14, 0, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Eye Clip for Iris and Pupil
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.quadraticCurveTo(0, -9.2, 15, 0);
      ctx.quadraticCurveTo(0, 8.8, -15, 0);
      ctx.closePath();
      ctx.clip();

      // Limbal Ring (Crisp dark border around iris)
      ctx.fillStyle = '#050811';
      ctx.beginPath();
      ctx.arc(lookX, lookY, 6.8, 0, Math.PI * 2);
      ctx.fill();

      // Iris Gradient with rich radial depth
      const irisGrad = ctx.createRadialGradient(lookX, lookY, 1, lookX, lookY, 6.2);
      irisGrad.addColorStop(0, '#ffffff');
      irisGrad.addColorStop(0.28, eyes.glow || eyes.iris || '#3e2723');
      irisGrad.addColorStop(0.75, eyes.iris || '#3e2723');
      irisGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.arc(lookX, lookY, 6.1, 0, Math.PI * 2);
      ctx.fill();

      // Delicate Iris Radial Fibers (Striations)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 0.7;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(lookX + Math.cos(a) * 2.8, lookY + Math.sin(a) * 2.8);
        ctx.lineTo(lookX + Math.cos(a) * 5.6, lookY + Math.sin(a) * 5.6);
        ctx.stroke();
      }

      // Pupil with subtle breathing dilation
      const pupilRadius = 3.0 + Math.sin(this.time * 1.5) * 0.2;
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(lookX, lookY, pupilRadius, 0, Math.PI * 2);
      ctx.fill();

      // Primary Crisp Specular Keylight Glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(lookX - 1.8, lookY - 1.8, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Secondary Ambient Bounce Reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.arc(lookX + 1.6, lookY + 1.5, 0.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end clip

      // Upper Eyelash line with delicate winged corner
      ctx.strokeStyle = '#050811';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.quadraticCurveTo(0, -10.2, 16, 0);
      ctx.stroke();

      // Fine feathered lash strokes on outer eye
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(side === 1 ? 15 : -15, 0);
      ctx.quadraticCurveTo(side === 1 ? 18 : -18, -3, side === 1 ? 20 : -20, -5);
      ctx.stroke();

      ctx.restore();
    });

    // 5. Modern Accessories: Stylish Acetate Glasses
    if (this.profile.accessories === 'STYLISH_GLASSES') {
      ctx.save();
      ctx.strokeStyle = '#09090b'; // modern dark acetate frame
      ctx.lineWidth = 2.6;

      // Left Frame
      ctx.beginPath();
      ctx.roundRect(-36, -26, 26, 20, 6);
      ctx.stroke();

      // Right Frame
      ctx.beginPath();
      ctx.roundRect(10, -26, 26, 20, 6);
      ctx.stroke();

      // Nose Bridge Bar
      ctx.beginPath();
      ctx.moveTo(-10, -18);
      ctx.quadraticCurveTo(0, -22, 10, -18);
      ctx.stroke();

      // Subtle Glass Lens Reflection
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-30, -22);
      ctx.lineTo(-20, -10);
      ctx.moveTo(16, -22);
      ctx.lineTo(26, -10);
      ctx.stroke();

      ctx.restore();
    }

    // 6. Sculpted 3D Anatomical Nose with Bridge Shading & Tip Specular
    ctx.save();
    
    // Bilateral Bridge Shading
    ctx.strokeStyle = skin.shadow + '88';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-4, -24);
    ctx.quadraticCurveTo(-5, 0, -6, 15);
    ctx.stroke();

    ctx.strokeStyle = skin.shadow + '44';
    ctx.beginPath();
    ctx.moveTo(4, -24);
    ctx.quadraticCurveTo(5, 0, 6, 15);
    ctx.stroke();

    // Dorsal Highlight Line
    ctx.strokeStyle = (skin.highlight || '#fff') + 'aa';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 14);
    ctx.stroke();

    // Nasal Tip Bulb Highlight Dome
    ctx.fillStyle = skin.highlight || skin.base;
    ctx.beginPath();
    ctx.arc(0, 17, 4.2, 0, Math.PI * 2);
    ctx.fill();

    // Alar Creases (Nostril Wings)
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-8, 18);
    ctx.quadraticCurveTo(-11, 20, -7, 23);
    ctx.moveTo(8, 18);
    ctx.quadraticCurveTo(11, 20, 7, 23);
    ctx.stroke();

    // Nostril Cavities
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.ellipse(-5, 20.5, 3.2, 1.8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(5, 20.5, 3.2, 1.8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Real-Time Lip-Sync Mouth with Philtrum Column & Specular Gloss
    ctx.save();
    ctx.translate(0, 44);
    const jaw = this.bones.jawOpen;
    const mw = this.bones.mouthWidth;

    // Subtle Philtrum Column Indentation leading down from nose septum
    ctx.strokeStyle = skin.shadow + '55';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-2.5, -17);
    ctx.lineTo(-2.0, -6);
    ctx.moveTo(2.5, -17);
    ctx.lineTo(2.0, -6);
    ctx.stroke();

    if (jaw < 0.12) {
      // Natural closed resting lips with Cupid's bow and corner nodes
      ctx.fillStyle = '#9f1239'; // soft rose
      ctx.beginPath();
      ctx.moveTo(-15 * mw, 0);
      ctx.quadraticCurveTo(-6 * mw, -4.0, 0, -2.2);
      ctx.quadraticCurveTo(6 * mw, -4.0, 15 * mw, 0);
      ctx.quadraticCurveTo(0, 1.2, -15 * mw, 0);
      ctx.closePath();
      ctx.fill();

      // Lower lip fullness
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.moveTo(-14 * mw, 0);
      ctx.quadraticCurveTo(0, 1.0, 14 * mw, 0);
      ctx.quadraticCurveTo(0, 7.5, -14 * mw, 0);
      ctx.closePath();
      ctx.fill();

      // Curved specular gloss reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.beginPath();
      ctx.ellipse(0, 3.4, 5.0 * mw, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Lip Corner Dimples
      ctx.fillStyle = skin.shadow;
      ctx.beginPath();
      ctx.arc(-15 * mw, 0, 1.0, 0, Math.PI * 2);
      ctx.arc(15 * mw, 0, 1.0, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Talking Mouth Cavity with Shaded Throat, Enamel Incisors, and Tongue
      ctx.beginPath();
      ctx.moveTo(-16 * mw, 0);
      ctx.quadraticCurveTo(0, -8 * jaw, 16 * mw, 0);
      ctx.quadraticCurveTo(0, 19 * jaw, -16 * mw, 0);
      ctx.closePath();

      ctx.fillStyle = '#1c0712';
      ctx.fill();
      ctx.strokeStyle = '#881337';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Upper Enamel Incisors (Translucent edge)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-8.5 * mw, -4 * jaw, 17 * mw, 6.5 * jaw, [0, 0, 3, 3]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Tongue Articulation with soft specular bounce
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(0, 12 * jaw, 7.5 * mw, 4.5 * jaw, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 10 * jaw, 4.0 * mw, 2.0 * jaw, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.restore();
  }

  renderCrownAndFrontHair(ctx) {
    ctx.save();
    const hg = this.profile.headgear || 'NONE';
    const hair = this.profile.hair || {};
    const hairStyle = hair.style || 'MODERN_FADE';
    const hairColor = hair.color || '#18181b';

    // 1. Front Hair Rendering based on modern style
    if (hg === 'NONE') {
      ctx.fillStyle = hairColor;

      if (hairStyle === 'MODERN_FADE' || hairStyle === 'SHORT_CROP') {
        // Modern fade / sharp textured crop
        ctx.beginPath();
        ctx.moveTo(-48, -75);
        ctx.quadraticCurveTo(-45, -95, 0, -100);
        ctx.quadraticCurveTo(45, -95, 48, -75);
        ctx.quadraticCurveTo(25, -68, 0, -74);
        ctx.quadraticCurveTo(-25, -68, -48, -75);
        ctx.closePath();
        ctx.fill();

        // Top texture strands
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        for (let s = -25; s <= 25; s += 10) {
          ctx.beginPath();
          ctx.moveTo(s, -98);
          ctx.lineTo(s * 0.8, -80);
          ctx.stroke();
        }

      } else if (hairStyle === 'SLEEK_BOB' || hairStyle === 'LONG_WAVES') {
        // Sleek bob / wavy framing locks
        ctx.beginPath();
        ctx.moveTo(-48, -75);
        ctx.quadraticCurveTo(-52, -20, -42, 25);
        ctx.quadraticCurveTo(-34, -30, -22, -68);
        ctx.quadraticCurveTo(0, -80, 22, -68);
        ctx.quadraticCurveTo(34, -30, 42, 25);
        ctx.quadraticCurveTo(52, -20, 48, -75);
        ctx.quadraticCurveTo(0, -102, -48, -75);
        ctx.closePath();
        ctx.fill();

      } else if (hairStyle === 'PONYTAIL') {
        // Pulled back hair with high ponytail
        ctx.beginPath();
        ctx.moveTo(-48, -75);
        ctx.quadraticCurveTo(0, -100, 48, -75);
        ctx.quadraticCurveTo(0, -78, -48, -75);
        ctx.fill();

        // Ponytail bunch at back top
        ctx.beginPath();
        ctx.arc(0, -104, 14, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Textured casual hair
        ctx.beginPath();
        ctx.moveTo(-48, -75);
        ctx.quadraticCurveTo(-25, -62, 0, -74);
        ctx.quadraticCurveTo(25, -62, 48, -75);
        ctx.quadraticCurveTo(0, -98, -48, -75);
        ctx.fill();
      }

    } else if (hg === 'CRESCENT_MOON_SERPENT') {
      // Jata Bun
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.arc(0, -98, 40, 0, Math.PI * 2);
      ctx.fill();

      // Crescent moon
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(30, -102, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.arc(24, -102, 14, 0, Math.PI * 2);
      ctx.fill();

    } else if (hg === 'GOLDEN_LOTUS_TIARA' || hg === 'SILVER_GOLD_WAR_MUKUT') {
      // Traditional crown
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
    }

    // 2. Modern Accessories: Studio Headphones around neck
    if (this.profile.accessories === 'STUDIO_HEADPHONES') {
      ctx.save();
      ctx.translate(0, 52); // Resting around the neck

      // Headphone padded band
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, -38, 40, 0.4, Math.PI - 0.4);
      ctx.stroke();

      // Left Ear Cup
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.roundRect(-46, -25, 14, 26, 6);
      ctx.fill();
      ctx.stroke();

      // Right Ear Cup
      ctx.beginPath();
      ctx.roundRect(32, -25, 14, 26, 6);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }

  renderArms(ctx) {
    ctx.save();
    const skin = this.profile.skin || { base: '#d4a373' };
    const t = this.profile.torso || {};

    // Left Arm (Back / Lead)
    this.renderSingleArm(ctx, -75, -100, this.bones.leftArmAngle, this.bones.leftForearmAngle, skin, t, -1);

    // Right Arm (Front / Gesture)
    this.renderSingleArm(ctx, 75, -100, this.bones.rightArmAngle, this.bones.rightForearmAngle, skin, t, 1);

    ctx.restore();
  }

  renderSingleArm(ctx, shoulderX, shoulderY, armAngle, forearmAngle, skin, torso, side) {
    ctx.save();
    ctx.translate(shoulderX, shoulderY);

    const isModern = torso.type === 'CASUAL_HOODIE' || torso.type === 'SMART_BLAZER' || torso.type === 'COTTON_TSHIRT' || torso.type === 'COZY_SWEATER' || torso.type === 'CLASSIC_SHIRT' || torso.type === 'JACKET';

    // 1. Shoulder
    if (isModern) {
      // Cloth shoulder seam
      ctx.fillStyle = torso.main || '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Armor pauldron
      ctx.fillStyle = torso.trim || '#facc15';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Upper Bicep
    ctx.rotate(armAngle);

    if (isModern && torso.type !== 'COTTON_TSHIRT') {
      // Long cloth sleeve (Hoodie / Blazer / Sweater)
      ctx.fillStyle = torso.main || '#1e293b';
      ctx.beginPath();
      ctx.roundRect(-13, 0, 26, 75, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    } else {
      // Bare arm or short sleeve
      ctx.fillStyle = skin.base;
      ctx.beginPath();
      ctx.roundRect(-12, 0, 24, 75, 8);
      ctx.fill();
    }

    // 3. Forearm & Wrist
    ctx.translate(0, 75);
    ctx.rotate(forearmAngle);

    if (isModern && (torso.type === 'CASUAL_HOODIE' || torso.type === 'SMART_BLAZER' || torso.type === 'COZY_SWEATER')) {
      // Sleeve continuing down forearm
      ctx.fillStyle = torso.main || '#1e293b';
      ctx.beginPath();
      ctx.roundRect(-11, 0, 22, 60, 6);
      ctx.fill();

      // Sleeve ribbed cuff
      ctx.fillStyle = torso.highlight || torso.main;
      ctx.fillRect(-12, 58, 24, 10);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.strokeRect(-12, 58, 24, 10);
    } else {
      // Forearm skin
      ctx.fillStyle = skin.base;
      ctx.beginPath();
      ctx.roundRect(-11, 0, 22, 68, 6);
      ctx.fill();
    }

    // Smartwatch on wrist - Modern Curved OLED Display
    if (this.profile.ornaments?.wrists === 'SMART_WATCH') {
      ctx.save();
      // Silicone strap band
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-13, 61, 26, 9, 2);
      ctx.fill();

      // Curved OLED Bezel
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.roundRect(-7, 60, 14, 11, 3);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Glowing Cyan Digital Display & Activity Ring
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-5, 62, 10, 4);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 68, 2, 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Natural Modern Hand & Expressive Fingers with Knuckle Creases
    ctx.translate(0, 75);

    // Palm & Thenar Eminence (Thumb Pad Muscle)
    ctx.fillStyle = skin.highlight || skin.base;
    ctx.beginPath();
    ctx.ellipse(0, 6, 11, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thenar muscle pad contour
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.ellipse(side === 1 ? -4 : 4, 7, 5, 7, side * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Thumb with pad and fingernail accent
    ctx.save();
    ctx.translate(side === 1 ? -9 : 9, 3);
    ctx.rotate(side === 1 ? -0.4 : 0.4);
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.roundRect(-3.5, 0, 7, 13, 3.5);
    ctx.fill();

    // Thumb nail
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.roundRect(-2, 8, 4, 3.5, 1.5);
    ctx.fill();
    ctx.restore();

    // 4 Articulated Fingers with Knuckle Creases
    const fingerOffsets = [-7, -2.5, 2.5, 7];
    const fingerLengths = [14, 17, 16, 13];

    fingerOffsets.forEach((fx, fIdx) => {
      const fl = fingerLengths[fIdx];
      ctx.save();
      ctx.translate(fx, 11);
      ctx.rotate((fx / 12) * 0.15);
      
      // Finger segment
      ctx.fillStyle = skin.base;
      ctx.beginPath();
      ctx.roundRect(-2.6, 0, 5.2, fl, 2.6);
      ctx.fill();

      // Knuckle crease
      ctx.strokeStyle = skin.shadow + '66';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(-1.8, fl * 0.45);
      ctx.lineTo(1.8, fl * 0.45);
      ctx.stroke();

      // Fingernail bed
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.roundRect(-1.6, fl - 3.8, 3.2, 2.8, 1.0);
      ctx.fill();

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
