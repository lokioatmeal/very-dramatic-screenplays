import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  base: '/very-dramatic-screenplays/',
  build: {
    outDir: '../dist',
  },
});
