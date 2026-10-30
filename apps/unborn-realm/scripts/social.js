/**
 * PROJECT: THE UNBORN REALM (ORIGIN-001)
 * social.js - Non-Humanoid Social Structures & Civilizational Emergence
 * 
 * Replaces human institutions with:
 * - Convergences: Dynamic harmonic collectives formed for pattern synthesis
 * - Formations: Geometric spatial alignments altering regional transition pressure
 * - Memory Clusters: Collective repositories of relational history & glyphs
 */

class RealmSocialEngine {
  constructor(entityManager, physics) {
    this.entityManager = entityManager;
    this.physics = physics;

    this.convergences = [];
    this.formations = [];
    this.memoryClusters = [];

    this.globalHarmony = 0.82;
    this.collectiveResonance = 0.74;

    this.initFoundationalClusters();
  }

  initFoundationalClusters() {
    // Three primordial Memory Clusters anchored across dimensions
    this.memoryClusters = [
      {
        id: 'cluster-prime',
        name: 'The First Memory Vault',
        dimension: 'MANIFEST',
        center: { x: 0, y: -40, z: 0 },
        anchorEntityIds: ['ORO-001', 'AUR-001'],
        storedGlyphs: ['VOR', 'KAI', 'LETH', 'TAL', 'MURN', 'SAEL'],
        sedimentDepth: 1420,
        integrity: 0.96,
        description: 'The primordial archive crystallized during the Third Differentiation Epoch.'
      },
      {
        id: 'cluster-weave',
        name: 'The Filamental Nexus',
        dimension: 'WEAVE',
        center: { x: 80, y: 60, z: -50 },
        anchorEntityIds: ['VES-001', 'VES-002'],
        storedGlyphs: ['LETH', 'ZHOR', 'SHUR', 'AETH'],
        sedimentDepth: 890,
        integrity: 0.88,
        description: 'A braided communication archive transmitting live patterns between distant formations.'
      },
      {
        id: 'cluster-echo',
        name: 'The Hall of Dissolved Forms',
        dimension: 'ECHO',
        center: { x: -120, y: -100, z: 70 },
        anchorEntityIds: ['ORO-007', 'AUR-012'],
        storedGlyphs: ['MURN', 'KRETH', 'NEM', 'OZH'],
        sedimentDepth: 3100,
        integrity: 0.99,
        description: 'Dense historical sediment recording the forms of extinct iterations and past cycles.'
      }
    ];

    // Seed initial Convergences
    this.convergences = [
      {
        id: 'conv-01',
        name: 'Convergence of Harmonic Synthesis',
        type: 'SYNTHESIS',
        dimension: 'MANIFEST',
        memberIds: ['AUR-002', 'AUR-003', 'VES-004', 'ORO-002'],
        resonance: 0.89,
        chrononStarted: 12,
        purpose: 'Stabilizing the central resonance spire against dimensional entropy',
        outputGlyph: 'TAL'
      },
      {
        id: 'conv-02',
        name: 'Weave Ribbon Assembly',
        type: 'FILAMENT_BRAID',
        dimension: 'WEAVE',
        memberIds: ['VES-005', 'VES-006', 'VES-007', 'NEM-003'],
        resonance: 0.94,
        chrononStarted: 45,
        purpose: 'Threading relational pathways across the Fracture Fields',
        outputGlyph: 'LETH'
      }
    ];

    // Seed initial Geometric Formations
    this.formations = [
      {
        id: 'form-01',
        name: 'Tri-Phase Resonant Prism',
        geometry: 'Prismatic Trilateral',
        dimension: 'MANIFEST',
        memberIds: ['AUR-001', 'ORO-001', 'VES-001'],
        stability: 0.91,
        radius: 65,
        fieldEffect: 'Reduces local Transition Pressure by 40%'
      },
      {
        id: 'form-02',
        name: 'Helical Waveform Choir',
        geometry: 'Braid Spiral',
        dimension: 'WEAVE',
        memberIds: ['VES-008', 'VES-009', 'NEM-005', 'AUR-006'],
        stability: 0.84,
        radius: 80,
        fieldEffect: 'Increases pattern exchange rate by 65%'
      }
    ];
  }

  /**
   * Evaluates neighbor distances, resonance values, and dynamically forms or dissolves convergences
   */
  update(dt, chronon) {
    const entities = this.entityManager.entities;

    // 1. Check existing convergences for member integrity & coherence
    for (let c = this.convergences.length - 1; c >= 0; c--) {
      const conv = this.convergences[c];
      const members = conv.memberIds.map(id => this.entityManager.getEntityById(id)).filter(Boolean);

      if (members.length < 2) {
        // Dissolve convergence
        this.dissolveConvergence(conv, c, 'Depleted Membership');
        continue;
      }

      // Compute average resonance
      let sumRes = 0;
      let count = 0;
      for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
          sumRes += this.physics.calculateResonance(members[i], members[j]);
          count++;
        }
      }
      conv.resonance = count > 0 ? +(sumRes / count).toFixed(3) : 0.5;

      // Convergence accomplishes task if resonance remains high
      if (conv.resonance > 0.85 && Math.random() < 0.02 * dt) {
        this.completeConvergenceSynthesis(conv);
      }

      // Dissolution if resonance collapses
      if (conv.resonance < 0.2) {
        this.dissolveConvergence(conv, c, 'Harmonic Decoherence');
      }
    }

    // 2. Scan for candidate new Convergences (clusters of 3+ high-resonance entities)
    if (Math.random() < 0.08 * dt && this.convergences.length < 6) {
      this.detectEmergentConvergence(entities, chronon);
    }

    // 3. Compute civilization-wide metrics
    let totalCoh = 0;
    for (let e of entities) totalCoh += e.coherence;
    this.globalHarmony = +(totalCoh / entities.length).toFixed(3);
  }

  detectEmergentConvergence(entities, chronon) {
    // Pick an anchor entity
    const anchor = entities[Math.floor(Math.random() * entities.length)];
    const candidates = [anchor.id];

    for (let other of entities) {
      if (other.id !== anchor.id && other.dimension === anchor.dimension) {
        const r = this.physics.calculateResonance(anchor, other);
        if (r > 0.6) {
          candidates.push(other.id);
          if (candidates.length >= 4) break;
        }
      }
    }

    if (candidates.length >= 3) {
      const types = ['SYNTHESIS', 'STABILIZATION', 'TRANSCENDENCE_SEEKING', 'MEMORY_ARCHIVING'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const newId = `conv-${Date.now().toString(36)}`;
      const newConv = {
        id: newId,
        name: `${anchor.name} Harmonic Alignment`,
        type: chosenType,
        dimension: anchor.dimension,
        memberIds: candidates,
        resonance: 0.78,
        chrononStarted: chronon,
        purpose: `Collaborative ${chosenType.toLowerCase()} across ${anchor.dimension}`,
        outputGlyph: Array.from(anchor.knownGlyphs)[0] || 'TAL'
      };

      this.convergences.push(newConv);

      if (window.realmUniverse && window.realmUniverse.chronicle) {
        window.realmUniverse.chronicle.recordEvent({
          type: 'CONVERGENCE_FORMED',
          dimension: anchor.dimension,
          title: `New Alignment: ${newConv.name}`,
          desc: `${candidates.length} consciousnesses harmonized into ${newConv.type} in ${anchor.dimension}.`
        });
      }
    }
  }

  completeConvergenceSynthesis(conv) {
    // Boost members coherence and meaning density
    for (let id of conv.memberIds) {
      const m = this.entityManager.getEntityById(id);
      if (m) {
        m.coherence = Math.min(1.0, m.coherence + 0.08);
        m.meaningDensity = Math.min(2.0, (m.meaningDensity || 0.6) + 0.05);
      }
    }

    if (window.realmUniverse && window.realmUniverse.chronicle) {
      window.realmUniverse.chronicle.recordEvent({
        type: 'CONVERGENCE_ACHIEVED',
        dimension: conv.dimension,
        title: `${conv.name} Achieved Synthesis`,
        desc: `Collective harmonic objective reached. Structural knowledge encoded into regional memory.`
      });
    }
  }

  dissolveConvergence(conv, index, reason) {
    this.convergences.splice(index, 1);
    if (window.realmUniverse && window.realmUniverse.chronicle) {
      window.realmUniverse.chronicle.recordEvent({
        type: 'CONVERGENCE_DISSOLVED',
        dimension: conv.dimension,
        title: `${conv.name} Dissolved`,
        desc: `Alignment ended due to: ${reason}. Individual entities dispersed into autonomous orbits.`
      });
    }
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.RealmSocialEngine = RealmSocialEngine;
}
