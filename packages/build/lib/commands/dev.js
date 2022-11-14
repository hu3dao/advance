import { createServer } from "vite";
import { configFile, CWD } from "../common/constant.js";
import { resolve } from "path";
import { isExist, resolveConfig } from "../common/utils.js";
export async function dev({ open, mode, }) {
    try {
        let openPath = false;
        const { root = "src/pages" } = await resolveConfig("dev", mode || "development");
        const PAGES_PATH = resolve(CWD, root);
        if (open && isExist(resolve(PAGES_PATH, `./${open}/index.html`))) {
            openPath = `/${open}/index.html`;
        }
        const server = await createServer({
            configFile,
            root: PAGES_PATH,
            server: {
                open: openPath,
            },
        });
        await server.listen();
        server.printUrls();
    }
    catch (err) {
        console.log(err);
    }
}
