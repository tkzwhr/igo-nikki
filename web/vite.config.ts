/// <reference types="vitest" />
import * as fs from 'fs';
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import gql from 'vite-plugin-simple-gql';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const conf: Record<string, any> = {
    plugins: [react(), gql.default()],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    test: {
      globals: true,
    },
  };

  if (process.env.VITE_AUTH0 !== "0") {
    conf.server = {
      host: 'localhost.local',
      https: {
        key: fs.readFileSync('./localhost.local-key.pem'),
        cert: fs.readFileSync('./localhost.local.pem'),
      },
    };
  }

  return conf;
});
