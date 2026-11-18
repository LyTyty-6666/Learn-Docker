import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function spaFallbackPlugin() {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const rootDir = typeof import.meta.dirname === 'string' ? import.meta.dirname : process.cwd();
      const distIndex = path.resolve(rootDir, 'dist', 'index.html');
      const dist200 = path.resolve(rootDir, 'dist', '200.html');
      if (fs.existsSync(distIndex)) {
        fs.copyFileSync(distIndex, dist200);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallbackPlugin()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
    ],
  },
  define: {
    global: 'window',
    __DEV__: JSON.stringify(true),
  },
  server: {
    port: 3000,
    host: true,
  },
});
