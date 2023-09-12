import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { terser } from 'rollup-plugin-terser'; // Import the terser plugin

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      // Add the terser plugin to the rollupOptions
      plugins: [terser({ compress: { drop_console: true } })],
    },
  },
});
