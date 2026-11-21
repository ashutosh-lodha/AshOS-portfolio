import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const sha = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local').slice(0, 7);
const builtAt = new Date().toISOString();

// The site is AshOS: index.html + os/, with shared data in src/shared/.
export default defineConfig({
  base: '/',
  publicDir: resolve(__dirname, 'public'),
  server: { fs: { allow: [__dirname] } },
  define: {
    __BUILD_SHA__: JSON.stringify(sha),
    __BUILD_TIME__: JSON.stringify(builtAt),
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: { main: resolve(__dirname, 'index.html') },
    },
  },
});
