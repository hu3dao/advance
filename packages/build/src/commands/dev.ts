import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { PAGES_PATH, INJECTSCRIPT, configFile, CWD } from '../common/constant.js'
import { resolve } from 'path'
import fs from 'fs'
import { createHtmlPlugin } from 'vite-plugin-html'
import { isExist } from '../common/utils.js'

export async function dev(open: string | false) {
  try {
    let openPath: string | false = false
    if (open && isExist(resolve(PAGES_PATH, `./${open}/index.html`))) {
      openPath = `/${open}/index.html`
    }
    const server = await createServer({
      configFile,
      root: PAGES_PATH,
      plugins: [
        vue(),
        createHtmlPlugin({
          pages: fs.readdirSync(PAGES_PATH).map(page => {
            return {
              entry: `/${page}/main.ts`,
              filename: `${page}.html`,
              template: `./src/pages/${page}/index.html`,
              injectOptions: {
                data: {
                  injectScript: INJECTSCRIPT
                }
              }
            }
          })
        })
      ],
      server: {
        open: openPath
      }
    })
    await server.listen();
    server.printUrls();
  } catch (err) {
    console.log(err);
  }
}