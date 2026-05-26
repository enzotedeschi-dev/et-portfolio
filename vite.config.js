import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
          if (id.includes('node_modules/lenis') || id.includes('node_modules/@studio-freight/lenis')) {
            return 'lenis';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
    reportCompressedSize: true,
  },
});
