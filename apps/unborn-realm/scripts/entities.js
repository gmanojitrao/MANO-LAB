/**
 * PROJECT: THE UNBORN REALM (ORIGIN-001)
 * entities.js - The 120 Inhabitants of the Synthetic Universe
 * 
 * Five distinct forms of existence:
 * - Auraliths (24): Geometric harmonic anchors, architectural resonant nodes
 * - Veskari (24): Luminous relational weavers, filament travelers
 * - Oroth (24): Dense crystalline memory monoliths, high meaning density
 * - Nemori (24): Ephemeral catalysts flickering between distinction & unformed
 * - Ilyr (24): Dual-phase paradoxical beings oscillating into the unseen
 */

class RealmEntityManager {
  constructor(physics, cosmology) {
    this.physics = physics;
    this.cosmology = cosmology;
    this.entities = [];
    this.selectedEntity = null;

    // Entity category definitions
    this.CATEGORIES = {
      Auraliths: {
        name: 'Auraliths',
        role: 'Harmonic Resonators & Spatial Anchors',
        primaryDimension: 'MANIFEST',
        baseColor: '#10b981',
        secondaryColor: '#34d399',
        shape: 'octahedron',
        baseCoherence: 0.88,
        baseMeaning: 0.9,
        generationRate: 0.0009,
        mobility: 0.4,
        description: 'Vast polyhedral consciousnesses that emit continuous harmonic fields, anchoring nearby space against entropy.'
      },
      Veskari: {
        name: 'Veskari',
        role: 'Relational Weavers & Filament Transmitters',
        primaryDimension: 'WEAVE',
        baseColor: '#06b6d4',
        secondaryColor: '#67e8f9',
        shape: 'torus_tendril',
        baseCoherence: 0.76,
        baseMeaning: 0.65,
        generationRate: 0.0007,
        mobility: 1.6,
        description: 'Flowing multi-stranded ribbons that knit relational threads between isolated entities across dimensions.'
      },
      Oroth: {
        name: 'Oroth',
        role: 'Memory Monoliths & Pattern Preservers',
        primaryDimension: 'ECHO',
        baseColor: '#f59e0b',
        secondaryColor: '#fcd34d',
        shape: 'prismatic_column',
        baseCoherence: 0.92,
        baseMeaning: 1.45,
        generationRate: 0.0004,
        mobility: 0.2,
        description: 'Ancient angular monoliths holding vast sedimented chronicles. Their presence warps transition pressure with sheer meaning.'
      },
      Nemori: {
        name: 'Nemori',
        role: 'Proto-Form Catalysts & Differentiators',
        primaryDimension: 'UNFORMED',
        baseColor: '#8b5cf6',
        secondaryColor: '#c084fc',
        shape: 'stellar_shard',
        baseCoherence: 0.62,
        baseMeaning: 0.35,
        generationRate: 0.0012,
        mobility: 1.2,
        description: 'Flickering, high-frequency kinetic sparks that stimulate the emergence of new distinctions out of the void.'
      },
      Ilyr: {
        name: 'Ilyr',
        role: 'Paradox Vectors & Dimensional Voyagers',
        primaryDimension: 'UNSEEN',
        baseColor: '#ec4899',
        secondaryColor: '#f472b6',
        shape: 'hyper_folding',
        baseCoherence: 0.7,
        baseMeaning: 1.05,
        generationRate: 0.0008,
        mobility: 1.0,
        description: 'Non-Euclidean oscillating beings whose geometry shifts phase between the known realm and the uncharted exterior.'
      }
    };

    // Prefix seeds for Vareth-style naming
    this.NAME_PARTS = {
      prefixes: ['Vor', 'Zhor', 'Ael', 'Murn', 'Kael', 'Thy', 'Ozh', 'Ky', 'Res', 'Vel', 'Syr', 'Nal', 'Zhi', 'Pha', 'Xan'],
      roots: ['koran', 'lith', 'vesh', 'mor', 'ten', 'quor', 'dran', 'syl', 'vath', 'zenith', 'ryn', 'kresh', 'phir'],
      suffixes: ['aeth', 'en', 'is', 'or', 'um', 'il', 'oth', 'ai', 'ux', 'el', 'un', 'ar']
    };

    this.initEntities();
  }

  generateName(category, index) {
    const pref = this.NAME_PARTS.prefixes[(index * 7 + category.length) % this.NAME_PARTS.prefixes.length];
    const root = this.NAME_PARTS.roots[(index * 11 + 3) % this.NAME_PARTS.roots.length];
    const suff = this.NAME_PARTS.suffixes[(index * 13 + 5) % this.NAME_PARTS.suffixes.length];
    return `${pref}-${root}${suff}`;
  }

  /**
   * Generates the 120 initial distinct simulated entities (24 of each category)
   */
  initEntities() {
    this.entities = [];
    const categories = ['Auraliths', 'Veskari', 'Oroth', 'Nemori', 'Ilyr'];
    const countPerCat = 24;

    const varethKeys = typeof VARETH_GLYPHS !== 'undefined' ? Object.keys(VARETH_GLYPHS) : [
      'VOR', 'KAI', 'LETH', 'ZHOR', 'TAL', 'MURN', 'SAEL', 'SHUR', 'AETH', 'KRETH', 'NEM', 'OZH'
    ];

    categories.forEach((catKey, catIdx) => {
      const catDef = this.CATEGORIES[catKey];
      const prefix = catKey.substring(0, 3).toUpperCase();

      for (let i = 1; i <= countPerCat; i++) {
        const id = `${prefix}-${String(i).padStart(3, '0')}`;
        const name = this.generateName(catKey, i);

        // Position distribution according to native dimension and natural habitat
        const angle = (i / countPerCat) * Math.PI * 2 + (catIdx * 0.8);
        const radius = 60 + Math.random() * 180;
        const elevation = (Math.random() - 0.5) * 220;

        const x = Math.cos(angle) * radius;
        const y = elevation;
        const z = Math.sin(angle) * radius;

        // Starting known glyphs (each entity knows 3 to 6 foundational glyphs)
        const entityGlyphs = new Set();
        const glyphCount = 3 + Math.floor(Math.random() * 4);
        for (let g = 0; g < glyphCount; g++) {
          const randomGlyph = varethKeys[(i * 3 + g * 7 + catIdx * 5) % varethKeys.length];
          entityGlyphs.add(randomGlyph);
        }

        // Entity record
        const entity = {
          id: id,
          name: name,
          category: catKey,
          dimension: catDef.primaryDimension,
          nativeDimension: catDef.primaryDimension,
          x: x,
          y: y,
          z: z,
          vx: (Math.random() - 0.5) * 0.4 * catDef.mobility,
          vy: (Math.random() - 0.5) * 0.4 * catDef.mobility,
          vz: (Math.random() - 0.5) * 0.4 * catDef.mobility,
          coherence: +(catDef.baseCoherence + (Math.random() - 0.5) * 0.12).toFixed(3),
          meaningDensity: +(catDef.baseMeaning + (Math.random() - 0.5) * 0.15).toFixed(3),
          stability: 0.85,
          generationRate: catDef.generationRate,
          mobility: catDef.mobility,
          frequency: +(0.8 + Math.random() * 1.4).toFixed(2),
          harmonicPhase: Math.random() * Math.PI * 2,
          knownGlyphs: entityGlyphs,
          currentGoal: 'HARMONIZING',
          goalTimer: Math.random() * 10,
          currentFormation: null,
          generation: 1,
          lineage: `Prime Genesis [Epoch 0]`,
          utterance: '',
          utteranceMeaning: '',
          utteranceAge: 999,
          socialTension: 0,
          color: catDef.baseColor,
          glowColor: catDef.secondaryColor
        };

        // Synthesize initial utterance
        if (typeof VarethLanguage !== 'undefined') {
          const comp = VarethLanguage.composeUtterance(entity.knownGlyphs, 2);
          entity.utterance = comp.transcription;
          entity.utteranceMeaning = comp.meaning;
          entity.utteranceAge = 0;
        }

        this.entities.push(entity);
      }
    });
  }

  /**
   * Utility-based autonomous decision tree for each entity
   */
  updateCognition(entity, dt, allEntities) {
    entity.goalTimer = (entity.goalTimer || 0) - dt;
    entity.utteranceAge = (entity.utteranceAge || 0) + dt;

    // Periodically re-evaluate goals
    if (entity.goalTimer <= 0) {
      entity.goalTimer = 6 + Math.random() * 8; // Re-evaluate every 6-14s

      // Evaluate utility scores for behavioral directives
      const utilityScores = {
        HARMONIZING: 0.5,
        WEAVING_RELATION: 0.4,
        ANCHORING_MEMORY: 0.3,
        CATALYZING_UNFORMED: 0.2,
        EXPLORING_UNSEEN: 0.2,
        RESTING_COHERENCE: 0.1
      };

      // 1. If Coherence is dangerously low -> Prioritize RESTING_COHERENCE
      if (entity.coherence < 0.35) {
        utilityScores.RESTING_COHERENCE += 1.8;
      }

      // 2. Category predilections
      if (entity.category === 'Auraliths') {
        utilityScores.ANCHORING_MEMORY += 0.8;
        utilityScores.HARMONIZING += 0.5;
      } else if (entity.category === 'Veskari') {
        utilityScores.WEAVING_RELATION += 1.0;
        utilityScores.HARMONIZING += 0.3;
      } else if (entity.category === 'Oroth') {
        utilityScores.ANCHORING_MEMORY += 1.1;
      } else if (entity.category === 'Nemori') {
        utilityScores.CATALYZING_UNFORMED += 1.2;
      } else if (entity.category === 'Ilyr') {
        utilityScores.EXPLORING_UNSEEN += 1.1;
      }

      // 3. Proximity to dense clusters
      let nearbyFriends = 0;
      for (let other of allEntities) {
        if (other.id !== entity.id) {
          const d2 = (entity.x - other.x) ** 2 + (entity.y - other.y) ** 2 + (entity.z - other.z) ** 2;
          if (d2 < 100 * 100) nearbyFriends++;
        }
      }

      if (nearbyFriends >= 3) {
        utilityScores.HARMONIZING += 0.4;
      } else {
        utilityScores.WEAVING_RELATION += 0.6; // Seek contact
      }

      // Select highest utility
      let bestGoal = 'HARMONIZING';
      let highestUtility = -1;
      for (const [goal, score] of Object.entries(utilityScores)) {
        if (score > highestUtility) {
          highestUtility = score;
          bestGoal = goal;
        }
      }

      entity.currentGoal = bestGoal;

      // Occasional new Vareth vocalization upon changing mindset
      if (typeof VarethLanguage !== 'undefined' && Math.random() < 0.6) {
        const comp = VarethLanguage.composeUtterance(entity.knownGlyphs, 2 + Math.floor(Math.random() * 2));
        entity.utterance = comp.transcription;
        entity.utteranceMeaning = comp.meaning;
        entity.utteranceAge = 0;
      }
    }

    // Execute behavioral motion forces based on current goal
    this.executeBehavior(entity, dt, allEntities);

    // Life-cycle checks: Dissolution or Transcendence
    if (entity.coherence < this.physics.CONSTANTS.CRITICAL_COHERENCE) {
      this.handleDissolution(entity);
    } else if (entity.coherence > this.physics.CONSTANTS.TRANSCENDENCE_COHERENCE && entity.meaningDensity > 1.8) {
      this.handleTranscendence(entity);
    }
  }

  executeBehavior(entity, dt, allEntities) {
    const speed = entity.mobility * dt * 0.8;

    switch (entity.currentGoal) {
      case 'WEAVING_RELATION': {
        // Move towards a resonant neighbor
        let target = null;
        let bestR = 0;
        for (let other of allEntities) {
          if (other.id !== entity.id && other.dimension === entity.dimension) {
            const r = this.physics.calculateResonance(entity, other);
            if (r > bestR) {
              bestR = r;
              target = other;
            }
          }
        }
        if (target) {
          entity.vx += (target.x - entity.x) * speed * 0.005;
          entity.vy += (target.y - entity.y) * speed * 0.005;
          entity.vz += (target.z - entity.z) * speed * 0.005;
        }
        break;
      }

      case 'RESTING_COHERENCE': {
        // Slow down, meditate, recover coherence
        entity.vx *= 0.8;
        entity.vy *= 0.8;
        entity.vz *= 0.8;
        entity.coherence = Math.min(1.0, entity.coherence + 0.03 * dt);
        break;
      }

      case 'CATALYZING_UNFORMED': {
        // Drift outwards with erratic kinetic sparks
        entity.vx += (Math.random() - 0.5) * speed * 0.4;
        entity.vy += (Math.random() - 0.5) * speed * 0.4;
        entity.vz += (Math.random() - 0.5) * speed * 0.4;
        break;
      }

      case 'ANCHORING_MEMORY': {
        // Orbit stable center
        const distFromCenter = Math.sqrt(entity.x * entity.x + entity.z * entity.z);
        if (distFromCenter > 180) {
          entity.vx -= (entity.x / distFromCenter) * speed * 0.3;
          entity.vz -= (entity.z / distFromCenter) * speed * 0.3;
        }
        break;
      }

      case 'EXPLORING_UNSEEN': {
        // Shift along the dimensional threshold
        entity.vx += Math.sin(entity.harmonicPhase * 3) * speed * 0.3;
        entity.vy += Math.cos(entity.harmonicPhase * 3) * speed * 0.3;
        break;
      }

      default: // HARMONIZING
        entity.vx += (Math.random() - 0.5) * speed * 0.1;
        entity.vy += (Math.random() - 0.5) * speed * 0.1;
        entity.vz += (Math.random() - 0.5) * speed * 0.1;
        break;
    }
  }

  handleDissolution(entity) {
    // Record chronicle event
    if (window.realmUniverse && window.realmUniverse.chronicle) {
      window.realmUniverse.chronicle.recordEvent({
        type: 'DISSOLUTION',
        dimension: entity.dimension,
        title: `${entity.name} Dissolved into The Echo`,
        desc: `Pattern coherence reached threshold. Structural memory deposited as sediment in Dimension D.`
      });
    }

    // Reborn as nascent proto-node in The Unformed
    entity.generation = (entity.generation || 1) + 1;
    entity.dimension = 'UNFORMED';
    entity.coherence = 0.55;
    entity.meaningDensity = Math.max(0.2, (entity.meaningDensity || 0.6) * 0.7);
    entity.x = (Math.random() - 0.5) * 150;
    entity.y = (Math.random() - 0.5) * 150;
    entity.z = (Math.random() - 0.5) * 150;
    entity.currentGoal = 'CATALYZING_UNFORMED';
    entity.name = this.generateName(entity.category, Math.floor(Math.random() * 100));
  }

  handleTranscendence(entity) {
    if (window.realmUniverse && window.realmUniverse.chronicle) {
      window.realmUniverse.chronicle.recordEvent({
        type: 'TRANSCENDENCE',
        dimension: entity.dimension,
        title: `${entity.name} Ascended to The Unseen`,
        desc: `Maximum coherence and dense meaning achieved. Entity broke through dimensional tension into Dimension E.`
      });
    }

    entity.dimension = 'UNSEEN';
    entity.coherence = 0.85;
    entity.meaningDensity += 0.25;
    entity.currentGoal = 'EXPLORING_UNSEEN';
  }

  /**
   * Main simulation tick for all entities
   */
  tick(dt) {
    const len = this.entities.length;

    for (let i = 0; i < len; i++) {
      const e = this.entities[i];
      // Physics integration
      this.physics.updateEntity(e, dt);
      // Cognition update
      this.updateCognition(e, dt, this.entities);

      // Pairwise interactions (sparse sampling for 60fps performance)
      for (let j = i + 1; j < len; j += 2) {
        const other = this.entities[j];
        if (other.dimension === e.dimension) {
          this.physics.interact(e, other, dt);
        }
      }
    }
  }

  getEntityById(id) {
    return this.entities.find(e => e.id === id);
  }

  selectEntity(entityOrId) {
    if (typeof entityOrId === 'string') {
      this.selectedEntity = this.getEntityById(entityOrId);
    } else {
      this.selectedEntity = entityOrId;
    }
    return this.selectedEntity;
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.RealmEntityManager = RealmEntityManager;
}
