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
  },

  // --- Iconic Historical, Lore & Mythological Archetypes ---
  KARNA: {
    id: 'KARNA',
    name: 'Karna (Son of Surya)',
    role: 'Indomitable Hero of the Mahabharata',
    emoji: '☀️',
    gender: 'M',
    skin: { base: '#c27838', highlight: '#f5b064', shadow: '#784318', rim: '#fde047' },
    eyes: { size: 1.15, shape: 'FIERCE_WARRIOR', iris: '#d97706', glow: '#facc15', thirdEye: false },
    hair: { color: '#09090b', style: 'WARRIOR_HALF_KNOT', sway: 0.9 },
    facialHair: 'WARRIOR_STUBBLE',
    headgear: 'SURYA_WARRIOR_CROWN',
    accessories: 'NONE',
    torso: { type: 'KAVACHA_GOLD_ARMOR', main: '#eab308', highlight: '#fef08a', shadow: '#a16207', trim: '#ea580c' },
    legs: { type: 'WARRIOR_KACHHA_DHOTI', color: '#c2410c', trim: '#facc15' },
    cape: { enabled: true, color: '#9a3412', trim: '#facc15' },
    ornaments: { necklace: 'SURYA_CHEST_PENDANT', earrings: 'CELESTIAL_KUNDALAS', wrists: 'GOLDEN_ANGADA' },
    markings: 'SURYA_TILAK',
    heldItem: 'BOW_AND_ARROW',
    pose: 'HEROIC_STANCE',
    aura: true
  },

  RAM: {
    id: 'RAM',
    name: 'Lord Ram (Maryada Purushottama)',
    role: 'Virtuous Prince of Ayodhya',
    emoji: '🏹',
    gender: 'M',
    skin: { base: '#2563eb', highlight: '#93c5fd', shadow: '#1e40af', rim: '#dbeafe' },
    eyes: { size: 1.25, shape: 'ALMOND_DIVINE', iris: '#1e3a8a', glow: '#60a5fa', thirdEye: false },
    hair: { color: '#09090b', style: 'ROYAL_ASCETIC_LOCKS', sway: 1.0 },
    facialHair: 'NONE',
    headgear: 'AYODHYA_PRINCE_DIADEM',
    accessories: 'NONE',
    torso: { type: 'RAMA_PITAMBAR_SILK', main: '#eab308', highlight: '#fef08a', shadow: '#ca8a04', trim: '#3b82f6' },
    legs: { type: 'RAMA_SILK_DHOTI', color: '#facc15', trim: '#ca8a04' },
    cape: { enabled: false, color: '#000000', trim: '#000000' },
    ornaments: { necklace: 'PEARL_MUKTAHARA', earrings: 'GOLD_KUNDALAS', wrists: 'SACRED_RAKHI_GOLD' },
    markings: 'RAMA_URDHVA_PUNDRA',
    heldItem: 'BOW_AND_ARROW',
    pose: 'SERENE_STANCE',
    aura: true
  },

  MAN_1950S: {
    id: 'MAN_1950S',
    name: 'Arthur: 1950s Gentleman',
    role: 'Mid-Century Urban Citizen',
    emoji: '🎩',
    gender: 'M',
    skin: { base: '#e2ba93', highlight: '#fdeddf', shadow: '#a9754f', rim: '#ffffff' },
    eyes: { size: 1.0, shape: 'SERENE_MEDITATIVE', iris: '#3e2723', glow: '#78350f', thirdEye: false },
    hair: { color: '#27272a', style: 'VINTAGE_SIDE_PART', sway: 0.3 },
    facialHair: 'VINTAGE_MOUSTACHE',
    headgear: 'FEDORA_HAT',
    accessories: 'VINTAGE_HORN_GLASSES',
    torso: { type: 'VINTAGE_1950S_SUIT', main: '#334155', highlight: '#475569', shadow: '#1e293b', trim: '#b91c1c' },
    legs: { type: 'PLEATED_1950S_TROUSERS', color: '#1e293b', trim: '#0f172a' },
    cape: { enabled: false, color: '#000000', trim: '#000000' },
    ornaments: { necklace: 'NONE', earrings: 'NONE', wrists: 'VINTAGE_LEATHER_WATCH' },
    markings: 'NONE',
    heldItem: 'VINTAGE_BRIEFCASE',
    pose: 'HOLDING_PROP',
    aura: false
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

    // Prop holding & pose articulation
    this.heldItem = this.profile.heldItem || 'NONE';
    this.pose = this.profile.pose || 'NEUTRAL';
    this.propSide = 1; // 1 = front hand
  }

  setHeldItem(item) {
    this.heldItem = item;
    if (this.profile) this.profile.heldItem = item;
  }

  setPose(pose) {
    this.pose = pose;
    if (this.profile) this.profile.pose = pose;
  }

  /**
   * Universal Prompt-to-Character Synthesis Engine
   * Parses natural language prompts (e.g. "Karna from Mahabharata", "Ram from Ramayana", "Simple man from 1950s")
   * and synthesizes head-to-toe tailored profiles with lore-accurate body, outfit, hair, and props.
   */
  static synthesizeFromPrompt(prompt = '') {
    const raw = (prompt || '').trim();
    const text = raw.toLowerCase();

    // 1. Karna from Mahabharata
    if (text.includes('karna') || text.includes('radheya') || text.includes('suryaputra') || (text.includes('sun') && text.includes('warrior'))) {
      const p = JSON.parse(JSON.stringify(CHARACTER_PROFILES.KARNA));
      if (text.includes('sword')) p.heldItem = 'SWORD';
      if (text.includes('cane')) p.heldItem = 'WALKING_CANE';
      if (text.includes('briefcase')) p.heldItem = 'VINTAGE_BRIEFCASE';
      if (text.includes('walk')) p.pose = 'WALKING';
      return p;
    }

    // 2. Lord Ram from Ramayana
    if (text.includes('ram') || text.includes('rama') || text.includes('ramayana') || text.includes('raghava') || text.includes('ayodhya')) {
      const p = JSON.parse(JSON.stringify(CHARACTER_PROFILES.RAM));
      if (text.includes('sword')) p.heldItem = 'SWORD';
      if (text.includes('namaste')) p.pose = 'NAMASTE';
      if (text.includes('walk')) p.pose = 'WALKING';
      return p;
    }

    // 3. 1950s Vintage Gentleman
    if (text.includes('1950') || text.includes('1950s') || text.includes('vintage') || text.includes('gentleman') || text.includes('fedora') || text.includes('detective') || text.includes('noir')) {
      const p = JSON.parse(JSON.stringify(CHARACTER_PROFILES.MAN_1950S));
      if (text.includes('cane') || text.includes('walking stick')) p.heldItem = 'WALKING_CANE';
      if (text.includes('sword')) p.heldItem = 'SWORD';
      if (text.includes('bow')) p.heldItem = 'BOW_AND_ARROW';
      if (text.includes('walk')) p.pose = 'WALKING';
      return p;
    }

    // 4. Recognized archetypes
    if (text.includes('alex') || text.includes('creator') || text.includes('podcast')) {
      return JSON.parse(JSON.stringify(CHARACTER_PROFILES.ALEX));
    }
    if (text.includes('maya') || text.includes('product') || text.includes('lead')) {
      return JSON.parse(JSON.stringify(CHARACTER_PROFILES.MAYA));
    }
    if (text.includes('priya') || text.includes('designer') || text.includes('artist')) {
      return JSON.parse(JSON.stringify(CHARACTER_PROFILES.PRIYA));
    }
    if (text.includes('david') || text.includes('speaker') || text.includes('analyst')) {
      return JSON.parse(JSON.stringify(CHARACTER_PROFILES.DAVID));
    }
    if (text.includes('elena') || text.includes('explorer') || text.includes('traveler')) {
      return JSON.parse(JSON.stringify(CHARACTER_PROFILES.ELENA));
    }
    if (text.includes('rohan') || text.includes('student') || text.includes('coder')) {
      return JSON.parse(JSON.stringify(CHARACTER_PROFILES.ROHAN));
    }
    if (text.includes('sam') || text.includes('casual') || text.includes('host')) {
      return JSON.parse(JSON.stringify(CHARACTER_PROFILES.SAM));
    }

    // 5. Dynamic Procedural Synthesis
    const isFemale = text.includes('woman') || text.includes('female') || text.includes('girl') || text.includes('lady');
    const isAncient = text.includes('ancient') || text.includes('warrior') || text.includes('mythic') || text.includes('king') || text.includes('prince');
    const isVintage = text.includes('retro') || text.includes('classic') || text.includes('suit');

    let baseSkin = { base: '#d4a373', highlight: '#faedcd', shadow: '#996633', rim: '#ffffff' };
    if (text.includes('dark') || text.includes('espresso')) {
      baseSkin = { base: '#5c3d2e', highlight: '#855842', shadow: '#3a241b', rim: '#b5856b' };
    } else if (text.includes('fair') || text.includes('pale')) {
      baseSkin = { base: '#f7d7c4', highlight: '#fff0e5', shadow: '#e0b89f', rim: '#ffffff' };
    } else if (text.includes('blue') || text.includes('avatar') || text.includes('shyam')) {
      baseSkin = { base: '#253d6e', highlight: '#60a5fa', shadow: '#172554', rim: '#bfdbfe' };
    } else if (text.includes('bronze') || text.includes('copper')) {
      baseSkin = { base: '#c27838', highlight: '#f5b064', shadow: '#784318', rim: '#fde047' };
    }

    let outfitType = isAncient ? 'KAVACHA_GOLD_ARMOR' : isVintage ? 'VINTAGE_1950S_SUIT' : isFemale ? 'SMART_BLAZER' : 'CASUAL_HOODIE';
    let legType = isAncient ? 'WARRIOR_KACHHA_DHOTI' : isVintage ? 'PLEATED_1950S_TROUSERS' : isFemale ? 'CHINO_TROUSERS' : 'SLIM_JEANS';
    let headgear = isAncient ? 'SURYA_WARRIOR_CROWN' : isVintage ? 'FEDORA_HAT' : 'NONE';
    let heldItem = 'NONE';

    if (text.includes('bow') || text.includes('arrow')) heldItem = 'BOW_AND_ARROW';
    else if (text.includes('sword') || text.includes('blade')) heldItem = 'SWORD';
    else if (text.includes('cane') || text.includes('stick')) heldItem = 'WALKING_CANE';
    else if (text.includes('briefcase') || text.includes('bag')) heldItem = 'VINTAGE_BRIEFCASE';
    else if (text.includes('mic') || text.includes('microphone')) heldItem = 'MICROPHONE';
    else if (text.includes('book') || text.includes('scroll')) heldItem = 'BOOK_SCROLL';

    return {
      id: 'SYNTH_' + Date.now(),
      name: raw.slice(0, 24) || 'Synthesized Character',
      role: 'Custom Synthesized Figure',
      emoji: isAncient ? '⚔️' : isVintage ? '🎩' : isFemale ? '👩' : '👤',
      gender: isFemale ? 'F' : 'M',
      skin: baseSkin,
      eyes: {
        size: isAncient ? 1.15 : 1.05,
        shape: isAncient ? 'FIERCE_WARRIOR' : 'ROUND_EXPRESSIVE',
        iris: isAncient ? '#d97706' : '#3e2723',
        glow: isAncient ? '#facc15' : '#78350f',
        thirdEye: false
      },
      hair: {
        color: '#18181b',
        style: isFemale ? 'SLEEK_BOB' : isAncient ? 'WARRIOR_HALF_KNOT' : isVintage ? 'VINTAGE_SIDE_PART' : 'MODERN_FADE',
        sway: 0.8
      },
      facialHair: isAncient ? 'SHORT_STUBBLE' : isVintage ? 'VINTAGE_MOUSTACHE' : 'NONE',
      headgear: headgear,
      accessories: text.includes('glasses') ? 'STYLISH_GLASSES' : 'NONE',
      torso: {
        type: outfitType,
        main: isAncient ? '#eab308' : isVintage ? '#334155' : '#1e293b',
        highlight: isAncient ? '#fef08a' : isVintage ? '#475569' : '#334155',
        shadow: isAncient ? '#a16207' : isVintage ? '#1e293b' : '#0f172a',
        trim: isAncient ? '#ea580c' : '#f8fafc'
      },
      legs: {
        type: legType,
        color: isAncient ? '#c2410c' : '#1e293b',
        trim: '#f8fafc'
      },
      cape: { enabled: isAncient, color: '#9a3412', trim: '#facc15' },
      ornaments: { necklace: 'NONE', earrings: 'NONE', wrists: 'NONE' },
      markings: isAncient ? 'SURYA_TILAK' : 'NONE',
      heldItem: heldItem,
      pose: heldItem !== 'NONE' ? 'HOLDING_PROP' : 'NEUTRAL',
      aura: isAncient
    };
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

    // 5. Arm Gestures & Pose Articulation (Walking counter-swing, Heroic Stance, Namaste, Pointing, Prop Holding)
    if (this.isWalking) {
      const armSwing = Math.sin(this.walkPhase) * 0.45;
      this.bones.leftArmAngle = -armSwing;
      this.bones.rightArmAngle = armSwing;
      this.bones.leftForearmAngle = 0.2;
      this.bones.rightForearmAngle = -0.2;
    } else {
      const p = this.pose || this.profile?.pose || 'NEUTRAL';
      if (p === 'HEROIC_STANCE') {
        // Heroic Stance: left arm steady, right arm angled with bow/weapon, confident posture
        this.bones.leftArmAngle = -0.45 + Math.sin(this.time * 1.5) * 0.03;
        this.bones.rightArmAngle = 0.35 + Math.sin(this.time * 1.5) * 0.03;
        this.bones.leftForearmAngle = -0.35;
        this.bones.rightForearmAngle = 0.45;
        this.bones.leftLegAngle = -0.08;
        this.bones.rightLegAngle = 0.08;
      } else if (p === 'NAMASTE') {
        // Namaste Greeting: both hands joined at heart center, gentle respectful head nod
        this.bones.leftArmAngle = -0.32;
        this.bones.rightArmAngle = 0.32;
        this.bones.leftForearmAngle = 0.82;
        this.bones.rightForearmAngle = -0.82;
        this.bones.headAngle = 0.10 + Math.sin(this.time * 1.5) * 0.02;
      } else if (p === 'POINTING') {
        // Pointing gesture: right arm extended forward
        this.bones.leftArmAngle = 0.15;
        this.bones.rightArmAngle = -0.72 + Math.sin(this.time * 2.0) * 0.04;
        this.bones.leftForearmAngle = 0.25;
        this.bones.rightForearmAngle = 0.12;
      } else if (p === 'HOLDING_PROP') {
        // Holding prop: right hand firmly grasping cane, briefcase, mic
        this.bones.leftArmAngle = 0.12 + Math.sin(this.time * 1.8) * 0.03;
        this.bones.rightArmAngle = 0.20 + Math.sin(this.time * 1.8) * 0.03;
        this.bones.leftForearmAngle = 0.25;
        this.bones.rightForearmAngle = 0.10;
      } else if (p === 'TALKING_GESTURE') {
        // Active conversational speech gestures
        this.bones.leftArmAngle = 0.15 + Math.sin(this.time * 2.0) * 0.08 * speechInfluence;
        this.bones.rightArmAngle = -0.25 - Math.cos(this.time * 2.4) * 0.12 * speechInfluence;
        this.bones.leftForearmAngle = 0.35 + Math.sin(this.time * 2.5) * 0.15 * speechInfluence;
        this.bones.rightForearmAngle = -0.45 - Math.cos(this.time * 2.8) * 0.2 * speechInfluence;
      } else {
        // Standard conversational idle arm motion
        this.bones.leftArmAngle = 0.15 + Math.sin(this.time * 2.0) * 0.06 * speechInfluence;
        this.bones.rightArmAngle = -0.15 - Math.cos(this.time * 2.2) * 0.06 * speechInfluence;
        this.bones.leftForearmAngle = 0.35 + Math.sin(this.time * 2.5) * 0.1 * speechInfluence;
        this.bones.rightForearmAngle = -0.35 - Math.cos(this.time * 2.8) * 0.1 * speechInfluence;
      }
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

    // Layer -1: Soft Ground Contact Ambient Occlusion Shadow (Grounded realism)
    ctx.save();
    const shadowStretch = 1.0 + Math.abs(Math.sin(this.walkPhase || 0)) * 0.12;
    const groundShadow = ctx.createRadialGradient(0, 182, 3, 0, 182, 70 * shadowStretch);
    groundShadow.addColorStop(0, 'rgba(15, 23, 42, 0.40)');
    groundShadow.addColorStop(0.45, 'rgba(15, 23, 42, 0.16)');
    groundShadow.addColorStop(1, 'transparent');
    ctx.fillStyle = groundShadow;
    ctx.beginPath();
    ctx.ellipse(0, 182, 70 * shadowStretch, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

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

      // Sneaker Side Panel Accent Chevron / Swoosh
      ctx.fillStyle = this.profile.torso?.trim || '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(-4, 9);
      ctx.lineTo(7, 5);
      ctx.lineTo(11, 8);
      ctx.lineTo(5, 11);
      ctx.closePath();
      ctx.fill();

      // Crisscross Laces with Tied Bow Loops
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-2, 4); ctx.lineTo(8, 7);
      ctx.moveTo(8, 4); ctx.lineTo(-2, 7);
      ctx.moveTo(-2, 8); ctx.lineTo(8, 11);
      ctx.moveTo(8, 8); ctx.lineTo(-2, 11);
      ctx.stroke();

      // Tied shoelace bow loops
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(1, 2, 3.2, 1.8, -0.4, 0, Math.PI * 2);
      ctx.ellipse(5, 2, 3.2, 1.8, 0.4, 0, Math.PI * 2);
      ctx.stroke();

      // Rear Heel Pull Tab
      ctx.fillStyle = this.profile.torso?.trim || '#38bdf8';
      ctx.fillRect(-13, 3, 2.5, 6);

    } else if (type === 'PLEATED_1950S_TROUSERS') {
      // 1950s High-Waisted Pleated Wool Trousers & Two-Tone Oxford Wingtip Brogues
      const woolGrad = ctx.createLinearGradient(-18, 0, 18, 90);
      woolGrad.addColorStop(0, '#334155');
      woolGrad.addColorStop(0.5, '#1e293b');
      woolGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = woolGrad;
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 1.6;

      // Thigh with pressed front crease
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.quadraticCurveTo(-20, 45, -16, 86);
      ctx.lineTo(16, 86);
      ctx.quadraticCurveTo(20, 45, 18, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sharp ironed vertical trouser crease
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(0, 85);
      ctx.stroke();

      // Knee Joint
      ctx.translate(0, 86);
      ctx.rotate(kneeAngle);

      // Wide-cut Lower Trouser Leg
      ctx.fillStyle = woolGrad;
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.quadraticCurveTo(-18, 45, -15, 80);
      ctx.lineTo(15, 80);
      ctx.quadraticCurveTo(18, 45, 16, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Trouser Crease continuing down
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 78);
      ctx.stroke();

      // 1950s Wide Turn-Up Cuffs (Cuffed hem)
      ctx.fillStyle = '#475569';
      ctx.fillRect(-16, 74, 32, 9);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-16, 74, 32, 9);

      // Two-Tone Wingtip Brogues (Spectator Dress Shoes)
      ctx.translate(0, 82);

      // Stacked leather heel & dark sole
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(-14, 15, 42, 6);

      // White leather vamp & quarter panel
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-13, 2);
      ctx.lineTo(12, 2);
      ctx.quadraticCurveTo(22, 6, 25, 15);
      ctx.lineTo(-13, 15);
      ctx.closePath();
      ctx.fill();

      // Dark tan / brown leather toe cap (Wingtip 'W' curvature)
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(6, 15);
      ctx.lineTo(6, 9);
      ctx.quadraticCurveTo(14, 5, 25, 15);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Perforated medallion brogue pin-holes on toe
      ctx.fillStyle = '#291206';
      for (let bx = 11; bx <= 20; bx += 4) {
        ctx.fillRect(bx, 10, 1.5, 1.5);
      }

      // Dark leather heel counter
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-13, 2, 7, 13);

    } else if (type === 'WARRIOR_KACHHA_DHOTI') {
      // Karna: Saffron Warrior Kachha Dhoti & Golden Battle Greaves
      const dhotiGrad = ctx.createLinearGradient(-18, 0, 18, 90);
      dhotiGrad.addColorStop(0, '#c2410c');
      dhotiGrad.addColorStop(0.5, '#ea580c');
      dhotiGrad.addColorStop(1, '#7c2d12');

      ctx.fillStyle = dhotiGrad;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.4;

      // Thigh wrapped tight for war
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.quadraticCurveTo(-22, 45, -14, 88);
      ctx.lineTo(14, 88);
      ctx.quadraticCurveTo(22, 45, 18, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Dhoti Pleat diagonal lines
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-10, 15); ctx.lineTo(12, 60);
      ctx.moveTo(-12, 35); ctx.lineTo(10, 75);
      ctx.stroke();

      // Knee joint
      ctx.translate(0, 88);
      ctx.rotate(kneeAngle);

      // Shin covered in Golden Sun Greaves (Ran-Paduka Armor)
      const greaveGrad = ctx.createLinearGradient(-13, 0, 13, 85);
      greaveGrad.addColorStop(0, '#fef08a');
      greaveGrad.addColorStop(0.4, '#facc15');
      greaveGrad.addColorStop(1, '#a16207');

      ctx.fillStyle = greaveGrad;
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2.0;

      ctx.beginPath();
      ctx.moveTo(-13, 0);
      ctx.quadraticCurveTo(-16, 45, -11, 85);
      ctx.lineTo(11, 85);
      ctx.quadraticCurveTo(16, 45, 13, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sun emblem engraved on center shin
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(0, 42, 5, 0, Math.PI * 2);
      ctx.fill();

      // Studded Battle Sandals / Boots
      ctx.translate(0, 85);
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.roundRect(-12, 12, 38, 8, 3);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.stroke();

    } else if (type === 'RAMA_SILK_DHOTI') {
      // Lord Ram: Golden-Yellow Silk Pitambar Dhoti & Royal Paduka Sandals
      const dhotiGrad = ctx.createLinearGradient(-18, 0, 18, 90);
      dhotiGrad.addColorStop(0, '#fef08a');
      dhotiGrad.addColorStop(0.4, '#facc15');
      dhotiGrad.addColorStop(1, '#ca8a04');

      ctx.fillStyle = dhotiGrad;
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 2.2;

      // Silk Thigh Draping
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

      // Lower Pleated Silk Shin
      ctx.fillStyle = dhotiGrad;
      ctx.beginPath();
      ctx.moveTo(-13, 0);
      ctx.quadraticCurveTo(-16, 45, -11, 85);
      ctx.lineTo(11, 85);
      ctx.quadraticCurveTo(16, 45, 13, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Red & Gold Zari Hem Border
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-11, 78, 22, 6);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-11, 80, 22, 2);

      // Royal Paduka Sandals
      ctx.translate(0, 85);
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(-12, 14, 38, 5, 2);
      ctx.fill();
      // Golden Toe Knob
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(14, 11, 3.5, 0, Math.PI * 2);
      ctx.fill();

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
    const sway = this.bones.hairSway || 0;
    const hairColor = this.profile.hair?.color || '#18181b';

    const hairGrad = ctx.createLinearGradient(0, -160, 0, 120);
    hairGrad.addColorStop(0, '#020306');
    hairGrad.addColorStop(0.55, hairColor);
    hairGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = hairGrad;

    if (hairStyle === 'PONYTAIL') {
      // High Arching Ponytail Plume with Physics Sway
      ctx.save();
      ctx.translate(0, -170);
      ctx.rotate((sway * 0.04) + (this.bones.headAngle || 0) * 0.6);

      // Tail volume
      ctx.beginPath();
      ctx.moveTo(-10, -5);
      ctx.quadraticCurveTo(-28 + sway * 0.5, 45, -16 + sway * 1.2, 110);
      ctx.quadraticCurveTo(0 + sway * 0.9, 125, 12 + sway * 0.6, 95);
      ctx.quadraticCurveTo(22 + sway * 0.3, 45, 10, -5);
      ctx.closePath();
      ctx.fill();

      // Hair strands highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-4, 10);
      ctx.quadraticCurveTo(-15 + sway * 0.4, 55, -8 + sway * 0.9, 100);
      ctx.moveTo(3, 10);
      ctx.quadraticCurveTo(12 + sway * 0.3, 55, 4 + sway * 0.7, 90);
      ctx.stroke();

      // Scrunchie tie band
      ctx.fillStyle = this.profile.torso?.trim || '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.0;
      ctx.stroke();
      ctx.restore();

    } else if (hairStyle === 'LONG_WAVES') {
      // Cascading S-Curve Waves with Layered Highlights
      // Left Cascading Wave
      ctx.beginPath();
      ctx.moveTo(-52, -150);
      ctx.quadraticCurveTo(-98 + sway * 0.8, -40, -82 + sway * 1.2, 85);
      ctx.quadraticCurveTo(-65 + sway * 0.6, 125, -45 + sway * 0.4, 95);
      ctx.quadraticCurveTo(-62 + sway * 0.4, 30, -32, -100);
      ctx.closePath();
      ctx.fill();

      // Right Cascading Wave
      ctx.beginPath();
      ctx.moveTo(52, -150);
      ctx.quadraticCurveTo(98 + sway * 0.8, -40, 82 + sway * 1.2, 85);
      ctx.quadraticCurveTo(65 + sway * 0.6, 125, 45 + sway * 0.4, 95);
      ctx.quadraticCurveTo(62 + sway * 0.4, 30, 32, -100);
      ctx.closePath();
      ctx.fill();

      // Wave Sheen Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-60, -90);
      ctx.quadraticCurveTo(-82 + sway * 0.7, -10, -68 + sway * 0.9, 65);
      ctx.moveTo(60, -90);
      ctx.quadraticCurveTo(82 + sway * 0.7, -10, 68 + sway * 0.9, 65);
      ctx.stroke();

    } else if (hairStyle === 'WARRIOR_HALF_KNOT') {
      // Karna: Flowing Dark Warrior Mane & Half-Knot Ponytail with Golden Ring Tie
      ctx.save();
      ctx.translate(0, -165);
      ctx.rotate((sway * 0.05) + (this.bones.headAngle || 0) * 0.5);

      // Trailing Warrior Locks
      ctx.beginPath();
      ctx.moveTo(-16, -5);
      ctx.quadraticCurveTo(-45 + sway * 0.7, 50, -32 + sway * 1.3, 140);
      ctx.quadraticCurveTo(0 + sway * 0.9, 155, 25 + sway * 0.7, 125);
      ctx.quadraticCurveTo(38 + sway * 0.4, 50, 16, -5);
      ctx.closePath();
      ctx.fill();

      // Gold Filigree Warrior Band Tie
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-16, -5, 32, 7);
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-16, -5, 32, 7);
      ctx.restore();

    } else if (hairStyle === 'ROYAL_ASCETIC_LOCKS') {
      // Lord Ram: Flowing Divine Princely Locks interwoven with Pearl Strings
      ctx.save();
      ctx.translate(0, -160);

      // Flowing Left Hair Locks
      ctx.beginPath();
      ctx.moveTo(-45, -10);
      ctx.quadraticCurveTo(-75 + sway * 0.6, 50, -55 + sway * 1.1, 135);
      ctx.quadraticCurveTo(-35 + sway * 0.5, 145, -25, 95);
      ctx.quadraticCurveTo(-35, 40, -20, -10);
      ctx.closePath();
      ctx.fill();

      // Flowing Right Hair Locks
      ctx.beginPath();
      ctx.moveTo(45, -10);
      ctx.quadraticCurveTo(75 + sway * 0.6, 50, 55 + sway * 1.1, 135);
      ctx.quadraticCurveTo(35 + sway * 0.5, 145, 25, 95);
      ctx.quadraticCurveTo(35, 40, 20, -10);
      ctx.closePath();
      ctx.fill();

      // Pearl Strings hanging along the locks
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-35, 10); ctx.quadraticCurveTo(-50 + sway * 0.4, 70, -38 + sway * 0.8, 120);
      ctx.moveTo(35, 10); ctx.quadraticCurveTo(50 + sway * 0.4, 70, 38 + sway * 0.8, 120);
      ctx.stroke();
      ctx.restore();

    } else {
      // Sleek Bob / Medium Back Locks
      ctx.beginPath();
      ctx.moveTo(-54, -150);
      ctx.quadraticCurveTo(-80 + sway * 0.5, -45, -68 + sway * 0.7, 45);
      ctx.quadraticCurveTo(-45, 30, -32, -100);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(54, -150);
      ctx.quadraticCurveTo(80 + sway * 0.5, -45, 68 + sway * 0.7, 45);
      ctx.quadraticCurveTo(45, 30, 32, -100);
      ctx.closePath();
      ctx.fill();
    }

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

    } else if (outfitType === 'KAVACHA_GOLD_ARMOR') {
      // Celestial Kavacha - Indestructible Fused Sun Armor of Karna (Mahabharata)
      const goldGrad = ctx.createLinearGradient(-85, -115, 85, 120);
      goldGrad.addColorStop(0, '#fef08a');
      goldGrad.addColorStop(0.35, '#facc15');
      goldGrad.addColorStop(0.75, '#eab308');
      goldGrad.addColorStop(1, '#a16207');

      ctx.fillStyle = goldGrad;
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 3.2;

      // Sculpted Muscular Cuirass
      ctx.beginPath();
      ctx.moveTo(-72, -112);
      ctx.quadraticCurveTo(0, -118, 72, -112);
      ctx.quadraticCurveTo(86, -50, 80, 5);
      ctx.quadraticCurveTo(72, 65, 58, 120);
      ctx.lineTo(-58, 120);
      ctx.quadraticCurveTo(-72, 65, -80, 5);
      ctx.quadraticCurveTo(-86, -50, -72, -112);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Surya Radiant Sun Medallion (Solar Plexus)
      ctx.save();
      ctx.translate(0, -32);
      // Radiating golden sunbeams
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.2;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 16, Math.sin(a) * 16);
        ctx.lineTo(Math.cos(a) * 34, Math.sin(a) * 34);
        ctx.stroke();
      }
      // Inner glowing core
      const sunCore = ctx.createRadialGradient(0, 0, 4, 0, 0, 18);
      sunCore.addColorStop(0, '#ffffff');
      sunCore.addColorStop(0.35, '#fef08a');
      sunCore.addColorStop(0.75, '#f59e0b');
      sunCore.addColorStop(1, '#dc2626');
      ctx.fillStyle = sunCore;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2.0;
      ctx.stroke();
      ctx.restore();

      // Pectoral plate anatomical contouring
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(-45, -60); ctx.quadraticCurveTo(-22, -15, 0, -22);
      ctx.moveTo(45, -60); ctx.quadraticCurveTo(22, -15, 0, -22);
      // Abdominal plate divisions
      ctx.moveTo(0, -12); ctx.lineTo(0, 95);
      ctx.moveTo(-28, 20); ctx.lineTo(28, 20);
      ctx.moveTo(-24, 55); ctx.lineTo(24, 55);
      ctx.stroke();

      // Golden Pauldrons (Shoulder Guards)
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 2.2;
      [-72, 72].forEach(px => {
        ctx.beginPath();
        ctx.arc(px, -95, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

    } else if (outfitType === 'RAMA_PITAMBAR_SILK') {
      // Lord Ram (Ramayana) - Cloud-Blue Complexion (Megha Shyam) & Yellow Pitambar Silk Sash
      const skinGrad = ctx.createLinearGradient(-70, -112, 70, 120);
      skinGrad.addColorStop(0, '#3b82f6');
      skinGrad.addColorStop(0.5, '#2563eb');
      skinGrad.addColorStop(1, '#1d4ed8');

      ctx.fillStyle = skinGrad;
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2.0;

      // Divine Torso
      ctx.beginPath();
      ctx.moveTo(-68, -112);
      ctx.quadraticCurveTo(0, -116, 68, -112);
      ctx.quadraticCurveTo(80, -45, 74, 15);
      ctx.lineTo(56, 120);
      ctx.lineTo(-56, 120);
      ctx.lineTo(-74, 15);
      ctx.quadraticCurveTo(-80, -45, -68, -112);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sacred Yellow Pitambar Silk Sash draped diagonally across chest
      const silkGrad = ctx.createLinearGradient(-60, -112, 60, 110);
      silkGrad.addColorStop(0, '#fef08a');
      silkGrad.addColorStop(0.4, '#facc15');
      silkGrad.addColorStop(1, '#ca8a04');

      ctx.fillStyle = silkGrad;
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(-65, -112);
      ctx.lineTo(-30, -112);
      ctx.quadraticCurveTo(15, 0, 68, 85);
      ctx.lineTo(45, 120);
      ctx.quadraticCurveTo(-15, 15, -65, -112);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Red & gold embroidered sash borders
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-30, -112);
      ctx.quadraticCurveTo(15, 0, 68, 85);
      ctx.stroke();

      // Muktahara (Pure White Pearl Strands)
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 4.0;
      ctx.beginPath();
      ctx.arc(0, -100, 32, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -90, 44, 0.3, Math.PI - 0.3);
      ctx.stroke();

      // Kaustubha Radiant Center Gem
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -45, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.0;
      ctx.stroke();

    } else if (outfitType === 'VINTAGE_1950S_SUIT') {
      // 1950s Mid-Century Tailored Tweed Blazer, Waistcoat & Silk Tie
      const suitGrad = ctx.createLinearGradient(-75, -115, 75, 120);
      suitGrad.addColorStop(0, '#475569');
      suitGrad.addColorStop(0.5, '#334155');
      suitGrad.addColorStop(1, '#1e293b');

      ctx.fillStyle = suitGrad;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.2;

      // Heavy Wool Blazer Silhouette
      ctx.beginPath();
      ctx.moveTo(-72, -112);
      ctx.quadraticCurveTo(0, -116, 72, -112);
      ctx.quadraticCurveTo(86, -40, 80, 20);
      ctx.lineTo(62, 120);
      ctx.lineTo(-62, 120);
      ctx.lineTo(-80, 20);
      ctx.quadraticCurveTo(-86, -40, -72, -112);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Starched Crisp White Shirt (Center triangle)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-22, -112);
      ctx.lineTo(22, -112);
      ctx.lineTo(0, -25);
      ctx.closePath();
      ctx.fill();

      // Pointed 1950s Shirt Collar Tabs
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-26, -112); ctx.lineTo(-8, -82); ctx.lineTo(-3, -112); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(26, -112); ctx.lineTo(8, -82); ctx.lineTo(3, -112); ctx.closePath(); ctx.fill(); ctx.stroke();

      // Diagonal Crimson & Gold Striped 1950s Silk Tie
      const tieGrad = ctx.createLinearGradient(-8, -100, 8, 45);
      tieGrad.addColorStop(0, '#b91c1c');
      tieGrad.addColorStop(0.5, '#991b1b');
      tieGrad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = tieGrad;
      ctx.beginPath();
      ctx.moveTo(-6, -92);
      ctx.lineTo(6, -92);
      ctx.lineTo(10, 42);
      ctx.lineTo(0, 56);
      ctx.lineTo(-10, 42);
      ctx.closePath();
      ctx.fill();
      // Vintage Tie Gold Stripes
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.2;
      for (let ty = -80; ty <= 30; ty += 18) {
        ctx.beginPath();
        ctx.moveTo(-7, ty);
        ctx.lineTo(7, ty + 10);
        ctx.stroke();
      }

      // Charcoal 4-Button Waistcoat (Vest) over shirt
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(-34, -40);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-16, 115);
      ctx.lineTo(16, 115);
      ctx.lineTo(14, 0);
      ctx.lineTo(34, -40);
      ctx.lineTo(44, 115);
      ctx.lineTo(-44, 115);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Vest Horn Buttons
      ctx.fillStyle = '#cbd5e1';
      for (let vy = 15; vy <= 95; vy += 24) {
        ctx.beginPath();
        ctx.arc(0, vy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Wide Notched Lapels of Blazer
      ctx.fillStyle = suitGrad;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.0;
      // Left Lapel
      ctx.beginPath();
      ctx.moveTo(-70, -112);
      ctx.lineTo(-24, -45);
      ctx.lineTo(-45, -35);
      ctx.lineTo(-20, 25);
      ctx.lineTo(-40, 30);
      ctx.lineTo(-58, -35);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Right Lapel
      ctx.beginPath();
      ctx.moveTo(70, -112);
      ctx.lineTo(24, -45);
      ctx.lineTo(45, -35);
      ctx.lineTo(20, 25);
      ctx.lineTo(40, 30);
      ctx.lineTo(58, -35);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Folded Pocket Square (White Handkerchief) in Breast Pocket
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-56, 10, 22, 4);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-54, 10); ctx.lineTo(-46, -2); ctx.lineTo(-42, 6); ctx.lineTo(-38, -5); ctx.lineTo(-34, 10); ctx.closePath();
      ctx.fill();

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

    // Soft Ambient Hairline Contact Shadow cast onto upper forehead
    const hairlineShadow = ctx.createLinearGradient(0, -92, 0, -68);
    hairlineShadow.addColorStop(0, 'rgba(15, 23, 42, 0.32)');
    hairlineShadow.addColorStop(1, 'transparent');
    ctx.fillStyle = hairlineShadow;
    ctx.beginPath();
    ctx.ellipse(0, -78, 42, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft Chin Cleft & Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 64, 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle Cheekbone Warm Highlights & Natural Healthy Blush
    const cheekGradL = ctx.createRadialGradient(-28, -2, 2, -28, -2, 20);
    cheekGradL.addColorStop(0, 'rgba(244, 63, 94, 0.24)');
    cheekGradL.addColorStop(0.6, (skin.highlight || '#fff') + '44');
    cheekGradL.addColorStop(1, 'transparent');
    ctx.fillStyle = cheekGradL;
    ctx.beginPath();
    ctx.arc(-28, -2, 20, 0, Math.PI * 2);
    ctx.fill();

    const cheekGradR = ctx.createRadialGradient(28, -2, 2, 28, -2, 20);
    cheekGradR.addColorStop(0, 'rgba(244, 63, 94, 0.24)');
    cheekGradR.addColorStop(0.6, (skin.highlight || '#fff') + '44');
    cheekGradR.addColorStop(1, 'transparent');
    ctx.fillStyle = cheekGradR;
    ctx.beginPath();
    ctx.arc(28, -2, 20, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted Human Ears with Concha & Antihelix & Subsurface Glow
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

      // Subsurface ear rim glow (translucent ear cartilage)
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.28)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(earX, -2, 9, 15, side * 0.15, -Math.PI * 0.45, Math.PI * 0.45);
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
    if (fh === 'SHORT_STUBBLE' || fh === 'WARRIOR_STUBBLE') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 50, 28, 0.1, Math.PI - 0.1);
      ctx.fill();
    } else if (fh === 'VINTAGE_MOUSTACHE') {
      // 1950s Trimmed Pencil Moustache
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(-18, 30);
      ctx.quadraticCurveTo(-8, 25, 0, 27);
      ctx.quadraticCurveTo(8, 25, 18, 30);
      ctx.quadraticCurveTo(10, 34, 0, 31);
      ctx.quadraticCurveTo(-10, 34, -18, 30);
      ctx.closePath();
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
    } else if (m === 'SURYA_TILAK') {
      // Karna: Golden Sun Chandan Tilak with radiating solar crest
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, -56, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, -66); ctx.lineTo(0, -46);
      ctx.moveTo(-9, -56); ctx.lineTo(9, -56);
      ctx.stroke();
    } else if (m === 'RAMA_URDHVA_PUNDRA') {
      // Lord Ram: Sacred White Chandan U-Tilak with Vermilion Kumkuma line
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-7, -72);
      ctx.quadraticCurveTo(-8, -48, 0, -44);
      ctx.quadraticCurveTo(8, -48, 7, -72);
      ctx.stroke();
      // Center vermilion red line
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, -70);
      ctx.lineTo(0, -44);
      ctx.stroke();
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

      // Eye Clip for Iris, Pupil & Cornea Shading
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
      irisGrad.addColorStop(0.25, eyes.glow || eyes.iris || '#3e2723');
      irisGrad.addColorStop(0.72, eyes.iris || '#3e2723');
      irisGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.arc(lookX, lookY, 6.1, 0, Math.PI * 2);
      ctx.fill();

      // Delicate Iris Radial Fibers (16 Micro-Striations for Soulful Living Eyes)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.lineWidth = 0.7;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        ctx.beginPath();
        ctx.moveTo(lookX + Math.cos(a) * 2.6, lookY + Math.sin(a) * 2.6);
        ctx.lineTo(lookX + Math.cos(a) * 5.7, lookY + Math.sin(a) * 5.7);
        ctx.stroke();
      }

      // Pupillary Collarette Ring
      ctx.strokeStyle = (eyes.glow || '#f59e0b') + '66';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(lookX, lookY, 4.0, 0, Math.PI * 2);
      ctx.stroke();

      // Lower Iris Caustic Bounce Reflection (Living Inner Glow)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.26)';
      ctx.beginPath();
      ctx.ellipse(lookX, lookY + 3.2, 4.2, 1.8, 0, 0, Math.PI);
      ctx.fill();

      // Pupil with subtle breathing dilation
      const pupilRadius = 3.0 + Math.sin(this.time * 1.5) * 0.22;
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(lookX, lookY, pupilRadius, 0, Math.PI * 2);
      ctx.fill();

      // Upper Eyelid Cast Shadow across top of cornea (Realistic 3D Orbital Depth)
      const eyeLidShadow = ctx.createLinearGradient(0, -9, 0, 1.5);
      eyeLidShadow.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
      eyeLidShadow.addColorStop(1, 'transparent');
      ctx.fillStyle = eyeLidShadow;
      ctx.fillRect(-16, -10, 32, 11);

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

      // Wet Lower Waterline Gloss Highlight (Glistening living moisture)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(-11, 6.2);
      ctx.quadraticCurveTo(0, 8.5, 11, 6.2);
      ctx.stroke();

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
      // Natural closed resting lips with sculpted Cupid's bow, dual cushions & labiomental groove
      // Philtrum crest highlights
      ctx.strokeStyle = (skin.highlight || '#fff') + '88';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-1.8, -14); ctx.lineTo(-1.2, -4);
      ctx.moveTo(1.8, -14); ctx.lineTo(1.2, -4);
      ctx.stroke();

      // Labiomental groove (soft anatomical shadow under lower lip)
      ctx.fillStyle = skin.shadow + '55';
      ctx.beginPath();
      ctx.ellipse(0, 10.5, 7.5 * mw, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Upper lip (in soft ambient top shadow)
      ctx.fillStyle = '#9f1239'; // soft rose
      ctx.beginPath();
      ctx.moveTo(-15 * mw, 0);
      ctx.quadraticCurveTo(-6 * mw, -4.2, 0, -2.4);
      ctx.quadraticCurveTo(6 * mw, -4.2, 15 * mw, 0);
      ctx.quadraticCurveTo(0, 1.2, -15 * mw, 0);
      ctx.closePath();
      ctx.fill();

      // Lower lip fullness with dual cushions
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.moveTo(-14 * mw, 0);
      ctx.quadraticCurveTo(0, 1.0, 14 * mw, 0);
      ctx.quadraticCurveTo(0, 7.8, -14 * mw, 0);
      ctx.closePath();
      ctx.fill();

      // Dual pillowy specular gloss highlights (left & right cushions)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.beginPath();
      ctx.ellipse(-3.2 * mw, 3.8, 3.0, 1.4, -0.1, 0, Math.PI * 2);
      ctx.ellipse(3.2 * mw, 3.8, 3.0, 1.4, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Lip Corner Dimples (Commissures)
      ctx.fillStyle = skin.shadow;
      ctx.beginPath();
      ctx.arc(-15 * mw, 0, 1.2, 0, Math.PI * 2);
      ctx.arc(15 * mw, 0, 1.2, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Talking Mouth Cavity with Shaded Throat, Individual Incisors, and Tongue Sulcus
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

      // Upper Enamel Incisors (Translucent edge with central incisor separation)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-8.5 * mw, -4 * jaw, 17 * mw, 6.5 * jaw, [0, 0, 3, 3]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.7)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Central incisor separation line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.beginPath();
      ctx.moveTo(0, -4 * jaw);
      ctx.lineTo(0, 2.2 * jaw);
      ctx.stroke();

      // Tongue Articulation with central groove (sulcus) and soft gloss bounce
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(0, 12 * jaw, 7.5 * mw, 4.5 * jaw, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tongue central groove (sulcus)
      ctx.strokeStyle = 'rgba(190, 18, 60, 0.6)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(0, 9 * jaw);
      ctx.lineTo(0, 14 * jaw);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 10.5 * jaw, 4.2 * mw, 2.0 * jaw, 0, 0, Math.PI * 2);
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
        // Modern Fade with Volumetric Textured Quiff & Precision Side Fade
        ctx.beginPath();
        ctx.moveTo(-48, -75);
        ctx.quadraticCurveTo(-46, -98, 0, -104);
        ctx.quadraticCurveTo(46, -98, 48, -75);
        ctx.quadraticCurveTo(28, -66, 0, -74);
        ctx.quadraticCurveTo(-28, -66, -48, -75);
        ctx.closePath();
        ctx.fill();

        // High skin fade sideburn gradients
        const fadeL = ctx.createLinearGradient(-48, -75, -36, -75);
        fadeL.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
        fadeL.addColorStop(1, 'transparent');
        ctx.fillStyle = fadeL;
        ctx.fillRect(-48, -80, 12, 24);

        // Individual scissor-textured quiff locks on top
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 1.4;
        for (let s = -28; s <= 28; s += 8) {
          ctx.beginPath();
          ctx.moveTo(s, -102);
          ctx.lineTo(s * 0.75, -82);
          ctx.stroke();
        }

        // Anisotropic Crown Sheen Highlight
        const sheen = ctx.createLinearGradient(-25, -96, 25, -96);
        sheen.addColorStop(0, 'transparent');
        sheen.addColorStop(0.5, 'rgba(255, 255, 255, 0.28)');
        sheen.addColorStop(1, 'transparent');
        ctx.fillStyle = sheen;
        ctx.fillRect(-28, -98, 56, 5);

      } else if (hairStyle === 'SLEEK_BOB') {
        // Sleek Bob with Inward-Curling Cheek Framing Locks
        ctx.beginPath();
        ctx.moveTo(-48, -75);
        ctx.quadraticCurveTo(-54, -20, -44, 28);
        ctx.quadraticCurveTo(-34, -28, -22, -68);
        ctx.quadraticCurveTo(0, -82, 22, -68);
        ctx.quadraticCurveTo(34, -28, 44, 28);
        ctx.quadraticCurveTo(54, -20, 48, -75);
        ctx.quadraticCurveTo(0, -105, -48, -75);
        ctx.closePath();
        ctx.fill();

        // Inner lock edge highlights
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-40, -50);
        ctx.quadraticCurveTo(-48, 0, -42, 24);
        ctx.moveTo(40, -50);
        ctx.quadraticCurveTo(48, 0, 42, 24);
        ctx.stroke();

        // Crown sheen ribbon
        const sheen = ctx.createLinearGradient(-30, -96, 30, -96);
        sheen.addColorStop(0, 'transparent');
        sheen.addColorStop(0.5, 'rgba(255, 255, 255, 0.32)');
        sheen.addColorStop(1, 'transparent');
        ctx.fillStyle = sheen;
        ctx.fillRect(-32, -98, 64, 6);

      } else if (hairStyle === 'LONG_WAVES') {
        // Long Waves Framing Strands with S-Curve Wisps
        ctx.beginPath();
        ctx.moveTo(-48, -75);
        ctx.quadraticCurveTo(-55, -20, -40, 35);
        ctx.quadraticCurveTo(-30, -25, -20, -68);
        ctx.quadraticCurveTo(0, -80, 20, -68);
        ctx.quadraticCurveTo(30, -25, 40, 35);
        ctx.quadraticCurveTo(55, -20, 48, -75);
        ctx.quadraticCurveTo(0, -104, -48, -75);
        ctx.closePath();
        ctx.fill();

        // S-Curve wave shine accents
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-36, -45);
        ctx.quadraticCurveTo(-46, -10, -38, 25);
        ctx.moveTo(36, -45);
        ctx.quadraticCurveTo(46, -10, 38, 25);
        ctx.stroke();

      } else if (hairStyle === 'PONYTAIL') {
        // Pulled back sleek hair sweep lines with high bun base
        ctx.beginPath();
        ctx.moveTo(-48, -75);
        ctx.quadraticCurveTo(0, -102, 48, -75);
        ctx.quadraticCurveTo(0, -78, -48, -75);
        ctx.fill();

        // Radial sweep lines converging back towards high ponytail
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.0;
        for (let a = -35; a <= 35; a += 14) {
          ctx.beginPath();
          ctx.moveTo(a, -78);
          ctx.lineTo(a * 0.3, -98);
          ctx.stroke();
        }

        // Ponytail base gathering
        ctx.beginPath();
        ctx.arc(0, -102, 14, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Side Part / Gentleman's Pompadour
        ctx.beginPath();
        ctx.moveTo(-48, -75);
        ctx.quadraticCurveTo(-25, -60, 0, -74);
        ctx.quadraticCurveTo(28, -62, 48, -75);
        ctx.quadraticCurveTo(15, -104, -48, -75);
        ctx.closePath();
        ctx.fill();

        // Comb part line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-24, -72);
        ctx.lineTo(-20, -96);
        ctx.stroke();
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

    } else if (hg === 'SURYA_WARRIOR_CROWN') {
      // Karna: Golden Sun Warrior Crown (Kiritam) with Radiating Solar Spikes & Sun Medallion
      const crownGrad = ctx.createLinearGradient(-50, -170, 50, -75);
      crownGrad.addColorStop(0, '#fef08a');
      crownGrad.addColorStop(0.35, '#facc15');
      crownGrad.addColorStop(0.8, '#eab308');
      crownGrad.addColorStop(1, '#a16207');

      ctx.fillStyle = crownGrad;
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2.5;

      // Crown Silhouette with 5 Radiant Solar Peaks
      ctx.beginPath();
      ctx.moveTo(-52, -75);
      ctx.lineTo(-44, -125);
      ctx.lineTo(-24, -145);
      ctx.lineTo(-18, -120);
      ctx.lineTo(0, -175); // Tall Center Sun Peak
      ctx.lineTo(18, -120);
      ctx.lineTo(24, -145);
      ctx.lineTo(44, -125);
      ctx.lineTo(52, -75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front Solar Disk Medallion at Brow
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -96, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Etched Sunbeam Filigree
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.2;
      for (let sx = -35; sx <= 35; sx += 14) {
        ctx.beginPath();
        ctx.moveTo(sx, -76);
        ctx.lineTo(sx * 0.4, -135);
        ctx.stroke();
      }

    } else if (hg === 'AYODHYA_PRINCE_DIADEM') {
      // Lord Ram: Ayodhya Prince Diadem Crest with Pearl Strands & Sacred Jewel
      const diademGrad = ctx.createLinearGradient(-45, -140, 45, -75);
      diademGrad.addColorStop(0, '#fef08a');
      diademGrad.addColorStop(0.4, '#facc15');
      diademGrad.addColorStop(1, '#ca8a04');

      ctx.fillStyle = diademGrad;
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.0;

      // Princely Diadem Peak
      ctx.beginPath();
      ctx.moveTo(-48, -75);
      ctx.quadraticCurveTo(-25, -115, 0, -145);
      ctx.quadraticCurveTo(25, -115, 48, -75);
      ctx.quadraticCurveTo(0, -82, -48, -75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Delicate Pearl Strings draping across brow
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(0, -84, 38, 0.4, Math.PI - 0.4);
      ctx.stroke();

      // Sapphire / Celestial Blue Center Gem
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(0, -105, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

    } else if (hg === 'FEDORA_HAT') {
      // 1950s Mid-Century Wool Felt Fedora Hat with Grosgrain Band & Feather Accent
      const hatFeltGrad = ctx.createLinearGradient(-65, -140, 65, -60);
      hatFeltGrad.addColorStop(0, '#334155');
      hatFeltGrad.addColorStop(0.5, '#1e293b');
      hatFeltGrad.addColorStop(1, '#0f172a');

      // 1. Wide Curved Fedora Brim
      ctx.fillStyle = hatFeltGrad;
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.ellipse(0, -72, 64, 16, -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 2. Crown with Center Teardrop Indentation (Pinch Crown)
      ctx.fillStyle = hatFeltGrad;
      ctx.beginPath();
      ctx.moveTo(-44, -76);
      ctx.quadraticCurveTo(-46, -125, -28, -132);
      ctx.quadraticCurveTo(0, -118, 28, -132);
      ctx.quadraticCurveTo(46, -125, 44, -76);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Teardrop crown top crease shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, -125, 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Satin Grosgrain Hatband
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.moveTo(-45, -82);
      ctx.quadraticCurveTo(0, -88, 45, -82);
      ctx.lineTo(44, -73);
      ctx.quadraticCurveTo(0, -79, -44, -73);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 4. Subtle Crimson Feather Accent in hatband
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(-32, -80);
      ctx.quadraticCurveTo(-40, -100, -36, -112);
      ctx.stroke();

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

    // 2. Modern Accessories: Studio Headphones around neck (High-Fidelity)
    if (this.profile.accessories === 'STUDIO_HEADPHONES') {
      ctx.save();
      ctx.translate(0, 52); // Resting comfortably around the neck

      // Headphone padded mesh band with stitch segments
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(0, -38, 40, 0.4, Math.PI - 0.4);
      ctx.stroke();

      // Cushion stitch accents on band
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      for (let ba = 0.6; ba < Math.PI - 0.6; ba += 0.35) {
        ctx.beginPath();
        ctx.moveTo(Math.cos(ba) * 36, -38 + Math.sin(ba) * 36);
        ctx.lineTo(Math.cos(ba) * 44, -38 + Math.sin(ba) * 44);
        ctx.stroke();
      }

      // Brushed Steel Adjustment Sliders
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-45, -34, 4, 10);
      ctx.fillRect(41, -34, 4, 10);

      // Left Ear Cup (Ergonomic cushion + glowing LED ring)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-48, -25, 16, 28, 7);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Glowing Cyan Audio Ring
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(-40, -11, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right Ear Cup
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(32, -25, 16, 28, 7);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(40, -11, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

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

    // 5. Render Held Tool / Prop dynamically attached to hand
    const itemToHold = this.heldItem || this.profile?.heldItem;
    if (itemToHold && itemToHold !== 'NONE' && side === (this.propSide || 1)) {
      this.renderHeldProp(ctx, itemToHold, side);
    }

    ctx.restore();
  }

  /**
   * Render Props and Held Tools (Divine Recurve Bow, 1950s Leather Briefcase,
   * Polished Walking Cane, Broadsword, Studio Microphone, Ancient Scroll)
   */
  renderHeldProp(ctx, propType, side = 1) {
    ctx.save();

    if (propType === 'BOW_AND_ARROW' || propType === 'VIJAYA_BOW' || propType === 'KODANDA_BOW') {
      // Recurve Divine Bow (Karna's Vijaya / Rama's Kodanda)
      ctx.translate(side === 1 ? -2 : 2, 8);
      ctx.rotate(side * 0.15);

      // Central Riser Grip
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-3.5, -12, 7, 24);
      // Gold Filigree Accent Bands
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-4.5, -14, 9, 3);
      ctx.fillRect(-4.5, 11, 9, 3);

      // Recurved Upper Bow Limb
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(-26, -75, 12, -145);
      ctx.stroke();
      // Upper Gold Nock Tip
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(12, -145, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Recurved Lower Bow Limb
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.quadraticCurveTo(-26, 75, 12, 145);
      ctx.stroke();
      // Lower Gold Nock Tip
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(12, 145, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Taut Celestial Bowstring
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(12, -145);
      ctx.lineTo(-10, 0);
      ctx.lineTo(12, 145);
      ctx.stroke();

      // Golden Sun Arrow Nocked on Rest
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-45, 0);
      ctx.lineTo(105, 0);
      ctx.stroke();

      // Sharp Radiant Arrowhead
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(105, 0);
      ctx.lineTo(90, -7);
      ctx.lineTo(93, 0);
      ctx.lineTo(90, 7);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Quiver Fletching Feathers
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(-45, 0);
      ctx.lineTo(-32, -5);
      ctx.lineTo(-24, 0);
      ctx.lineTo(-32, 5);
      ctx.closePath();
      ctx.fill();

    } else if (propType === 'VINTAGE_BRIEFCASE') {
      // 1950s Mid-Century Leather Executive Attache Case
      ctx.translate(side === 1 ? -4 : 4, 12);

      // Brass Handle Hardware
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 4, 7, Math.PI, 0);
      ctx.stroke();

      // Leather Case Body hanging below hand
      ctx.translate(0, 10);
      const caseGrad = ctx.createLinearGradient(-28, 0, 28, 42);
      caseGrad.addColorStop(0, '#9a3412');
      caseGrad.addColorStop(0.5, '#78350f');
      caseGrad.addColorStop(1, '#451a03');

      ctx.fillStyle = caseGrad;
      ctx.beginPath();
      ctx.roundRect(-28, 0, 56, 42, 4);
      ctx.fill();
      ctx.strokeStyle = '#291206';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Edge Stitching
      ctx.strokeStyle = 'rgba(254, 215, 170, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-26, 2, 52, 38);

      // Corner Brass Protectors
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-28, 36, 7, 6);
      ctx.fillRect(21, 36, 7, 6);

      // Twin Brass Lock Buckles
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-16, 8, 6, 9);
      ctx.fillRect(10, 8, 6, 9);
      // Center Lock Plate
      ctx.beginPath();
      ctx.arc(0, 12, 3, 0, Math.PI * 2);
      ctx.fill();

    } else if (propType === 'WALKING_CANE') {
      // 1950s Polished Mahogany Walking Stick with Curved Brass Derby Handle
      ctx.translate(side === 1 ? -2 : 2, 5);

      // Curved Brass Handle resting in fingers
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 6.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-15, -18, -28, -8);
      ctx.stroke();

      // Polished Brass Knob Accent
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-28, -8, 4, 0, Math.PI * 2);
      ctx.fill();

      // Mahogany Wooden Shaft extending straight to floor
      const caneGrad = ctx.createLinearGradient(-3, 0, 3, 145);
      caneGrad.addColorStop(0, '#451a03');
      caneGrad.addColorStop(1, '#1c1917');

      ctx.fillStyle = caneGrad;
      ctx.fillRect(-2.5, 0, 5, 150);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.6;
      ctx.strokeRect(-2.5, 0, 5, 150);

      // Rubber Tip Ferrule
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-3.5, 146, 7, 6);

    } else if (propType === 'SWORD') {
      // Steel Broadsword with Ornate Crossguard & Pommel
      ctx.translate(side === 1 ? -2 : 2, 8);
      ctx.rotate(-0.2);

      // Grip in Hand
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-3.5, -12, 7, 24);

      // Golden Crossguard
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.roundRect(-20, -15, 40, 5, 2);
      ctx.fill();
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Steel Blade extending upwards
      const bladeGrad = ctx.createLinearGradient(0, -15, 0, -125);
      bladeGrad.addColorStop(0, '#e2e8f0');
      bladeGrad.addColorStop(0.5, '#f8fafc');
      bladeGrad.addColorStop(1, '#94a3b8');

      ctx.fillStyle = bladeGrad;
      ctx.beginPath();
      ctx.moveTo(-6, -15);
      ctx.lineTo(-5, -115);
      ctx.lineTo(0, -128);
      ctx.lineTo(5, -115);
      ctx.lineTo(6, -15);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Central Fuller Ridge
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(0, -100);
      ctx.stroke();

      // Golden Pommel
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, 16, 5.5, 0, Math.PI * 2);
      ctx.fill();

    } else if (propType === 'MICROPHONE') {
      // Vocal Studio Microphone
      ctx.translate(side === 1 ? -2 : 2, 6);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-3, -2, 6, 26);
      // Metallic Mesh Head
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.ellipse(0, -9, 7, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.stroke();

    } else if (propType === 'BOOK_SCROLL') {
      // Classical Rolled Manuscript / Scroll
      ctx.translate(side === 1 ? -2 : 2, 8);
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.roundRect(-8, -16, 16, 32, 4);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      // Red Silk Ribbon Tie
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-8, -2, 16, 4);
    }

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
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CharacterRig, CHARACTER_PROFILES };
}
