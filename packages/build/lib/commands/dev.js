import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import { PAGES_PATH, INJECTSCRIPT, configFile } from '../common/constant.js';
import { resolve } from 'path';
import fs from 'fs';
import { createHtmlPlugin } from 'vite-plugin-html';
import { isExist } from '../common/utils.js';
export async function dev(open) {
    try {
        let openPath = false;
        if (open && isExist(resolve(PAGES_PATH, `./${open}/index.html`))) {
            openPath = `/${open}/index.html`;
        }
        const pages = fs.readdirSync(PAGES_PATH).map(page => {
            return {
                entry: `/${page}/main.ts`,
                filename: `${page}.html`,
                template: `./src/pages/${page}/index.html`,
                injectOptions: {
                    data: {
                        injectScript: INJECTSCRIPT
                    }
                }
            };
        });
        // 解决vite-plugin-html插件在pages只有一个文件或文件夹时识别单页面的BUG
        pages.length === 1 && (pages.push({ entry: '', filename: '', template: '', injectOptions: { data: { injectScript: '' } } }));
        const server = await createServer({
            configFile,
            root: PAGES_PATH,
            plugins: [
                vue(),
                createHtmlPlugin({
                    pages
                })
            ],
            server: {
                open: openPath
            }
        });
        await server.listen();
        server.printUrls();
    }
    catch (err) {
        console.log(err);
    }
}
