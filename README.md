# ◈ VizLab

**Interactive 3D science visualizations, mapped chapter-by-chapter to the NCTB SSC & HSC syllabus.**

Students don't struggle with formulas — they struggle to *picture* what the formula
describes. VizLab replaces the flat textbook diagram with something you can rotate,
slice, and drive with a slider.

## Features

- **Chapter-wise navigation** — Class → Subject → Chapter → Topic, exactly like the syllabus
- **11 interactive 3D models** across Physics, Chemistry, Biology, Mathematics
- **Bilingual** — full English / বাংলা toggle
- **Live parameter controls** — every model exposes sliders, toggles and dropdowns
- **Instant search** — find a concept in either language
- **Code-split** — each model is a ~1.5 kB lazy chunk; the app stays fast as content grows

## Stack

React 19 · Vite · react-three-fiber · drei · zustand · react-router

## Quick start

```bash
npm install
npm run dev
```

## Adding a visualization

Three files, no plumbing — see [`SETUP.md`](./SETUP.md) §7.

1. Add the topic to `src/data/curriculum.js`
2. Create `src/models/<subject>/<Name>.jsx` receiving a single `params` prop
3. Register the key in `src/models/registry.js`

Navigation, search, routing, and controls generate themselves.

## Docs

Full setup, GitHub workflow, deployment and roadmap: **[SETUP.md](./SETUP.md)**

## License

MIT
