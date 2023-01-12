import { fileURLToPath } from "url";
import { resolve } from "path";

// 当前Node.js进程执行时的文件夹地址
export const CWD = process.cwd();
// 当前文件的路径
export const __dirname = fileURLToPath(import.meta.url);
// 模板路径
export const TEMPLATES = resolve(__dirname, "../../templates");
// 默认项目名称
export const DEFAULT_PROJECT_NAME = "ad-app";
