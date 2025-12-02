import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ensure asset URLs resolve correctly when loaded via file:// in Electron
export default defineConfig({
  plugins: [react()],
  base: './'
});
