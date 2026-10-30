/**
 * PROJECT: THE UNBORN REALM (ORIGIN-001)
 * persistence.js - Long-Term Storage & Catch-Up Simulation Manager
 * 
 * Uses IndexedDB (with LocalStorage fallback) to ensure the universe persists
 * across browser refreshes, server restarts, and deployments.
 * Automatically runs catch-up ticks on resume so the world evolves in absence.
 */

class RealmPersistence {
  constructor(universe) {
    this.universe = universe;
    this.dbName = 'UnbornRealmDB';
    this.dbVersion = 1;
    this.db = null;
    this.storageKey = 'ORIGIN_001_FALLBACK_STATE';
    this.lastSaved = Date.now();
    this.autoSaveInterval = 18000; // Auto-save every 18 seconds
  }

  async init() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, using LocalStorage fallback.');
        resolve(false);
        return;
      }

      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('universe_state')) {
          db.createObjectStore('universe_state', { keyPath: 'id' });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(true);
      };

      request.onerror = (e) => {
        console.warn('IndexedDB open failed:', e);
        resolve(false);
      };
    });
  }

  /**
   * Serializes current universe state
   */
  serializeState() {
    const u = this.universe;
    return {
      id: 'ORIGIN_001_CURRENT',
      timestamp: Date.now(),
      chronon: u.physics.chronon,
      currentDimension: u.currentDimension,
      observerMode: u.currentMode,
      entities: u.entityManager.entities.map(e => ({
        id: e.id,
        name: e.name,
        category: e.category,
        dimension: e.dimension,
        x: +e.x.toFixed(2),
        y: +e.y.toFixed(2),
        z: +e.z.toFixed(2),
        vx: +e.vx.toFixed(3),
        vy: +e.vy.toFixed(3),
        vz: +e.vz.toFixed(3),
        coherence: +e.coherence.toFixed(3),
        meaningDensity: +(e.meaningDensity || 0.6).toFixed(3),
        generation: e.generation || 1,
        lineage: e.lineage,
        knownGlyphs: Array.from(e.knownGlyphs || []),
        currentGoal: e.currentGoal,
        utterance: e.utterance,
        utteranceMeaning: e.utteranceMeaning
      })),
      convergences: u.social.convergences,
      formations: u.social.formations,
      recentEvents: u.chronicle.events.slice(0, 30)
    };
  }

  /**
   * Saves state to IndexedDB or LocalStorage
   */
  async save() {
    const data = this.serializeState();
    this.lastSaved = Date.now();

    if (this.db) {
      try {
        const tx = this.db.transaction('universe_state', 'readwrite');
        const store = tx.objectStore('universe_state');
        store.put(data);
      } catch (err) {
        this.saveFallback(data);
      }
    } else {
      this.saveFallback(data);
    }
  }

  saveFallback(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  /**
   * Loads state from storage
   */
  async load() {
    return new Promise((resolve) => {
      if (this.db) {
        try {
          const tx = this.db.transaction('universe_state', 'readonly');
          const store = tx.objectStore('universe_state');
          const req = store.get('ORIGIN_001_CURRENT');

          req.onsuccess = () => {
            if (req.result) {
              resolve(req.result);
            } else {
              resolve(this.loadFallback());
            }
          };

          req.onerror = () => {
            resolve(this.loadFallback());
          };
        } catch (e) {
          resolve(this.loadFallback());
        }
      } else {
        resolve(this.loadFallback());
      }
    });
  }

  loadFallback() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Restores loaded state into the active universe and calculates catch-up time
   */
  applyRestoredState(savedState) {
    if (!savedState) return false;

    const u = this.universe;
    u.physics.chronon = savedState.chronon || 800000;
    if (savedState.currentDimension) u.currentDimension = savedState.currentDimension;

    // Restore entities
    if (savedState.entities && savedState.entities.length > 0) {
      const restored = [];
      for (let se of savedState.entities) {
        const catDef = u.entityManager.CATEGORIES[se.category] || u.entityManager.CATEGORIES.Auraliths;
        restored.push({
          ...se,
          stability: 0.8,
          generationRate: catDef.generationRate,
          mobility: catDef.mobility,
          frequency: 1.0,
          harmonicPhase: Math.random() * Math.PI * 2,
          knownGlyphs: new Set(se.knownGlyphs || ['VOR', 'TAL']),
          goalTimer: 5,
          color: catDef.baseColor,
          glowColor: catDef.secondaryColor
        });
      }
      u.entityManager.entities = restored;
    }

    if (savedState.convergences) u.social.convergences = savedState.convergences;
    if (savedState.formations) u.social.formations = savedState.formations;
    if (savedState.recentEvents) u.chronicle.events = savedState.recentEvents;

    // Calculate offline elapsed time and run catch-up simulation
    const elapsedSeconds = Math.max(0, (Date.now() - savedState.timestamp) / 1000);
    if (elapsedSeconds > 1.5) {
      console.log(`[ORIGIN-001] Resuming simulation after ${elapsedSeconds.toFixed(1)}s of offline emergence.`);
      u.physics.catchUp(u.entityManager.entities, elapsedSeconds);
      u.chronicle.recordEvent({
        type: 'TEMPORAL_CATCHUP',
        dimension: u.currentDimension,
        title: `Synthetic Temporal Convergence`,
        desc: `Universe resumed. Processed ${elapsedSeconds.toFixed(1)} seconds of autonomous offline evolution.`
      });
    }

    return true;
  }

  startAutoSave() {
    setInterval(() => {
      this.save();
    }, this.autoSaveInterval);

    window.addEventListener('beforeunload', () => {
      this.save();
    });
  }

  /**
   * Resets universe to fresh Genesis state
   */
  async resetToGenesis() {
    if (this.db) {
      try {
        const tx = this.db.transaction('universe_state', 'readwrite');
        tx.objectStore('universe_state').delete('ORIGIN_001_CURRENT');
      } catch (e) {}
    }
    localStorage.removeItem(this.storageKey);
    window.location.reload();
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.RealmPersistence = RealmPersistence;
}
