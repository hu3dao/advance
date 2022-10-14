import { resolve } from 'path';
import { isExist } from './utils.js';
import { fileURLToPath } from 'url';
// 当前Node.js进程执行时的文件夹地址
const CWD = process.cwd();
// 存放多页面的路径
const PAGES_PATH = resolve(CWD, 'src/pages');
// 需要注入的js代码，解决在ios12以下机型在dev server白屏问题
const INJECTSCRIPT = `
                      <script >if (globalThis === undefined) { var globalThis = window; }</script>
                      `;
// 在根目录下查找是否有vite的配置文件
const configFileOfTs = resolve(CWD, 'vite.config.ts');
const configFileOfJs = resolve(CWD, 'vite.config.js');
let configFile = false;
if (isExist(configFileOfTs)) {
    configFile = configFileOfTs;
}
else if (isExist(configFileOfJs)) {
    configFile = configFileOfJs;
}
// 模板的路径
const TEMPLATE_PATH = resolve(fileURLToPath(import.meta.url), '../../../template');
export { CWD, PAGES_PATH, INJECTSCRIPT, configFile, // vite配置文件的路径
TEMPLATE_PATH };
