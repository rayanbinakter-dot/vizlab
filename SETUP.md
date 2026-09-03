# VizLab — Setup, GitHub & Workflow Guide

Everything you need to run this on your PC and connect it to GitHub.
Commands are written for **Windows CMD / PowerShell**.

---

## 1. One-time software install

Install these on your PC (in this order):

| Tool | Link | Check it worked |
|---|---|---|
| **Node.js 20 LTS** | nodejs.org | `node -v` → `v20.x` |
| **Git** | git-scm.com | `git --version` |
| **VS Code** | code.visualstudio.com | — |
| **GitHub Desktop** *(optional, easier)* | desktop.github.com | — |

> During Git install, accept all defaults. During Node install, tick
> "Automatically install the necessary tools" if asked.

**VS Code extensions worth installing:** ESLint, Prettier, ES7 React Snippets.

---

## 2. Get the project onto your PC

Download the `vizlab` folder from this workspace, put it somewhere sane like
`C:\projects\vizlab`, then:

```cmd
cd C:\projects\vizlab
npm install
npm run dev
```

Open **http://localhost:5173**. That's it.

> `npm install` takes 1–3 minutes the first time. It creates `node_modules`,
> which is ~300 MB and is **never** committed to git (already in `.gitignore`).

---

## 3. Connect to GitHub

### 3a. Create the empty repo
Go to github.com → **New repository** → name it `vizlab` →
**do NOT** tick "Add a README" → Create.

### 3b. Push from CMD

```cmd
cd C:\projects\vizlab

git init
git add .
git commit -m "initial commit: VizLab 3D learning platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/vizlab.git
git push -u origin main
```

Replace `YOUR-USERNAME`. Git will pop up a browser window to log in the first time.

> If it asks for a password in the terminal, use a **Personal Access Token**,
> not your GitHub password: GitHub → Settings → Developer settings →
> Personal access tokens → Tokens (classic) → Generate, tick `repo`.

---

## 4. Daily workflow (the loop you'll repeat forever)

```cmd
cd C:\projects\vizlab

git pull                      :: get latest (important if 2+ people)
npm run dev                   :: start server, leave it running

:: ... edit files in VS Code, browser auto-reloads ...

git add .
git commit -m "add: chemistry electrolysis model"
git push
```

### Working on a feature safely (recommended once the project is real)

```cmd
git checkout -b feat/electrolysis-model
:: ...do the work, commit...
git push -u origin feat/electrolysis-model
```
Then open a **Pull Request** on GitHub, review your own diff, merge to `main`.
This keeps `main` always working.

### Commit message convention
```
feat:  new feature / new model
fix:   bug fix
docs:  documentation only
style: formatting, no logic change
refactor: restructure, no behaviour change
chore: deps, config, tooling
```

---

## 5. Deploy the website (free)

### Option A — Vercel (recommended, easiest, custom domain free)
1. vercel.com → Sign in with GitHub
2. **Add New → Project** → pick `vizlab`
3. Framework preset: **Vite** (auto-detected). Click Deploy.
4. Done — you get `vizlab.vercel.app`, and **every `git push` auto-redeploys**.

### Option B — Netlify
Same flow. Build command `npm run build`, publish directory `dist`.

### Option C — GitHub Pages
Already wired up via `.github/workflows/deploy.yml`.
1. In `vite.config.js`, **uncomment** `base: '/vizlab/'`
2. Repo → Settings → Pages → Source: **GitHub Actions**
3. `git push` → live at `yourusername.github.io/vizlab`

> Vercel is the better choice — no `base` path headaches, instant previews per branch.

---

## 6. Project structure — where everything lives

```
vizlab/
├─ .github/workflows/deploy.yml   CI: build + deploy on push
├─ public/                        static files served as-is
├─ src/
│  ├─ data/
│  │  └─ curriculum.js       ★ SINGLE SOURCE OF TRUTH
│  │                           all classes, subjects, chapters, topics
│  ├─ models/                  the 3D visualizations
│  │  ├─ registry.js         ★ maps "physics/Wave" → lazy component
│  │  ├─ physics/            Projectile, Wave, Vectors, Orbit
│  │  ├─ chemistry/          Atom, Molecule, Orbital
│  │  ├─ biology/            DNA, Cell
│  │  └─ math/               Surface, Solids
│  ├─ components/
│  │  ├─ Scene.jsx           shared Canvas + lights + OrbitControls
│  │  ├─ Controls.jsx        auto-builds sliders/toggles/dropdowns
│  │  ├─ Sidebar.jsx         chapter tree navigation
│  │  └─ Search.jsx          bilingual concept search
│  ├─ pages/
│  │  ├─ Home.jsx            landing + topic cards
│  │  └─ Viewer.jsx          the 3D learning screen
│  ├─ store/useStore.js      language, class, progress (persisted)
│  ├─ styles/global.css      design tokens + all styling
│  ├─ App.jsx                layout + routes
│  └─ main.jsx               entry point
├─ vite.config.js
└─ package.json
```

**The key architectural idea:** `curriculum.js` drives everything.
Navigation, search, routing, cards, and the controls panel are all *generated*
from that one file. You never hand-write a page.

---

## 7. How to add a new visualization (the only workflow that matters)

Say you want **Ohm's Law** in SSC Physics.

### Step 1 — add the topic to `src/data/curriculum.js`

Inside `ssc.physics`, add a chapter (or use an existing one):

```js
{
  id: 'current-electricity',
  number: 11,
  title: { en: 'Current Electricity', bn: 'চল বিদ্যুৎ' },
  topics: [
    {
      id: 'ohms-law',
      title: { en: "Ohm's Law", bn: 'ওহমের সূত্র' },
      concept: {
        en: 'Voltage, current and resistance are locked together — move one, another must move.',
        bn: 'বিভব, প্রবাহ ও রোধ পরস্পর সম্পর্কিত।',
      },
      model: 'physics/OhmsLaw',
      formula: 'V = I × R',
      controls: [
        { id: 'voltage',    label: { en: 'Voltage V', bn: 'বিভব V' }, min: 1, max: 24, step: 1, value: 12, unit: 'V' },
        { id: 'resistance', label: { en: 'Resistance R', bn: 'রোধ R' }, min: 1, max: 100, step: 1, value: 10, unit: 'Ω' },
      ],
    },
  ],
}
```

### Step 2 — create `src/models/physics/OhmsLaw.jsx`

```jsx
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useRef } from 'react';

export default function OhmsLaw({ params }) {
  const { voltage = 12, resistance = 10 } = params;
  const current = voltage / resistance;
  // ...build your meshes, animate electrons at speed ∝ current...
  return (
    <group>
      <Text position={[0, -3, 0]} fontSize={0.4} color="#e2e8f0">
        {`I = V/R = ${current.toFixed(2)} A`}
      </Text>
    </group>
  );
}
```

**Contract:** every model receives exactly one prop — `params` — an object whose
keys are the `control.id`s you declared. Nothing else.

### Step 3 — register it in `src/models/registry.js`

```js
'physics/OhmsLaw': lazy(() => import('./physics/OhmsLaw.jsx')),
```

### Step 4 — commit

```cmd
git add .
git commit -m "feat: add Ohm's Law visualization"
git push
```

Sidebar entry, home card, search result, URL, and the control sliders all appear
automatically. **Three files, no plumbing.**

---

## 8. Roadmap — realistic phases

**Phase 1 (done)** — architecture, navigation, 11 reference models, bilingual, deploy pipeline

**Phase 2 — content depth**
- Fill every SSC chapter (~40 topics). Aim 2–3 models/week.
- Recruit topics from past-paper questions students actually fail.

**Phase 3 — learning features**
- "Check your understanding" — 3 MCQs per topic, stored in `curriculum.js`
- Progress tracking (store already has `visited`)
- Guided tour: camera flies to labelled parts in sequence

**Phase 4 — reach**
- PWA / offline (`vite-plugin-pwa`) — huge for patchy mobile data
- AR view on phones via `<model-viewer>` for the static models
- Teacher mode: shareable URL with preset slider values

**Phase 5 — scale**
- Supabase for accounts + saved progress
- Analytics on which topics get replayed most → that's your syllabus gap data

---

## 9. Common problems

| Problem | Fix |
|---|---|
| `npm` not recognised | Reinstall Node, restart CMD |
| Port 5173 in use | `npx kill-port 5173` or change port in `vite.config.js` |
| Blank white page | Open browser DevTools (F12) → Console → read the error |
| `git push` rejected | `git pull --rebase` then push again |
| 3D scene is slow | Reduce grid segments (`N`) in the model, lower `dpr` in `Scene.jsx` |
| Bangla text missing | Install "Noto Sans Bengali" font, already referenced in CSS |
| Model not showing | Check the `model:` key in curriculum.js **exactly** matches registry.js |

---

## 10. Commands cheat sheet

```cmd
npm install          :: install dependencies (first time / after git pull)
npm run dev          :: dev server with hot reload  → localhost:5173
npm run build        :: production build into dist/
npm run preview      :: serve the production build locally

git status           :: what changed
git add .            :: stage everything
git commit -m "msg"  :: save a snapshot
git push             :: upload to GitHub
git pull             :: download latest
git log --oneline    :: history
git checkout -b name :: new branch
git switch main      :: go back to main
```
