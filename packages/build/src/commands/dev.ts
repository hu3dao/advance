import {createServer} from 'vite'
import vue from '@vitejs/plugin-vue'
import {CWD, PAGES_PATH, INJECTSCRIPT} from '../common/constant.js'
import {resolve} from 'path'
import fs from 'fs'
import {createHtmlPlugin} from 'vite-plugin-html'

const configFileOfTs = resolve(CWD, 'vite.config.ts')
const configFileOfJs = resolve(CWD, 'vite.config.js')
let configFile: string | false = false
if(fs.existsSync(configFileOfTs)) {
  configFile= configFileOfTs
} else if(fs.existsSync(configFileOfJs)) {
  configFile= configFileOfJs
}


export async function dev(open: string | false) {
  let openPath: string | false = false
  if(open && fs.existsSync(resolve(PAGES_PATH, `./${open}/index.html`))) {
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
            template: `src/pages/${page}/index.html`,
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
}