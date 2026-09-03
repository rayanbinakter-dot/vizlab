/**
 * CURRICULUM DATA LAYER
 * ---------------------------------------------------------------
 * This is the single source of truth for the whole app.
 * Adding a new visualization = add an entry here + one model file.
 * Nothing else needs to change. Navigation, search, routing, and
 * progress tracking all read from this structure.
 *
 * Hierarchy:  Class -> Subject -> Chapter -> Topic (a 3D concept)
 *
 * Topic fields:
 *   id        unique slug, used in the URL  /learn/:classId/:subjectId/:chapterId/:topicId
 *   title     { en, bn }
 *   concept   { en, bn }  one-line "what will I understand after this"
 *   model     key registered in src/models/registry.js  (null = not built yet)
 *   controls  array of interactive parameters the model exposes
 *   formula   optional LaTeX-ish string shown in the notes panel
 */

export const CLASSES = [
  { id: 'ssc', label: { en: 'Class 9–10 (SSC)', bn: 'নবম-দশম শ্রেণি (এসএসসি)' } },
  { id: 'hsc', label: { en: 'Class 11–12 (HSC)', bn: 'একাদশ-দ্বাদশ শ্রেণি (এইচএসসি)' } },
];

export const SUBJECTS = {
  physics:   { id: 'physics',   name: { en: 'Physics',   bn: 'পদার্থবিজ্ঞান' }, color: '#4f8cff', icon: '⚛' },
  chemistry: { id: 'chemistry', name: { en: 'Chemistry', bn: 'রসায়ন' },        color: '#22c55e', icon: '🧪' },
  biology:   { id: 'biology',   name: { en: 'Biology',   bn: 'জীববিজ্ঞান' },    color: '#f97316', icon: '🧬' },
  math:      { id: 'math',      name: { en: 'Mathematics', bn: 'গণিত' },        color: '#a855f7', icon: '∑' },
};

export const CURRICULUM = {
  /* ============================= SSC ============================= */
  ssc: {
    physics: [
      {
        id: 'motion',
        number: 2,
        title: { en: 'Motion', bn: 'গতি' },
        topics: [
          {
            id: 'projectile',
            title: { en: 'Projectile Motion', bn: 'প্রক্ষেপকের গতি' },
            concept: {
              en: 'Velocity splits into independent horizontal and vertical parts. Gravity only touches the vertical one.',
              bn: 'বেগ আনুভূমিক ও উল্লম্ব দুই স্বাধীন অংশে ভাগ হয়। মাধ্যাকর্ষণ কেবল উল্লম্ব অংশে কাজ করে।',
            },
            model: 'physics/Projectile',
            formula: 'R = v₀² sin(2θ) / g',
            controls: [
              { id: 'speed', label: { en: 'Launch speed v₀', bn: 'নিক্ষেপ বেগ v₀' }, min: 4, max: 18, step: 0.5, value: 10, unit: 'm/s' },
              { id: 'angle', label: { en: 'Angle θ', bn: 'কোণ θ' }, min: 10, max: 80, step: 1, value: 45, unit: '°' },
              { id: 'showVectors', label: { en: 'Show vectors', bn: 'ভেক্টর দেখাও' }, type: 'toggle', value: true },
            ],
          },
          {
            id: 'relative-motion',
            title: { en: 'Relative Velocity', bn: 'আপেক্ষিক বেগ' },
            concept: {
              en: 'The same motion looks completely different from a moving observer.',
              bn: 'একই গতি চলমান পর্যবেক্ষকের কাছে সম্পূর্ণ ভিন্ন দেখায়।',
            },
            model: null,
            controls: [],
          },
        ],
      },
      {
        id: 'waves-sound',
        number: 7,
        title: { en: 'Waves and Sound', bn: 'তরঙ্গ ও শব্দ' },
        topics: [
          {
            id: 'wave-anatomy',
            title: { en: 'Anatomy of a Wave', bn: 'তরঙ্গের গঠন' },
            concept: {
              en: 'Amplitude, wavelength and frequency are three independent dials — change one, see what stays fixed.',
              bn: 'বিস্তার, তরঙ্গদৈর্ঘ্য ও কম্পাঙ্ক তিনটি স্বাধীন নিয়ন্ত্রক।',
            },
            model: 'physics/Wave',
            formula: 'v = f λ',
            controls: [
              { id: 'amplitude', label: { en: 'Amplitude A', bn: 'বিস্তার A' }, min: 0.2, max: 2, step: 0.1, value: 1 },
              { id: 'wavelength', label: { en: 'Wavelength λ', bn: 'তরঙ্গদৈর্ঘ্য λ' }, min: 1, max: 8, step: 0.2, value: 4 },
              { id: 'speed', label: { en: 'Speed', bn: 'গতি' }, min: 0, max: 3, step: 0.1, value: 1 },
            ],
          },
        ],
      },
    ],

    chemistry: [
      {
        id: 'structure-of-matter',
        number: 3,
        title: { en: 'Structure of Matter', bn: 'পদার্থের গঠন' },
        topics: [
          {
            id: 'atom-model',
            title: { en: 'Rutherford–Bohr Atom', bn: 'রাদারফোর্ড-বোর পরমাণু' },
            concept: {
              en: 'Electrons live in fixed shells (K, L, M) — not anywhere they like.',
              bn: 'ইলেকট্রন নির্দিষ্ট শক্তিস্তরে (K, L, M) থাকে।',
            },
            model: 'chemistry/Atom',
            formula: 'max electrons = 2n²',
            controls: [
              { id: 'protons', label: { en: 'Atomic number Z', bn: 'পারমাণবিক সংখ্যা Z' }, min: 1, max: 20, step: 1, value: 11 },
              { id: 'spin', label: { en: 'Orbit speed', bn: 'কক্ষপথ গতি' }, min: 0, max: 2, step: 0.1, value: 0.8 },
            ],
          },
        ],
      },
      {
        id: 'chemical-bonds',
        number: 5,
        title: { en: 'Chemical Bonds', bn: 'রাসায়নিক বন্ধন' },
        topics: [
          {
            id: 'molecular-shapes',
            title: { en: 'Molecular Geometry (VSEPR)', bn: 'অণুর আকৃতি' },
            concept: {
              en: 'Electron pairs push each other as far apart as possible — that alone decides the shape.',
              bn: 'ইলেকট্রন জোড় পরস্পরকে দূরে ঠেলে দেয়, তাই আকৃতি নির্ধারিত হয়।',
            },
            model: 'chemistry/Molecule',
            formula: 'CH₄ = 109.5°  ·  H₂O = 104.5°',
            controls: [
              { id: 'molecule', label: { en: 'Molecule', bn: 'অণু' }, type: 'select',
                options: ['CH4', 'H2O', 'NH3', 'CO2'], value: 'CH4' },
              { id: 'showBondAngle', label: { en: 'Show bond angle', bn: 'বন্ধন কোণ' }, type: 'toggle', value: true },
            ],
          },
        ],
      },
    ],

    biology: [
      {
        id: 'cell-division',
        number: 2,
        title: { en: 'Cell and Cell Division', bn: 'কোষ ও কোষ বিভাজন' },
        topics: [
          {
            id: 'animal-cell',
            title: { en: 'Animal Cell Organelles', bn: 'প্রাণীকোষের অঙ্গাণু' },
            concept: {
              en: 'Peel the cell layer by layer instead of memorising a flat diagram.',
              bn: 'সমতল চিত্র মুখস্থ না করে স্তরে স্তরে কোষ খুলে দেখো।',
            },
            model: 'biology/Cell',
            controls: [
              { id: 'explode', label: { en: 'Explode view', bn: 'বিচ্ছিন্ন দৃশ্য' }, min: 0, max: 1, step: 0.01, value: 0 },
              { id: 'cutaway', label: { en: 'Cutaway', bn: 'অর্ধচ্ছেদ' }, type: 'toggle', value: false },
            ],
          },
        ],
      },
      {
        id: 'heredity',
        number: 12,
        title: { en: 'Heredity and Evolution', bn: 'বংশগতি ও বিবর্তন' },
        topics: [
          {
            id: 'dna-helix',
            title: { en: 'DNA Double Helix', bn: 'ডিএনএ দ্বৈত হেলিক্স' },
            concept: {
              en: 'Two antiparallel strands, base pairs always A–T and G–C.',
              bn: 'দুটি বিপরীতমুখী সূত্রক, ক্ষারক জোড় সর্বদা A–T এবং G–C।',
            },
            model: 'biology/DNA',
            formula: 'A=T  ·  G≡C',
            controls: [
              { id: 'twist', label: { en: 'Twist', bn: 'প্যাঁচ' }, min: 0.2, max: 1.2, step: 0.05, value: 0.55 },
              { id: 'unzip', label: { en: 'Unzip (replication)', bn: 'বিভাজন' }, min: 0, max: 1, step: 0.01, value: 0 },
            ],
          },
        ],
      },
    ],

    math: [
      {
        id: 'mensuration',
        number: 16,
        title: { en: 'Mensuration', bn: 'পরিমিতি' },
        topics: [
          {
            id: 'solids',
            title: { en: 'Volume of 3D Solids', bn: 'ঘনবস্তুর আয়তন' },
            concept: {
              en: 'A cone is exactly one-third of its cylinder. See it, then the formula is obvious.',
              bn: 'শঙ্কু তার সিলিন্ডারের ঠিক এক-তৃতীয়াংশ।',
            },
            model: 'math/Solids',
            formula: 'V_cone = ⅓ π r² h',
            controls: [
              { id: 'shape', label: { en: 'Solid', bn: 'ঘনবস্তু' }, type: 'select',
                options: ['cube', 'cylinder', 'cone', 'sphere'], value: 'cylinder' },
              { id: 'radius', label: { en: 'Radius r', bn: 'ব্যাসার্ধ r' }, min: 0.5, max: 3, step: 0.1, value: 1.5 },
              { id: 'height', label: { en: 'Height h', bn: 'উচ্চতা h' }, min: 0.5, max: 5, step: 0.1, value: 3 },
            ],
          },
        ],
      },
    ],
  },

  /* ============================= HSC ============================= */
  hsc: {
    physics: [
      {
        id: 'vectors',
        number: 2,
        title: { en: 'Vectors', bn: 'ভেক্টর' },
        topics: [
          {
            id: 'vector-ops',
            title: { en: 'Dot and Cross Product', bn: 'ডট ও ক্রস গুণন' },
            concept: {
              en: 'Cross product points perpendicular to both — a fact only 3D can show honestly.',
              bn: 'ক্রস গুণফল উভয়ের লম্ব দিকে থাকে — যা কেবল ত্রিমাত্রিকভাবেই বোঝা যায়।',
            },
            model: 'physics/Vectors',
            formula: 'A×B = |A||B| sinθ n̂',
            controls: [
              { id: 'angle', label: { en: 'Angle between', bn: 'অন্তর্বর্তী কোণ' }, min: 0, max: 180, step: 1, value: 60, unit: '°' },
              { id: 'showCross', label: { en: 'Show A×B', bn: 'A×B দেখাও' }, type: 'toggle', value: true },
            ],
          },
        ],
      },
      {
        id: 'gravitation',
        number: 6,
        title: { en: 'Gravitation', bn: 'মহাকর্ষ' },
        topics: [
          {
            id: 'orbits',
            title: { en: "Kepler's Orbits", bn: 'কেপলারের কক্ষপথ' },
            concept: {
              en: 'Equal areas in equal times — the planet genuinely speeds up near the sun.',
              bn: 'সমান সময়ে সমান ক্ষেত্রফল — সূর্যের কাছে গ্রহ দ্রুত চলে।',
            },
            model: 'physics/Orbit',
            formula: 'T² ∝ a³',
            controls: [
              { id: 'eccentricity', label: { en: 'Eccentricity e', bn: 'উৎকেন্দ্রিকতা e' }, min: 0, max: 0.8, step: 0.01, value: 0.4 },
              { id: 'showAreas', label: { en: 'Show swept area', bn: 'ক্ষেত্রফল দেখাও' }, type: 'toggle', value: true },
            ],
          },
        ],
      },
    ],
    chemistry: [
      {
        id: 'qualitative-chem',
        number: 3,
        title: { en: 'Qualitative Chemistry', bn: 'গুণগত রসায়ন' },
        topics: [
          {
            id: 'orbitals',
            title: { en: 'Atomic Orbitals (s, p, d)', bn: 'পারমাণবিক অরবিটাল' },
            concept: {
              en: 'Orbitals are probability clouds with real 3D shapes — dumbbells, not rings.',
              bn: 'অরবিটাল হলো সম্ভাবনার মেঘ, যার প্রকৃত ত্রিমাত্রিক আকৃতি আছে।',
            },
            model: 'chemistry/Orbital',
            controls: [
              { id: 'type', label: { en: 'Orbital', bn: 'অরবিটাল' }, type: 'select',
                options: ['s', 'px', 'py', 'pz', 'dz2', 'dxy'], value: 'pz' },
            ],
          },
        ],
      },
    ],
    biology: [
      {
        id: 'cell-biology',
        number: 1,
        title: { en: 'Cell and Its Structure', bn: 'কোষ ও এর গঠন' },
        topics: [
          {
            id: 'protein-synthesis',
            title: { en: 'Protein Synthesis', bn: 'প্রোটিন সংশ্লেষণ' },
            concept: {
              en: 'Transcription then translation, as a pipeline you can step through.',
              bn: 'ট্রান্সক্রিপশন ও ট্রান্সলেশন — ধাপে ধাপে দেখো।',
            },
            model: null,
            controls: [],
          },
        ],
      },
    ],
    math: [
      {
        id: 'coordinate-geometry-3d',
        number: 11,
        title: { en: '3D Coordinate Geometry', bn: 'ত্রিমাত্রিক স্থানাঙ্ক জ্যামিতি' },
        topics: [
          {
            id: 'surfaces',
            title: { en: 'Surfaces z = f(x, y)', bn: 'তল z = f(x, y)' },
            concept: {
              en: 'A function of two variables is a landscape, not a line.',
              bn: 'দুই চলকের ফাংশন একটি ভূদৃশ্য, রেখা নয়।',
            },
            model: 'math/Surface',
            formula: 'z = sin(ax)·cos(ay)',
            controls: [
              { id: 'fn', label: { en: 'Function', bn: 'ফাংশন' }, type: 'select',
                options: ['sin·cos', 'saddle', 'paraboloid', 'ripple'], value: 'sin·cos' },
              { id: 'freq', label: { en: 'Frequency a', bn: 'কম্পাঙ্ক a' }, min: 0.2, max: 2.5, step: 0.05, value: 0.8 },
              { id: 'animate', label: { en: 'Animate', bn: 'সচল' }, type: 'toggle', value: true },
            ],
          },
        ],
      },
    ],
  },
};

/* ------------------------- helper selectors ------------------------- */

export function getChapters(classId, subjectId) {
  return CURRICULUM[classId]?.[subjectId] ?? [];
}

export function getTopic(classId, subjectId, chapterId, topicId) {
  const ch = getChapters(classId, subjectId).find((c) => c.id === chapterId);
  const topic = ch?.topics.find((t) => t.id === topicId);
  return topic ? { chapter: ch, topic } : null;
}

/** Flatten everything into a searchable list. */
export function allTopics() {
  const out = [];
  for (const classId of Object.keys(CURRICULUM)) {
    for (const subjectId of Object.keys(CURRICULUM[classId])) {
      for (const chapter of CURRICULUM[classId][subjectId]) {
        for (const topic of chapter.topics) {
          out.push({ classId, subjectId, chapter, topic });
        }
      }
    }
  }
  return out;
}

export function stats() {
  const all = allTopics();
  return { total: all.length, built: all.filter((t) => t.topic.model).length };
}
