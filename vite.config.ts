import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify("AIzaSyBkgV1E_1olpoO3P3tpav8lDwrKYWsfa6Q"),
        'process.env.GEMINI_API_KEY': JSON.stringify("AIzaSyBkgV1E_1olpoO3P3tpav8lDwrKYWsfa6Q")
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
