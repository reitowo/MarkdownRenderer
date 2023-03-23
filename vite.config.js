import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue"; 

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => { 
  console.log('Building for', mode);
  return { 
    plugins: [
      Vue() 
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: mode === "github-pages" ? '/MarkdownRenderer/' : '/'
  }
});
