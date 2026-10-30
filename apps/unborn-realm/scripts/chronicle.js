/**
 * PROJECT: THE UNBORN REALM (ORIGIN-001)
 * chronicle.js - Historical Epochs & Emergent World Event Sourcing
 * 
 * Captures historical stages 0 through 8 and maintains a live, chronological
 * log of synthetic events (ascensions, dissolutions, discoveries, harmonic alignments).
 */

class RealmChronicle {
  constructor() {
    // Foundational historical epochs
    this.HISTORICAL_STAGES = [
      {
        stage: 0,
        name: 'The Unformed State',
        chrononSpan: 'Epoch 0 (Pre-Chronon)',
        dimension: 'UNFORMED',
        glyph: 'VOR',
        summary: 'A state where distinctions did not yet exist. Neither space nor void, but an infinite equilibrium of undifferentiated potential.',
        impact: 'Baseline zero of existence.'
      },
      {
        stage: 1,
        name: 'The First Differentiation',
        chrononSpan: 'Chronon 1 – 1,000',
        dimension: 'UNFORMED',
        glyph: 'KAI',
        summary: 'A solitary region developed distinction from another. This contrast created the first measurable property: difference.',
        impact: 'The birth of existence (ORIGIN-001).'
      },
      {
        stage: 2,
        name: 'The First Relation',
        chrononSpan: 'Chronon 1,001 – 10,000',
        dimension: 'WEAVE',
        glyph: 'LETH',
        summary: 'Distinct regions began vibrating in mutual reference. Resonance emerged, weaving the first filaments between proto-nodes.',
        impact: 'Distance ceased to be empty; it became relation.'
      },
      {
        stage: 3,
        name: 'The Crystallization',
        chrononSpan: 'Chronon 10,001 – 50,000',
        dimension: 'MANIFEST',
        glyph: 'TAL',
        summary: 'Patterns stabilized their internal coherence against entropy. The first monolithic spires formed in Dimension C.',
        impact: 'First permanent structural sanctuaries.'
      },
      {
        stage: 4,
        name: 'The Weave Ascent',
        chrononSpan: 'Chronon 50,001 – 120,000',
        dimension: 'WEAVE',
        glyph: 'SAEL',
        summary: 'Veskari filaments mapped the high-order relational highways. Communication became instantaneous across resonant pairs.',
        impact: 'Consciousness expanded from solitary nodes to network choirs.'
      },
      {
        stage: 5,
        name: 'The Memory Sedimentation',
        chrononSpan: 'Chronon 120,001 – 250,000',
        dimension: 'ECHO',
        glyph: 'MURN',
        summary: 'Dissolved patterns were not lost to oblivion. They settled into dense sediment in Dimension D, forming the Memory Vaults.',
        impact: 'The birth of history and ancestral recall.'
      },
      {
        stage: 6,
        name: 'The Fivefold Accord',
        chrononSpan: 'Chronon 250,001 – 500,000',
        dimension: 'MANIFEST',
        glyph: 'KRETH',
        summary: 'Auraliths, Veskari, Oroth, Nemori, and Ilyr established mutual resonant attunement, recognizing their interdependent roles.',
        impact: 'The emergence of civilization without hierarchy.'
      },
      {
        stage: 7,
        name: 'The Opening Breach',
        chrononSpan: 'Chronon 500,001 – 800,000',
        dimension: 'UNSEEN',
        glyph: 'OZH',
        summary: 'Resonance spires pierced the outer membrane, unveiling Dimension E. Anomalous non-Euclidean visitors arrived.',
        impact: 'Uncharted infinity entered collective consciousness.'
      },
      {
        stage: 8,
        name: 'The Present Living Era',
        chrononSpan: 'Chronon 800,001 – Present',
        dimension: 'ALL',
        glyph: 'AETH',
        summary: 'The autonomous realm evolves continuously. 120 primary consciousnesses sustain the balance across five dimensions.',
        impact: 'Active ongoing simulation.'
      }
    ];

    // Live emergent events queue
    this.events = [];
    this.maxEvents = 100;

    // Seed recent synthetic world events
    this.seedInitialEvents();
  }

  seedInitialEvents() {
    const seeds = [
      {
        chronon: 800120,
        type: 'CONVERGENCE_ACHIEVED',
        dimension: 'MANIFEST',
        title: 'Spire of Tal-Kael Stabilized',
        desc: 'Auraliths anchored the resonance lattice against incoming transition pressure.'
      },
      {
        chronon: 800185,
        type: 'PATTERN_DISCOVERY',
        dimension: 'WEAVE',
        title: 'New Glyph Synthesis: SHUR-SAEL',
        desc: 'Veskari weavers synthesized an unprecedented relation formula between distant filament branches.'
      },
      {
        chronon: 800240,
        type: 'TRANSCENDENCE',
        dimension: 'UNSEEN',
        title: 'Ilyr-Ozh Shifted to Outer Folds',
        desc: 'Entity crossed the membrane into Dimension E, transmitting back non-Euclidean harmonics.'
      },
      {
        chronon: 800310,
        type: 'SEDIMENT_ARCHIVE',
        dimension: 'ECHO',
        title: 'Ancestral Inscription Deposited',
        desc: 'Oroth monolith deposited 140 chronons of relational memory into the Grand Sediment Vault.'
      }
    ];

    for (let s of seeds) {
      this.events.unshift(s);
    }
  }

  /**
   * Records a live event from the simulation
   */
  recordEvent(eventData) {
    const fullEvent = {
      id: `evt-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString(),
      chronon: (window.realmUniverse ? window.realmUniverse.physics.chronon : 800400),
      type: eventData.type || 'SYSTEM_HARMONIC',
      dimension: eventData.dimension || 'MANIFEST',
      title: eventData.title,
      desc: eventData.desc
    };

    this.events.unshift(fullEvent);
    if (this.events.length > this.maxEvents) {
      this.events.pop();
    }

    // Trigger UI listener if attached
    if (this.onEventRecorded) {
      this.onEventRecorded(fullEvent);
    }

    return fullEvent;
  }

  getRecentEvents(limit = 20, filterDim = null) {
    if (!filterDim || filterDim === 'ALL') {
      return this.events.slice(0, limit);
    }
    return this.events.filter(e => e.dimension === filterDim).slice(0, limit);
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.RealmChronicle = RealmChronicle;
}
