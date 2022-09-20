import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import {createHtmlPlugin} from 'vite-plugin-html'
import fs from 'fs'

const injectScript = `<script >if (globalThis === undefined) { var globalThis = window; }</script>`

const PAGES_PATH = resolve(__dirname, 'src/pages')

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src/pages'),
  plugins: [
    vue(),
    createHtmlPlugin({
      pages: fs.readdirSync(PAGES_PATH).map(page => {
        return {
          entry: `/${page}/main.ts`,
          filename: `${page}.html`,
          template: `/src/pages/${page}/index.html`,
          injectOptions: {
            data: {
              injectScript
            }
          }
        }
      })
    })
  ],
})
