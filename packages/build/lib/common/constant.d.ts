declare const CWD: string;
declare const PAGES_PATH: string;
declare const INJECTSCRIPT = "\n                      <script >if (globalThis === undefined) { var globalThis = window; }</script>\n                      ";
declare let configFile: string | false;
declare const MPA_CONFIG_FILE: string;
declare const NODE_VERSION: string;
declare const CAN_USE_FS_CP_NODE_VERSION = "16.7.0";
export { CWD, PAGES_PATH, INJECTSCRIPT, configFile, // vite配置文件的路径
MPA_CONFIG_FILE, NODE_VERSION, CAN_USE_FS_CP_NODE_VERSION };
