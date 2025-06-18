// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname.replace(/\/$/, '')
      }
    },
    // DEBUG7: 简化配置，让Vite自动处理动态导入
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    optimizeDeps: {
      include: ['src/logic/**/*']
    },
    ssr: {
      noExternal: ['src/logic/**/*']
    }
  },
  integrations: [react(), mdx()]
});