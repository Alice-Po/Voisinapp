import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    mode: 'developpement',
    define: {
      'process.env': process.env
    },
    server: {
      host: true,
      port: parseInt(env.VITE_PORT)
    },
    preview: {
      port: 4004 // Use same port as dev mode, to avoid redirection problems when testing build
    },
    base: '/'
  };
});
