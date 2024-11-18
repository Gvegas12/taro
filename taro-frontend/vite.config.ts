import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import alias from "@rollup/plugin-alias";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    alias({
      entries: [
        {
          find: "@",
          replacement: resolve("src"),
        },
      ],
    }),
  ],
});
