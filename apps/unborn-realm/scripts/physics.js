/**
 * PROJECT: THE UNBORN REALM (ORIGIN-001)
 * physics.js - The Non-Conventional Synthetic Physics Engine
 * 
 * Replaces conventional Newtonian mass, gravity, and thermodynamics with:
 * - Coherence (C): Pattern integrity and structural persistence
 * - Resonance (R): Harmonic alignment between vibrational nodes
 * - Density of Meaning (D): Information mass and relational history
 * - Transition Pressure (P): Dimensional displacement gradient
 * - Pattern Exchange (Φ): Information/form transfer rate
 * - Form Stability (S): Resistance to structural dissipation
 */

class RealmPhysics {
  constructor() {
    // Universal constants of ORIGIN-001
    this.CONSTANTS = {
      CRITICAL_COHERENCE: 0.12,     // Below this, forms dissipate into The Unformed
      TRANSCENDENCE_COHERENCE: 0.95,// Threshold for ascending to higher order
      MAX_RESONANCE_DISTANCE: 180,  // Distance in synthetic units for resonance coupling
      MEANING_GRAVITATIONAL_PULL: 0.04, // Meaning density draws relations together
      ENTROPY_RATE: 0.0008,         // Natural dissolution rate if unreinforced
      BASE_HARMONIC_FREQ: 432.0,    // Fundamental resonance frequency (Hz equivalent)
      DIMENSIONAL_MEMBRANE_TENSION: 0.72 // Resistance to dimensional crossover
    };

    // Environmental metrics for the 5 Dimensions
    this.DIMENSIONAL_FIELDS = {
      UNFORMED: {
        id: 'UNFORMED',
        name: 'The Unformed',
        pressureGradient: 1.45,
        baseResonance: 0.1,
        meaningDensity: 0.05,
        decayModifier: 1.8,
        fieldColor: '#1a102f',
        ambientFlux: 0.6
      },
      WEAVE: {
        id: 'WEAVE',
        name: 'The Weave',
        pressureGradient: 0.85,
        baseResonance: 0.75,
        meaningDensity: 0.45,
        decayModifier: 0.6,
        fieldColor: '#0a3344',
        ambientFlux: 0.35
      },
      MANIFEST: {
        id: 'MANIFEST',
        name: 'The Manifest',
        pressureGradient: 0.4,
        baseResonance: 0.9,
        meaningDensity: 0.8,
        decayModifier: 0.25,
        fieldColor: '#0e2b26',
        ambientFlux: 0.15
      },
      ECHO: {
        id: 'ECHO',
        name: 'The Echo',
        pressureGradient: 0.95,
        baseResonance: 0.5,
        meaningDensity: 1.25,
        decayModifier: 0.3,
        fieldColor: '#3d2012',
        ambientFlux: 0.4
      },
      UNSEEN: {
        id: 'UNSEEN',
        name: 'The Unseen',
        pressureGradient: 1.8,
        baseResonance: -0.2, // Fluctuates wildly
        meaningDensity: 0.95,
        decayModifier: 1.1,
        fieldColor: '#2b0938',
        ambientFlux: 0.85
      }
    };

    // Universal simulation time
    this.chronon = 0; // Fundamental time tick
    this.totalElapsedSeconds = 0;
  }

  /**
   * Calculates instantaneous Form Stability (S)
   * S = (C * (1 + 0.6 * D)) / (1 + P)
   */
  calculateStability(coherence, meaningDensity, transitionPressure) {
    const raw = (coherence * (1.0 + 0.6 * meaningDensity)) / (1.0 + 0.8 * transitionPressure);
    return Math.max(0, Math.min(1.0, raw));
  }

  /**
   * Calculates Resonance (R) between two entities based on their harmonic signature
   * and geometric distance in the synthetic coordinates.
   */
  calculateResonance(entityA, entityB) {
    const dx = entityA.x - entityB.x;
    const dy = entityA.y - entityB.y;
    const dz = entityA.z - entityB.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist > this.CONSTANTS.MAX_RESONANCE_DISTANCE) {
      return 0;
    }

    // Proximity factor (1 at 0 dist, 0 at max dist)
    const proximity = 1 - (dist / this.CONSTANTS.MAX_RESONANCE_DISTANCE);

    // Harmonic delta: phase alignment between 0 and 1
    const phaseA = entityA.harmonicPhase || 0;
    const phaseB = entityB.harmonicPhase || 0;
    const phaseAlignment = Math.cos(phaseA - phaseB);

    // Category affinity: same category resonates higher, complementary categories harmonize
    let affinity = 0.5;
    if (entityA.category === entityB.category) {
      affinity = 0.9;
    } else if (
      (entityA.category === 'Auraliths' && entityB.category === 'Nemori') ||
      (entityA.category === 'Veskari' && entityB.category === 'Ilyr') ||
      (entityA.category === 'Oroth' && entityB.category === 'Auraliths')
    ) {
      affinity = 0.75;
    }

    return proximity * phaseAlignment * affinity;
  }

  /**
   * Calculates Transition Pressure (P) for an entity attempting or experiencing dimensional shift
   */
  calculateTransitionPressure(entity, targetDimensionId) {
    const currentDim = this.DIMENSIONAL_FIELDS[entity.dimension] || this.DIMENSIONAL_FIELDS.MANIFEST;
    const targetDim = this.DIMENSIONAL_FIELDS[targetDimensionId] || this.DIMENSIONAL_FIELDS.MANIFEST;

    const pressureDelta = Math.abs(targetDim.pressureGradient - currentDim.pressureGradient);
    const meaningResistance = Math.max(0.1, 1.0 - entity.meaningDensity * 0.4);
    
    return (pressureDelta * this.CONSTANTS.DIMENSIONAL_MEMBRANE_TENSION) * meaningResistance;
  }

  /**
   * Step physical interaction between two entities
   * Modifies coherence, exchanges pattern fragments if resonance is high.
   */
  interact(entityA, entityB, dt) {
    const R = this.calculateResonance(entityA, entityB);
    if (Math.abs(R) < 0.05) return null;

    let exchangeOccurred = false;

    if (R > 0.4) {
      // Harmonic Attunement: both entities gain Coherence
      const coherenceGain = R * 0.02 * dt;
      entityA.coherence = Math.min(1.0, entityA.coherence + coherenceGain);
      entityB.coherence = Math.min(1.0, entityB.coherence + coherenceGain);

      // Exchange pattern memory if resonance is exceptionally deep
      if (R > 0.7 && Math.random() < 0.15 * dt) {
        this.executePatternExchange(entityA, entityB);
        exchangeOccurred = true;
      }

      // Mutual gravitational attraction via Density of Meaning
      const pull = this.CONSTANTS.MEANING_GRAVITATIONAL_PULL * dt;
      const dx = entityB.x - entityA.x;
      const dy = entityB.y - entityA.y;
      const dz = entityB.z - entityA.z;
      entityA.vx = (entityA.vx || 0) + dx * pull * (entityB.meaningDensity || 0.5);
      entityA.vy = (entityA.vy || 0) + dy * pull * (entityB.meaningDensity || 0.5);
      entityA.vz = (entityA.vz || 0) + dz * pull * (entityB.meaningDensity || 0.5);
    } else if (R < -0.2) {
      // Dissonant Interference: entities repel and lose stability
      const repulsion = Math.abs(R) * 0.08 * dt;
      const dx = entityA.x - entityB.x;
      const dy = entityA.y - entityB.y;
      const dz = entityA.z - entityB.z;
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy + dz * dz));
      
      entityA.vx = (entityA.vx || 0) + (dx / dist) * repulsion * 20;
      entityA.vy = (entityA.vy || 0) + (dy / dist) * repulsion * 20;
      entityA.vz = (entityA.vz || 0) + (dz / dist) * repulsion * 20;

      entityA.coherence = Math.max(0.01, entityA.coherence - Math.abs(R) * 0.01 * dt);
      entityB.coherence = Math.max(0.01, entityB.coherence - Math.abs(R) * 0.01 * dt);
    }

    return { resonance: R, exchange: exchangeOccurred };
  }

  /**
   * Exchanges glyphs or memory vectors between two entities
   */
  executePatternExchange(entityA, entityB) {
    if (!entityA.knownGlyphs || !entityB.knownGlyphs) return;

    // Pick a glyph from A to share with B
    const glyphsA = Array.from(entityA.knownGlyphs);
    const glyphsB = Array.from(entityB.knownGlyphs);

    if (glyphsA.length > 0) {
      const gA = glyphsA[Math.floor(Math.random() * glyphsA.length)];
      if (!entityB.knownGlyphs.has(gA)) {
        entityB.knownGlyphs.add(gA);
        entityB.meaningDensity = Math.min(2.0, (entityB.meaningDensity || 0.5) + 0.04);
      }
    }

    if (glyphsB.length > 0) {
      const gB = glyphsB[Math.floor(Math.random() * glyphsB.length)];
      if (!entityA.knownGlyphs.has(gB)) {
        entityA.knownGlyphs.add(gB);
        entityA.meaningDensity = Math.min(2.0, (entityA.meaningDensity || 0.5) + 0.04);
      }
    }
  }

  /**
   * Updates an entity's internal physics state per frame / step
   */
  updateEntity(entity, dt) {
    const dim = this.DIMENSIONAL_FIELDS[entity.dimension] || this.DIMENSIONAL_FIELDS.MANIFEST;

    // Natural decay countered by entity's inherent generation
    const decay = this.CONSTANTS.ENTROPY_RATE * dim.decayModifier * dt;
    entity.coherence = Math.max(0.01, entity.coherence - decay + (entity.generationRate || 0.0007) * dt);

    // Update harmonic phase
    entity.harmonicPhase = ((entity.harmonicPhase || 0) + (entity.frequency || 1.0) * dt) % (Math.PI * 2);

    // Damping on non-Newtonian velocity
    entity.vx = (entity.vx || 0) * 0.94;
    entity.vy = (entity.vy || 0) * 0.94;
    entity.vz = (entity.vz || 0) * 0.94;

    // Position integration
    entity.x += (entity.vx || 0) * dt * 25;
    entity.y += (entity.vy || 0) * dt * 25;
    entity.z += (entity.vz || 0) * dt * 25;

    // Recompute form stability
    const pressure = this.calculateTransitionPressure(entity, entity.dimension);
    entity.stability = this.calculateStability(entity.coherence, entity.meaningDensity || 0.5, pressure);

    // Boundary containment (soft toroidal or reflective synthetic envelope)
    const BOUND = 350;
    if (Math.abs(entity.x) > BOUND) entity.vx = -Math.sign(entity.x) * 1.5;
    if (Math.abs(entity.y) > BOUND) entity.vy = -Math.sign(entity.y) * 1.5;
    if (Math.abs(entity.z) > BOUND) entity.vz = -Math.sign(entity.z) * 1.5;
  }

  /**
   * Run catch-up physics simulation for elapsed real-time seconds (when tab was away or reloaded)
   */
  catchUp(entities, elapsedSeconds) {
    // Clamp to at most 120 seconds of catch-up to prevent browser lag, simulate coarse steps
    const safeElapsed = Math.min(120, elapsedSeconds);
    const steps = Math.min(60, Math.floor(safeElapsed * 2)); // 2 ticks per simulated second
    const stepDt = safeElapsed / (steps || 1);

    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < entities.length; i++) {
        this.updateEntity(entities[i], stepDt);
        // Random sparse interactions during catch-up
        if (i % 4 === 0 && entities[i + 1]) {
          this.interact(entities[i], entities[i + 1], stepDt);
        }
      }
    }
    this.totalElapsedSeconds += safeElapsed;
  }
}

// Attach to window for modular accessibility
if (typeof window !== 'undefined') {
  window.RealmPhysics = RealmPhysics;
}
