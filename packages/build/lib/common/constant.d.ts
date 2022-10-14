declare const CWD: string;
declare const PAGES_PATH: string;
declare const INJECTSCRIPT = "\n                      <script >if (globalThis === undefined) { var globalThis = window; }</script>\n                      ";
declare let configFile: string | false;
declare const TEMPLATE_PATH: string;
export { CWD, PAGES_PATH, INJECTSCRIPT, configFile, // vite配置文件的路径
TEMPLATE_PATH };
