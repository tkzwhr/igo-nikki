/// <reference types="vitest" />
import * as fs from "fs";
import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => (
  {
    plugins: [react()],
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    test: {
      globals: true,
    },
  }
));
