/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import * as fs from 'fs';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost.local',
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
  },
  resolve: {
    alias: [
      { find: 'preact/hooks', replacement: 'react' },
      { find: 'preact', replacement: 'react' },
      { find: '@', replacement: '/src' },
    ],
  },
  test: {
    globals: true,
  },
});
