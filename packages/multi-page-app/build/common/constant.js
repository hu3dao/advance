import {resolve} from 'path'

// 当前Node.js进程执行时的文件夹地址
const CWD = process.cwd()
const PAGES_PATH = resolve(CWD, 'src/pages')
const INJECTSCRIPT = `
                      <script >if (globalThis === undefined) { var globalThis = window; }</script>
                      `

export {
  CWD,
  PAGES_PATH,
  INJECTSCRIPT
}