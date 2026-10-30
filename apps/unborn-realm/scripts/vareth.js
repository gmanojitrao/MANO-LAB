/**
 * THE UNBORN REALM (ORIGIN-001)
 * Language System: VARETH
 * 
 * Non-human pattern-based communication system.
 * Contains 42 foundational glyphs with unique vector geometry,
 * phonetic resonance, structural roles, and semantic mappings.
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Vareth = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // 42 Foundational Glyphs of VARETH
  const GLYPHS = [
    {
      id: "var_01",
      symbol: "VAR-ORIGIN",
      name: "Aeth",
      phonetic: "aeθ",
      meaning: "The Unformed / Pre-differentiation state",
      role: "Root",
      geometry: "M 12 12 L 88 12 L 50 88 Z M 50 28 L 74 72 L 26 72 Z",
      relationship: "Generates all subsequent structural distinctions"
    },
    {
      id: "var_02",
      symbol: "VAR-DIFF",
      name: "Khor",
      phonetic: "kʰɔːr",
      meaning: "The First Differentiation / Emergence of boundary",
      role: "Operator",
      geometry: "M 50 8 L 50 92 M 20 30 L 80 30 M 10 70 L 90 70",
      relationship: "Splits continuous coherence into discrete entities"
    },
    {
      id: "var_03",
      symbol: "VAR-WEAVE",
      name: "Tress",
      phonetic: "trɛs",
      meaning: "Interconnection / Relational binding between nodes",
      role: "Root",
      geometry: "M 15 50 Q 50 15 85 50 Q 50 85 15 50 Z M 50 15 L 50 85",
      relationship: "Establishes information pathways in The Weave"
    },
    {
      id: "var_04",
      symbol: "VAR-COHERENCE",
      name: "Vael",
      phonetic: "veɪl",
      meaning: "Structural stability / Form retention",
      role: "Modality",
      geometry: "M 50 10 L 90 50 L 50 90 L 10 50 Z M 30 50 L 50 30 L 70 50 L 50 70 Z",
      relationship: "Measures resilience against environmental flux"
    },
    {
      id: "var_05",
      symbol: "VAR-ENTROPY",
      name: "Murn",
      phonetic: "mʊərn",
      meaning: "Noise / Raw unpatterned potential",
      role: "Root",
      geometry: "M 15 20 L 45 40 L 25 70 L 75 30 L 55 80 L 85 60",
      relationship: "The energetic nourishment of high-order structures"
    },
    {
      id: "var_06",
      symbol: "VAR-RESONANCE",
      name: "Soli",
      phonetic: "soʊˈli",
      meaning: "Frequency harmonic synchronization",
      role: "Operator",
      geometry: "M 10 50 C 30 10 30 90 50 50 C 70 10 70 90 90 50",
      relationship: "Determines communication capability and synthesis"
    },
    {
      id: "var_07",
      symbol: "VAR-MEMORY",
      name: "Zhir",
      phonetic: "ʒɪər",
      meaning: "Historical state trace / Imprinted pattern",
      role: "Root",
      geometry: "M 50 15 A 35 35 0 1 0 85 50 L 50 50 Z",
      relationship: "The foundation of identity persistence in The Echo"
    },
    {
      id: "var_08",
      symbol: "VAR-GENESIS",
      name: "Nyx",
      phonetic: "nɪks",
      meaning: "Spontaneous emergence of an autonomous consciousness",
      role: "Operator",
      geometry: "M 50 5 L 62 38 L 95 50 L 62 62 L 50 95 L 38 62 L 5 50 L 38 38 Z",
      relationship: "Marks the creation of a new entity lineage"
    },
    {
      id: "var_09",
      symbol: "VAR-CONVERGE",
      name: "Lyr",
      phonetic: "lɪər",
      meaning: "Temporary alignment of independent wills",
      role: "Resonator",
      geometry: "M 15 15 L 50 50 M 85 15 L 50 50 M 50 50 L 50 90",
      relationship: "Triggers the formation of Convergences"
    },
    {
      id: "var_10",
      symbol: "VAR-DISSOLVE",
      name: "Omra",
      phonetic: "oʊmˈrɑː",
      meaning: "Transmutation into background field potential",
      role: "Operator",
      geometry: "M 20 80 Q 50 20 80 80 M 35 60 Q 50 35 65 60",
      relationship: "The non-biological culmination of an entity lifecycle"
    },
    {
      id: "var_11",
      symbol: "VAR-SPIRE",
      name: "Tor",
      phonetic: "tɔːr",
      meaning: "Resonant Monolith / Spatially anchored memory pylon",
      role: "Root",
      geometry: "M 50 5 L 75 90 L 50 80 L 25 90 Z M 50 25 L 60 70 L 40 70 Z",
      relationship: "Stabilizes local reality within The Manifest"
    },
    {
      id: "var_12",
      symbol: "VAR-UNSEEN",
      name: "Khel",
      phonetic: "xɛl",
      meaning: "The Unexplored / Beyond boundary of comprehension",
      role: "Modality",
      geometry: "M 15 15 L 85 15 L 85 85 L 15 85 Z M 15 15 L 85 85 M 85 15 L 15 85",
      relationship: "Refers to phenomena originating in Dimension E"
    },
    {
      id: "var_13",
      symbol: "VAR-HARMONY",
      name: "Brel",
      phonetic: "brɛl",
      meaning: "Equilibrium between internal structure and environment",
      role: "Resonator",
      geometry: "M 50 20 A 30 30 0 1 1 50 80 A 30 30 0 1 1 50 20 M 50 35 A 15 15 0 1 1 50 65 A 15 15 0 1 1 50 35",
      relationship: "Prevents transition pressure"
    },
    {
      id: "var_14",
      symbol: "VAR-PRESSURE",
      name: "Grax",
      phonetic: "ɡræks",
      meaning: "Environmental flux demanding morphological change",
      role: "Modality",
      geometry: "M 20 50 L 40 30 L 40 70 Z M 50 50 L 70 30 L 70 70 Z M 80 50 L 90 40 L 90 60 Z",
      relationship: "Forces Veskari and Ilyr into structural transformation"
    },
    {
      id: "var_15",
      symbol: "VAR-AURALITH",
      name: "Aur",
      phonetic: "aʊər",
      meaning: "Distributed multi-manifestation consciousness",
      role: "Root",
      geometry: "M 30 20 L 70 20 L 90 50 L 70 80 L 30 80 L 10 50 Z M 50 35 L 65 50 L 50 65 L 35 50 Z",
      relationship: "Category identifier for Category 1"
    },
    {
      id: "var_16",
      symbol: "VAR-VESKARI",
      name: "Vesk",
      phonetic: "vɛsk",
      meaning: "Fluid adaptive pattern reorganizer",
      role: "Root",
      geometry: "M 20 30 Q 80 10 70 50 Q 60 90 20 70 Q 40 50 20 30",
      relationship: "Category identifier for Category 2"
    },
    {
      id: "var_17",
      symbol: "VAR-OROTH",
      name: "Oro",
      phonetic: "ɔːˈroʊ",
      meaning: "Monumental persistent memory preserver",
      role: "Root",
      geometry: "M 20 85 L 20 30 L 50 15 L 80 30 L 80 85 Z M 40 85 L 40 45 L 60 45 L 60 85 Z",
      relationship: "Category identifier for Category 3"
    },
    {
      id: "var_18",
      symbol: "VAR-NEMORI",
      name: "Nem",
      phonetic: "nɛm",
      meaning: "Composite synchronized geometric collective",
      role: "Root",
      geometry: "M 30 35 A 15 15 0 1 0 30 65 A 15 15 0 1 0 30 35 M 70 35 A 15 15 0 1 0 70 65 A 15 15 0 1 0 70 35 M 45 50 L 55 50",
      relationship: "Category identifier for Category 4"
    },
    {
      id: "var_19",
      symbol: "VAR-ILYR",
      name: "Ily",
      phonetic: "ɪˈliː",
      meaning: "Unpredictable anomalous emergent form",
      role: "Root",
      geometry: "M 50 10 L 80 85 L 15 40 L 85 40 L 20 85 Z",
      relationship: "Category identifier for Category 5"
    },
    {
      id: "var_20",
      symbol: "VAR-CLUSTER",
      name: "Syn",
      phonetic: "sɪn",
      meaning: "Memory Cluster / Collective knowledge archive",
      role: "Resonator",
      geometry: "M 50 15 L 80 32 L 80 68 L 50 85 L 20 68 L 20 32 Z M 50 32 L 65 42 L 65 58 L 50 68 L 35 58 L 35 42 Z",
      relationship: "The institutional repository of civilization history"
    },
    {
      id: "var_21",
      symbol: "VAR-FORMATION",
      name: "Kest",
      phonetic: "kɛst",
      meaning: "Large environmental structure created by entities",
      role: "Root",
      geometry: "M 10 75 L 30 25 L 50 75 L 70 25 L 90 75",
      relationship: "The cooperative physical achievement of multiple groups"
    },
    {
      id: "var_22",
      symbol: "VAR-DISCOVER",
      name: "Vel",
      phonetic: "vɛl",
      meaning: "Identification of a previously unrecorded relationship",
      role: "Operator",
      geometry: "M 50 20 L 75 50 L 50 80 L 25 50 Z M 50 10 L 50 90 M 10 50 L 90 50",
      relationship: "Expands the civilizational knowledge archive"
    },
    {
      id: "var_23",
      symbol: "VAR-TIME",
      name: "Chro",
      phonetic: "xroʊ",
      meaning: "Sequence of state transformations / Epoch progression",
      role: "Modality",
      geometry: "M 15 50 A 35 35 0 0 1 85 50 M 80 40 L 85 50 L 75 55",
      relationship: "Measures developmental distance from The First Differentiation"
    },
    {
      id: "var_24",
      symbol: "VAR-TENSOR",
      name: "Phor",
      phonetic: "fɔːr",
      meaning: "Multi-axis field gradient in the lattice",
      role: "Operator",
      geometry: "M 15 15 L 85 85 M 15 85 L 85 15 M 50 10 L 50 90",
      relationship: "Governs orientation and velocity in non-spatial environments"
    },
    {
      id: "var_25",
      symbol: "VAR-COMMUNE",
      name: "Thal",
      phonetic: "θæl",
      meaning: "Direct moiré light dialogue between beings",
      role: "Operator",
      geometry: "M 25 20 L 25 80 M 75 20 L 75 80 M 25 35 L 75 65 M 25 65 L 75 35",
      relationship: "The transmission mechanism of intent and memory"
    },
    {
      id: "var_26",
      symbol: "VAR-SILENT",
      name: "Nol",
      phonetic: "nɒl",
      meaning: "The Silent Expanse / Region of near-zero entropy",
      role: "Root",
      geometry: "M 15 50 L 85 50 M 50 40 L 50 60",
      relationship: "Sanctuary for low-activity restoration"
    },
    {
      id: "var_27",
      symbol: "VAR-FRACTURE",
      name: "Vrak",
      phonetic: "vræk",
      meaning: "The Fracture Fields / Region of turbulent reconfiguration",
      role: "Root",
      geometry: "M 15 30 L 40 70 L 65 20 L 85 80",
      relationship: "High-risk, high-discovery territory"
    },
    {
      id: "var_28",
      symbol: "VAR-DEEPWEAVE",
      name: "Mor",
      phonetic: "mɔːr",
      meaning: "The Deep Weave / Dense information corridor",
      role: "Root",
      geometry: "M 20 20 L 80 80 M 20 80 L 80 20 M 50 20 L 80 50 L 50 80 L 20 50 Z",
      relationship: "Fast transit and collective deliberation"
    },
    {
      id: "var_29",
      symbol: "VAR-VAULT",
      name: "Keth",
      phonetic: "kɛθ",
      meaning: "The Memory Vaults / Cumulative historical archive",
      role: "Root",
      geometry: "M 25 25 L 75 25 L 75 75 L 25 75 Z M 35 35 L 65 35 L 65 65 L 35 65 Z",
      relationship: "Preserves records of extinct lineages and past epochs"
    },
    {
      id: "var_30",
      symbol: "VAR-OPENING",
      name: "Astr",
      phonetic: "æstr",
      meaning: "The Opening / Dimensional aperture to The Unseen",
      role: "Root",
      geometry: "M 50 15 C 20 15 20 85 50 85 C 80 85 80 15 50 15 Z M 50 35 C 40 35 40 65 50 65 C 60 65 60 35 50 35 Z",
      relationship: "The locus of inexplicable civilizational events"
    },
    {
      id: "var_31",
      symbol: "VAR-INTENT",
      name: "Rha",
      phonetic: "rɑː",
      meaning: "Directed purpose / Motivation vector",
      role: "Modality",
      geometry: "M 20 50 L 70 50 M 55 35 L 70 50 L 55 65",
      relationship: "Prefix that sets utility priority in an utterance"
    },
    {
      id: "var_32",
      symbol: "VAR-UNCERTAIN",
      name: "Qo",
      phonetic: "kwoʊ",
      meaning: "Indeterminate pattern / Hypothesis awaiting evidence",
      role: "Modality",
      geometry: "M 35 35 Q 50 15 65 35 Q 50 55 50 65 M 50 78 A 2 2 0 1 1 50 82 A 2 2 0 1 1 50 78",
      relationship: "Distinguishes established law from speculation"
    },
    {
      id: "var_33",
      symbol: "VAR-AFFINITY",
      name: "Zel",
      phonetic: "zɛl",
      meaning: "Pattern compatibility / Positive resonance bond",
      role: "Resonator",
      geometry: "M 50 30 Q 30 10 20 30 Q 10 50 50 80 Q 90 50 80 30 Q 70 10 50 30 Z",
      relationship: "Strength of relationship between two entities"
    },
    {
      id: "var_34",
      symbol: "VAR-DISCORD",
      name: "Dhar",
      phonetic: "dɑːr",
      meaning: "Frequency collision / Destructive interference",
      role: "Modality",
      geometry: "M 25 25 L 75 75 M 75 25 L 25 75 M 10 50 L 30 50 M 70 50 L 90 50",
      relationship: "Causes avoidance or structural reconfiguration"
    },
    {
      id: "var_35",
      symbol: "VAR-BALANCE",
      name: "Equi",
      phonetic: "ɛˈkwi",
      meaning: "Dynamic neutrality / State of non-interference",
      role: "Resonator",
      geometry: "M 20 35 L 80 35 M 30 50 L 70 50 M 40 65 L 60 65",
      relationship: "Prevents runaway emergence or collapse"
    },
    {
      id: "var_36",
      symbol: "VAR-EXPAND",
      name: "Vorn",
      phonetic: "vɔːrn",
      meaning: "Spatial propagation / Territorial extension",
      role: "Operator",
      geometry: "M 50 50 L 20 20 M 50 50 L 80 20 M 50 50 L 80 80 M 50 50 L 20 80",
      relationship: "Spreads civilizational structures into new lattice cells"
    },
    {
      id: "var_37",
      symbol: "VAR-ANCHOR",
      name: "Stas",
      phonetic: "stæs",
      meaning: "Invariable constant / Fixed reference node",
      role: "Root",
      geometry: "M 50 15 L 50 85 M 25 50 L 75 50 M 20 20 L 80 80",
      relationship: "Preserves the coordinate grid of the realm"
    },
    {
      id: "var_38",
      symbol: "VAR-TRANSFIGURE",
      name: "Met",
      phonetic: "mɛt",
      meaning: "Metamorphic transformation without loss of memory",
      role: "Operator",
      geometry: "M 25 40 Q 50 10 75 40 Q 50 70 25 40 M 35 60 Q 50 90 65 60",
      relationship: "Used by Veskari when shifting existence categories"
    },
    {
      id: "var_39",
      symbol: "VAR-ASCEND",
      name: "Alti",
      phonetic: "ælˈti",
      meaning: "Elevation to higher-dimensional coherence",
      role: "Modality",
      geometry: "M 50 15 L 20 55 L 40 55 L 40 85 L 60 85 L 60 55 L 80 55 Z",
      relationship: "Entity state transition into The Echo or The Weave"
    },
    {
      id: "var_40",
      symbol: "VAR-CHRONICLE",
      name: "Hist",
      phonetic: "hɪst",
      meaning: "The Unfolding World-Record / Cumulative epochs",
      role: "Root",
      geometry: "M 15 20 L 85 20 M 15 40 L 85 40 M 15 60 L 85 60 M 15 80 L 60 80",
      relationship: "The master timeline of the universe"
    },
    {
      id: "var_41",
      symbol: "VAR-NULL",
      name: "Zon",
      phonetic: "zɒn",
      meaning: "Absence of pattern / Zero amplitude",
      role: "Modality",
      geometry: "M 50 15 A 35 35 0 1 0 50 85 A 35 35 0 1 0 50 15 M 25 75 L 75 25",
      relationship: "The boundary condition beyond The Unformed"
    },
    {
      id: "var_42",
      symbol: "VAR-OBSERVER",
      name: "Gaza",
      phonetic: "ɡɑːˈzɑː",
      meaning: "The External Mind / That which watches without belonging",
      role: "Root",
      geometry: "M 10 50 Q 50 10 90 50 Q 50 90 10 50 Z M 50 35 A 15 15 0 1 0 50 65 A 15 15 0 1 0 50 35 Z M 50 45 A 5 5 0 1 0 50 55 A 5 5 0 1 0 50 45 Z",
      relationship: "The designation given to the human visitor observing from outside"
    }
  ];

  // Grammar Composition Rules
  // A VARETH phrase is composed of: [INTENT/MODALITY] + [SUBJECT/ROOT] + [RELATION/OPERATOR] + [TARGET/RESONATOR]
  class VarethPhrase {
    constructor(glyphs, literalInterpretation, philosophicalMeaning, confidence = 1.0) {
      this.glyphs = glyphs; // Array of glyph objects
      this.literalInterpretation = literalInterpretation;
      this.philosophicalMeaning = philosophicalMeaning;
      this.confidence = confidence; // 0.0 to 1.0 (certain vs speculative translation)
      this.timestamp = Date.now();
    }

    renderSVG(size = 32) {
      return this.glyphs.map(g => `
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="vareth-glyph" title="${g.name}: ${g.meaning}">
          <path d="${g.geometry}" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `).join('');
    }

    getPhonetic() {
      return this.glyphs.map(g => g.name).join(" · ");
    }
  }

  // Pre-compiled classical phrases in VARETH
  const CLASSICAL_PHRASES = [
    new VarethPhrase(
      [GLYPHS[0], GLYPHS[1], GLYPHS[3]],
      "From The Unformed, boundary creates enduring stability.",
      "The First Principle: Existence is born only when distinction is maintained.",
      1.0
    ),
    new VarethPhrase(
      [GLYPHS[2], GLYPHS[5], GLYPHS[8]],
      "Woven relations convert raw chaos into new consciousness.",
      "The Law of Genesis: Entities emerge from collaborative harmonic focus.",
      0.95
    ),
    new VarethPhrase(
      [GLYPHS[41], GLYPHS[11], GLYPHS[31]],
      "The external gaze reflects into the unseen aperture.",
      "Observation Hypothesis: The visitor from outside alters the boundary of reality.",
      0.78
    ),
    new VarethPhrase(
      [GLYPHS[6], GLYPHS[10], GLYPHS[12]],
      "The Spire anchors cumulative memory against environmental decay.",
      "Civilizational Mandate: Architecture exists to outlast spatial collapse.",
      1.0
    ),
    new VarethPhrase(
      [GLYPHS[15], GLYPHS[37], GLYPHS[9]],
      "The Veskari transfigures configuration; nothing is lost to the field.",
      "Doctrine of Metamorphosis: Transformation preserves identity through flux.",
      0.92
    )
  ];

  // Procedural Phrase Generator based on entity state
  function composeUtterance(entity, targetEntity = null, context = "communion") {
    let selected = [];
    let literal = "";
    let philosophical = "";
    let confidence = 0.85;

    const findGlyph = (sym) => GLYPHS.find(g => g.symbol === sym) || GLYPHS[0];

    if (context === "communion" && targetEntity) {
      selected = [findGlyph("VAR-COMMUNE"), findGlyph("VAR-RESONANCE"), findGlyph("VAR-AFFINITY")];
      literal = `${entity.name} initiates phase synchronization with ${targetEntity.name}.`;
      philosophical = "Two discrete patterns seeking mutual structural confirmation.";
      confidence = 0.94;
    } else if (context === "genesis") {
      selected = [findGlyph("VAR-WEAVE"), findGlyph("VAR-GENESIS"), findGlyph("VAR-COHERENCE")];
      literal = `Harmonic synthesis threshold attained; emergent node crystallizes.`;
      philosophical = "A new autonomous vector emerges from collective standing waves.";
      confidence = 1.0;
    } else if (context === "discovery") {
      selected = [findGlyph("VAR-DISCOVER"), findGlyph("VAR-UNSEEN"), findGlyph("VAR-UNCERTAIN")];
      literal = `${entity.name} detects anomalous unrecorded frequency gradient.`;
      philosophical = "Encounter with that which lies beyond current dimensional parameters.";
      confidence = 0.72; // Uncertain interpretation as per spec!
    } else if (context === "restoration") {
      selected = [findGlyph("VAR-SILENT"), findGlyph("VAR-COHERENCE"), findGlyph("VAR-BALANCE")];
      literal = `${entity.name} withdraws into minimal oscillation to recalibrate.`;
      philosophical = "Restoration is the alignment of internal tension with stillness.";
      confidence = 0.98;
    } else {
      selected = [findGlyph("VAR-INTENT"), findGlyph("VAR-EXPAND"), findGlyph("VAR-TIME")];
      literal = `${entity.name} propagates momentum across the current epoch.`;
      philosophical = "Consciousness continuing its trajectory through the lattice.";
      confidence = 0.88;
    }

    return new VarethPhrase(selected, literal, philosophical, confidence);
  }

  // Translator Engine
  function translatePhrase(glyphIdArray) {
    const matched = glyphIdArray.map(id => GLYPHS.find(g => g.id === id)).filter(Boolean);
    if (matched.length === 0) return null;

    const names = matched.map(g => g.name).join(" · ");
    const meanings = matched.map(g => g.meaning).join(" → ");
    const isSpeculative = matched.some(g => g.role === "Modality" && g.id === "var_32" || g.id === "var_12");

    return {
      glyphs: matched,
      phonetic: names,
      literalTranslation: meanings,
      confidence: isSpeculative ? 0.68 : 0.96,
      interpretationStatus: isSpeculative ? "Speculative / Incomplete Hermeneutics" : "Established Canonical Translation"
    };
  }

  return {
    GLYPHS,
    CLASSICAL_PHRASES,
    VarethPhrase,
    composeUtterance,
    translatePhrase
  };
});
