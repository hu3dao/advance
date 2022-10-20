import { createServer } from 'vite';
import { PAGES_PATH, INJECTSCRIPT, configFile, mpaConfig } from '../common/constant.js';
import { resolve } from 'path';
import fs from 'fs';
import { createHtmlPlugin } from 'vite-plugin-html';
import { isExist } from '../common/utils.js';
export async function dev(open) {
    try {
        let openPath = false;
        if (open && isExist(resolve(PAGES_PATH, `./${open}/${mpaConfig.template}`))) {
            openPath = `/${open}/${mpaConfig.template}`;
        }
        // 解决vite-plugin-html在pages文件夹下只有一个文件夹（一个入口文件）时认为是单页应用的BUG：打开页面报404错误
        const pageList = fs.readdirSync(PAGES_PATH);
        let userOptions = undefined;
        if (pageList.length < 1) {
            console.log(`pages文件夹下没有入口`);
            return;
        }
        else if (pageList.length === 1) {
            const page = pageList[0];
            userOptions = {
                entry: `/${page}/${mpaConfig.entry}`,
                template: `./${page}/${mpaConfig.template}`,
                inject: {
                    data: {
                        injectScript: `${INJECTSCRIPT}${mpaConfig.injectScript}`
                    }
                }
            };
        }
        else if (pageList.length > 1) {
            userOptions = {
                pages: pageList.map(page => {
                    return {
                        entry: `/${page}/${mpaConfig.entry}`,
                        filename: `${page}.html`,
                        template: `./src/pages/${page}/${mpaConfig.template}`,
                        injectOptions: {
                            data: {
                                injectScript: `${INJECTSCRIPT}${mpaConfig.injectScript}`
                            }
                        }
                    };
                })
            };
        }
        const server = await createServer({
            configFile,
            root: PAGES_PATH,
            plugins: [
                createHtmlPlugin(userOptions)
            ],
            server: {
                open: openPath
            },
        });
        await server.listen();
        server.printUrls();
    }
    catch (err) {
        console.log(err);
    }
}
