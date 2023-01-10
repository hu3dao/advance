import { resolve } from "path";
import { isExist } from "./utils.js";
// 当前Node.js进程执行时的文件夹地址
const CWD = process.cwd();
// 存放多页面的路径
const PAGES_PATH = resolve(CWD, "src/pages");
// 在根目录下查找是否有vite的配置文件
let configFile = false;
// vite可识别的配置文件的文件名
const DEFAULT_CONFIG_FILES = [
    "vite.config.js",
    "vite.config.mjs",
    "vite.config.ts",
    "vite.config.cjs",
    "vite.config.mts",
    "vite.config.cts",
];
DEFAULT_CONFIG_FILES.forEach((file) => {
    const filePath = resolve(CWD, file);
    if (isExist(filePath)) {
        configFile = filePath;
    }
});
const MPA_CONFIG_FILE = resolve(CWD, "mpa.config.mjs");
// NODE的版本
const NODE_VERSION = process.version;
// 能够使用fs模块cp函数的NODE版本
const CAN_USE_FS_CP_NODE_VERSION = "16.7.0";
export { CWD, PAGES_PATH, configFile, // vite配置文件的路径
MPA_CONFIG_FILE, NODE_VERSION, CAN_USE_FS_CP_NODE_VERSION, };
