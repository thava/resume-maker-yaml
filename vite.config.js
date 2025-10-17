import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'dist',
  publicDir: false,
  build: {
    outDir: '../build',
    emptyOutDir: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    open: true,
  },
});
