import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
  define: {
    "process.env.NODE_ENV": "'production'"
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "StimulusReactivity",
      fileName: "stimulus-reactivity",
    }
  },
})