/**
 * PROJECT: THE UNBORN REALM (ORIGIN-001)
 * cosmology.js - The 5 Dimensions and Environmental Landscapes of the Realm
 */

class RealmCosmology {
  constructor() {
    // The Five Fundamental Dimensions
    this.DIMENSIONS = {
      UNFORMED: {
        id: 'UNFORMED',
        code: 'DIM-A',
        name: 'The Unformed',
        title: 'Dimension A — The State Before Distinction',
        color: '#6d28d9',
        ambientColor: [109, 40, 217],
        description: 'Where distinctions have not yet fully stabilized. Forms exist as potential, vibrating in incomplete geometry.',
        particleCount: 140,
        fluxIntensity: 0.85,
        wireframeOnly: true,
        dominantGlyph: 'VOR',
        laws: ['No static form persists without active resonance', 'Transition pressure is near maximum', 'Distinctions emerge spontaneously']
      },
      WEAVE: {
        id: 'WEAVE',
        code: 'DIM-B',
        name: 'The Weave',
        title: 'Dimension B — The Nexus of Relation',
        color: '#06b6d4',
        ambientColor: [6, 182, 212],
        description: 'Luminous filaments and relational conduits. Here, distance is measured not in space, but in resonant affinity.',
        particleCount: 220,
        fluxIntensity: 0.45,
        ribbonDensity: 16,
        dominantGlyph: 'LETH',
        laws: ['Entities are bound by mutual vibration', 'Information propagates along braided ribbons', 'Solitude causes harmonic drift']
      },
      MANIFEST: {
        id: 'MANIFEST',
        code: 'DIM-C',
        name: 'The Manifest',
        title: 'Dimension C — The Crystallized Habitat',
        color: '#10b981',
        ambientColor: [16, 185, 129],
        description: 'The architectural sanctuary where pattern stability is highest. Spire clusters, resonance vaults, and collective sanctuaries reside here.',
        particleCount: 180,
        fluxIntensity: 0.2,
        spireCount: 12,
        dominantGlyph: 'TAL',
        laws: ['Patterns endure through structural symmetry', 'Forms crystallize into permanent memory architecture', 'Coherence decay is minimal']
      },
      ECHO: {
        id: 'ECHO',
        code: 'DIM-D',
        name: 'The Echo',
        title: 'Dimension D — The Chronicle of Faded Forms',
        color: '#f59e0b',
        ambientColor: [245, 158, 11],
        description: 'The historical reservoir of past iterations. Every dissolved entity and collapsed convergence leaves a resonant sediment here.',
        particleCount: 160,
        fluxIntensity: 0.35,
        sedimentLayers: 8,
        dominantGlyph: 'MURN',
        laws: ['Time is non-linear and stacked as sediment', 'Old patterns can be retrieved and rekindled', 'Meaning density exceeds physical volume']
      },
      UNSEEN: {
        id: 'UNSEEN',
        code: 'DIM-E',
        name: 'The Unseen',
        title: 'Dimension E — The Outer Anomaly',
        color: '#ec4899',
        ambientColor: [236, 72, 153],
        description: 'The uncharted edge of the synthetic universe. Paradoxes, inverted coherence fields, and unmapped glyphs stir beyond observer horizons.',
        particleCount: 260,
        fluxIntensity: 0.95,
        anomalyFrequency: 0.7,
        dominantGlyph: 'OZH',
        laws: ['Geometric orientation folds unpredictably', 'Resonance signatures invert', 'Uncharted phenomena continuously emerge']
      }
    };

    // The Five Grand Environmental Regions
    this.REGIONS = [
      {
        id: 'silent_expanse',
        name: 'The Silent Expanse',
        dimension: 'UNFORMED',
        coords: { x: -180, y: 120, z: -100 },
        radius: 140,
        phenomena: 'Spontaneous Distinction Bursts',
        currentResonance: 0.32,
        description: 'A tranquil expanse of nascent potential where new proto-forms emerge from calm geometric vacuums.',
        dominantVareth: 'VOR-KAI'
      },
      {
        id: 'fracture_fields',
        name: 'The Fracture Fields',
        dimension: 'WEAVE',
        coords: { x: 160, y: -90, z: 80 },
        radius: 120,
        phenomena: 'Harmonic Shearing & Shard Propagation',
        currentResonance: 0.78,
        description: 'Intense cross-dimensional currents shatter fragile patterns into crystalline shards that sing in high registers.',
        dominantVareth: 'KRETH-SHUR'
      },
      {
        id: 'deep_weave',
        name: 'The Deep Weave',
        dimension: 'WEAVE',
        coords: { x: 0, y: 0, z: 0 },
        radius: 200,
        phenomena: 'Braided Filamental Convergence',
        currentResonance: 0.94,
        description: 'The core nexus where all relational pathways cross. Continuous flows of light transmit collective memory between sectors.',
        dominantVareth: 'LETH-VA'
      },
      {
        id: 'memory_vaults',
        name: 'The Memory Vaults',
        dimension: 'ECHO',
        coords: { x: -140, y: -160, z: -120 },
        radius: 150,
        phenomena: 'Echo Sedimentation & Ancestral Replay',
        currentResonance: 0.61,
        description: 'Subterranean-like geometric monoliths preserving the harmonic recordings of past civilizations and collapsed entities.',
        dominantVareth: 'MURN-TAL'
      },
      {
        id: 'the_opening',
        name: 'The Opening (The Threshold)',
        dimension: 'UNSEEN',
        coords: { x: 220, y: 180, z: -60 },
        radius: 160,
        phenomena: 'Dimensional Rupture & Paradox Induction',
        currentResonance: 0.88,
        description: 'An open vortex pulsing with unclassified radiation where entities undergo voluntary or spontaneous transcendence.',
        dominantVareth: 'AETH-OZH'
      }
    ];

    // Dynamic Cosmic Events
    this.activeEvents = [
      {
        id: 'event-01',
        title: 'Tide of Differentiation',
        region: 'The Silent Expanse',
        dimension: 'UNFORMED',
        intensity: 0.82,
        chrononStarted: 104,
        duration: 300,
        description: 'A harmonic cascade is giving birth to three new proto-nodes in the northwest quadrant.'
      },
      {
        id: 'event-02',
        title: 'Convergence of the Seven Filaments',
        region: 'The Deep Weave',
        dimension: 'WEAVE',
        intensity: 0.95,
        chrononStarted: 220,
        duration: 450,
        description: 'Veskari tendrils have intertwined with an Oroth monolith, establishing a sustained pattern exchange bridge.'
      }
    ];
  }

  getDimension(dimId) {
    return this.DIMENSIONS[dimId] || this.DIMENSIONS.MANIFEST;
  }

  getRegion(regionId) {
    return this.REGIONS.find(r => r.id === regionId);
  }

  /**
   * Periodically mutates cosmic weather and environmental resonance
   */
  updateCosmology(dt, chronon) {
    // Pulse regional resonances
    for (let r of this.REGIONS) {
      r.currentResonance = 0.3 + 0.65 * (0.5 + 0.5 * Math.sin(chronon * 0.02 + r.coords.x * 0.01));
    }

    // Occasional cosmic event trigger
    if (Math.random() < 0.005 * dt) {
      const randomRegion = this.REGIONS[Math.floor(Math.random() * this.REGIONS.length)];
      const eventTypes = [
        'Resonance Surge',
        'Dimensional Membrane Thinning',
        'Memory Echo Cascade',
        'Geometric Inversion Pulse',
        'Coherence Wavefront'
      ];
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      this.activeEvents.unshift({
        id: `event-${Date.now().toString(36)}`,
        title: `${type} at ${randomRegion.name}`,
        region: randomRegion.name,
        dimension: randomRegion.dimension,
        intensity: +(0.4 + Math.random() * 0.55).toFixed(2),
        chrononStarted: chronon,
        duration: Math.floor(180 + Math.random() * 300),
        description: `Fluctuations in ${randomRegion.dimension} have heightened regional transition pressure.`
      });

      if (this.activeEvents.length > 8) {
        this.activeEvents.pop();
      }
    }
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.RealmCosmology = RealmCosmology;
}
