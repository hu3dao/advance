import { build as viteBuild } from 'vite';
import { resolve } from 'path';
import { CWD, INJECTSCRIPT, PAGES_PATH, configFile } from '../common/constant.js';
import fs from 'fs';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import { deleteSync } from 'del';
import { isExist } from '../common/utils.js';
export async function build({ all, pages }) {
    try {
        const buildPages = all ? fs.readdirSync(PAGES_PATH) : pages;
        if (!Array.isArray(buildPages)) {
            console.log('请输入要打包的页面');
            return;
        }
        buildPages.forEach(async (page) => {
            // 不是文件夹的直接跳过
            if (!fs.statSync(resolve(PAGES_PATH, `./${page}`)).isDirectory()) {
                return;
            }
            const entry = resolve(PAGES_PATH, `./${page}/index.html`);
            // 判断入口文件是否存在
            if (!isExist(entry)) {
                console.log(`${page}的入口文件不存在`);
                return;
            }
            const outDir = resolve(CWD, `./dist/${page}`);
            // 删除之前的打包资源
            deleteSync(outDir);
            await viteBuild({
                configFile,
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
            });
        });
    }
    catch (error) {
        console.log('error---', error);
    }
}
