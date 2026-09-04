import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `command` is 'serve' during `npm run dev` and 'build' during `npm run build`.
// This is reliable everywhere (local PC, GitHub Actions), unlike NODE_ENV.
export default defineConfig(({ command }) => ({
  plugins: [react()],

  // On localhost -> '/'          (http://localhost:5173/)
  // On GitHub Pages -> '/vizlab/' (https://USER.github.io/vizlab/)
  // If you ever rename the repo, change 'vizlab' below to the new name.
  base: command === 'build' ? '/vizlab/' : '/',

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: true,
  },

  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },

  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('@react-three')) return 'r3f';
          return null;
        },
      },
    },
  },
}));
