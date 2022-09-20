import {build} from 'vite'
import {resolve} from 'path'
import fs from 'fs'
import {deleteSync} from 'del'
import vue from '@vitejs/plugin-vue'
import {createHtmlPlugin} from 'vite-plugin-html'
import { CWD, INJECTSCRIPT, PAGES_PATH } from '../common/constant.js'
import chalk from 'chalk'
import {parseArgs} from '../common/utils.js'

let argvArr = []

if (process.env.npm_config_argv) { // 通过 npm run xx 调用
  argvArr = JSON.parse(process.env.npm_config_argv).original.slice(2);
} else { // 通过 node xxx 调用
  argvArr = process.argv.slice(2);
}


const argsMap = parseArgs(argvArr)

let pages = argsMap.page
if (!pages) {
  console.log(chalk.red('请输入需要打包的页面'));
  // 退出node进程
  process.exit(0)
}
pages = pages === 'all' ? fs.readdirSync(PAGES_PATH) : pages.split(',')

pages.forEach(async (page) => {
  const entry = resolve(CWD, `src/pages/${page}/index.html`)
  // 判断文件是否存在
  const isExist = fs.existsSync(entry)
  if(!isExist) {
    console.log(chalk.red(`${page}的入口文件不存在`));
    return 
  }
  const outDir = resolve(CWD, `dist/${page}`)
  // 删除之前打包的文件
  deleteSync(outDir)
  try {
    const res = await build({
      root: resolve(PAGES_PATH, page),
      base: './',
      plugins: [
        vue(),
        createHtmlPlugin({
          entry: '/main.ts',
          template: 'index.html',
          inject: {
            data: {
              injectScript: INJECTSCRIPT
            }
          }
        })
      ],
      build: {
        outDir
      }
    })
  } catch (error) {
    console.log(chalk.red(`${page}打包失败,失败原因: ${error}`));
  }
})
