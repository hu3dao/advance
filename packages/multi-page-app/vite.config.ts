import { defineConfig } from 'vite'
import { resolve } from 'path'
import legacy from '@vitejs/plugin-legacy';
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    // vue()
    legacy({
      targets: [
        'Android >= 7',
        'iOS >= 10'
      ]
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router'
      ],
      dts: resolve(__dirname, './auto-imports.d.ts')
    })
  ],
  server: {
    // open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})