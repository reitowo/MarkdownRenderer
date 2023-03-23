import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue"; 

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => { 
  const BASE_ROUTE = process.env.VUE_APP_BASE_ROUTE || '/' 
  console.log('Base Route', BASE_ROUTE);
  return { 
    plugins: [
      Vue() 
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: BASE_ROUTE
  }
});
