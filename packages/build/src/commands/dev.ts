import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { PAGES_PATH, INJECTSCRIPT, configFile } from '../common/constant.js'
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

    // 解决vite-plugin-html在pages文件夹下只有一个文件夹（一个入口文件）时认为是单页应用的BUG：打开页面报404错误
    const pageList = fs.readdirSync(PAGES_PATH)
    let userOptions: any = undefined
    if (pageList.length < 1) {
      console.log(`pages文件夹下没有入口`);
      return
    } else if (pageList.length === 1) {
      const page = pageList[0]
      userOptions = {
        entry: `/${page}/main.ts`,
        template: `./${page}/index.html`,
        inject: {
          data: {
            injectScript: INJECTSCRIPT
          }
        }
      }
    } else if (pageList.length > 1) {
      userOptions = {
        pages: pageList.map(page => {
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
      }
    }
    const server = await createServer({
      configFile,
      root: PAGES_PATH,
      plugins: [
        vue(),
        createHtmlPlugin(userOptions)
      ],
      server: {
        open: openPath
      },
    })
    await server.listen();
    server.printUrls();
  } catch (err) {
    console.log(err);
  }
}