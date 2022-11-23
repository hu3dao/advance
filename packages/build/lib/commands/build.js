import { build as viteBuild } from "vite";
import path from "path";
import { CWD, configFile } from "../common/constant.js";
import fs from "fs";
import { deleteSync } from "del";
import { isExist, resolveConfig } from "../common/utils.js";
import chalk from "chalk";
// 拷贝静态资源
const copy = (copyStatic) => {
    if (!copyStatic)
        return;
    copyStatic.forEach((dir) => {
        const source = path.resolve(CWD, dir.from);
        const destination = path.resolve(CWD, dir.to);
        if (!isExist(source)) {
            return;
        }
        fs.cpSync(source, destination, { recursive: true });
    });
};
// 打包操作
const compile = (page, PAGES_PATH, mode) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 不是文件夹的直接跳过
            if (!fs.statSync(path.resolve(PAGES_PATH, `./${page}`)).isDirectory()) {
                reject();
                return;
            }
            console.log(chalk.green(`开始打包${page}`));
            const outDir = path.resolve(CWD, `./dist/${page}`);
            // 删除旧的打包资源
            deleteSync(outDir);
            await viteBuild({
                configFile,
                root: path.resolve(PAGES_PATH, page),
                base: "./",
                mode,
                build: {
                    outDir,
                },
            });
            console.log(chalk.green(`${page}打包成功`));
            resolve(`${page}打包成功`);
        }
        catch (err) {
            console.log(chalk.red(err));
            reject(err);
        }
    });
};
export async function build({ all, page, mode, }) {
    const { root = "src/pages", copyStatic } = await resolveConfig("build", mode || "production");
    const PAGES_PATH = path.resolve(CWD, root);
    const buildPages = all ? fs.readdirSync(PAGES_PATH) : page;
    if (!Array.isArray(buildPages)) {
        console.log(chalk.red("请输入要打包的页面"));
        return;
    }
    // 递归实现按顺序打包
    const runner = async () => {
        if (!buildPages || !buildPages.length)
            return;
        const page = buildPages.shift();
        try {
            await compile(page, PAGES_PATH, mode || "production");
        }
        catch (error) { }
        runner();
    };
    runner();
    // 拷贝文件
    copy(copyStatic);
}
