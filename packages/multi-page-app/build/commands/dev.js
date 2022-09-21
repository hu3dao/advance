import {createServer} from 'vite'
import fs from 'fs'
import vue from '@vitejs/plugin-vue'
import {createHtmlPlugin} from 'vite-plugin-html'
import {PAGES_PATH, INJECTSCRIPT} from '../common/constant.js'
import chalk from 'chalk'
import {parseArgs} from '../common/utils.js'

let argvArr = []

if (process.env.npm_config_argv) { // 通过 npm run xx 调用
  argvArr = JSON.parse(process.env.npm_config_argv).original.slice(2);
} else { // 通过 node xxx 调用
  argvArr = process.argv.slice(2);
}

const argsMap = parseArgs(argvArr)

let open = argsMap.open ? `/${argsMap.open}/index.html` : false

const server = await createServer({
  // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
  configFile: false,
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
    open 
  }
})

try {
  const res = await server.listen()
  console.log(chalk.green(`服务启动在: ${res.resolvedUrls.local}`));
} catch (error) {
  console.log(chalk.red(`启动失败,失败原因: ${error}`));
}

