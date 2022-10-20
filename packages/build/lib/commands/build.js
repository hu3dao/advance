import { build as viteBuild } from 'vite';
import path from 'path';
import { CWD, INJECTSCRIPT, PAGES_PATH, configFile, mpaConfig } from '../common/constant.js';
import fs from 'fs';
import { createHtmlPlugin } from 'vite-plugin-html';
import { deleteSync } from 'del';
import { isExist } from '../common/utils.js';
const compile = (page) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 不是文件夹的直接跳过
            if (!fs.statSync(path.resolve(PAGES_PATH, `./${page}`)).isDirectory()) {
                reject();
                return;
            }
            console.log(`开始打包${page}`);
            const entry = path.resolve(PAGES_PATH, `./${page}/${mpaConfig.template}`);
            // 判断入口文件是否存在
            if (!isExist(entry)) {
                console.log(`${page}的入口文件不存在`);
                reject();
                return;
            }
            const outDir = path.resolve(CWD, `./dist/${page}`);
            // 删除旧的打包资源
            deleteSync(outDir);
            await viteBuild({
                configFile,
                root: path.resolve(PAGES_PATH, page),
                base: './',
                plugins: [
                    createHtmlPlugin({
                        entry: `/${mpaConfig.entry}`,
                        template: `${mpaConfig.template}`,
                        inject: {
                            data: {
                                injectScript: `${INJECTSCRIPT}${mpaConfig.injectScript}`
                            }
                        }
                    })
                ],
                build: {
                    outDir
                }
            });
            console.log(`${page}打包成功`);
            resolve(`${page}打包成功`);
        }
        catch (err) {
            console.log('err====>', err);
            reject(err);
        }
    });
};
export async function build({ all, pages }) {
    const buildPages = all ? fs.readdirSync(PAGES_PATH) : pages;
    if (!Array.isArray(buildPages)) {
        console.log('请输入要打包的页面');
        return;
    }
    // 递归实现按顺序打包
    const runner = async () => {
        if (!buildPages || !buildPages.length)
            return;
        const page = buildPages.shift();
        try {
            await compile(page);
        }
        catch (error) {
        }
        runner();
    };
    runner();
}
