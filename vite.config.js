import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    target: 'es2015',
    rollupOptions: {
      input: {
        main: 'index.html',
        portfolio: 'app/myWork.html'
      }
    },
    minify: 'esbuild',
    sourcemap: true
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'app/assets/*',
          dest: 'app/assets'
        }
      ]
    })
  ],
  server: {
    port: 8000,
    open: true
  }
});
