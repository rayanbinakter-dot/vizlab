import { lazy } from 'react';

/**
 * MODEL REGISTRY
 * Every 3D visualization is code-split and loaded on demand,
 * so the homepage stays fast no matter how many models exist.
 *
 * To add a model:
 *   1. create src/models/<subject>/<Name>.jsx  exporting default component
 *   2. register the key here
 *   3. reference that key as `model:` in curriculum.js
 */
export const MODELS = {
  'physics/Projectile': lazy(() => import('./physics/Projectile.jsx')),
  'physics/Wave':       lazy(() => import('./physics/Wave.jsx')),
  'physics/Vectors':    lazy(() => import('./physics/Vectors.jsx')),
  'physics/Orbit':      lazy(() => import('./physics/Orbit.jsx')),
  'chemistry/Atom':     lazy(() => import('./chemistry/Atom.jsx')),
  'chemistry/Molecule': lazy(() => import('./chemistry/Molecule.jsx')),
  'chemistry/Orbital':  lazy(() => import('./chemistry/Orbital.jsx')),
  'biology/DNA':        lazy(() => import('./biology/DNA.jsx')),
  'biology/Cell':       lazy(() => import('./biology/Cell.jsx')),
  'math/Surface':       lazy(() => import('./math/Surface.jsx')),
  'math/Solids':        lazy(() => import('./math/Solids.jsx')),
};

export const hasModel = (key) => Boolean(key && MODELS[key]);
