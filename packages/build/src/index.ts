import fs from "fs";
import { URL, fileURLToPath } from "url";

const packagePath = fileURLToPath(new URL("../package.json", import.meta.url));
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
export const cliVersion: string = packageJson.version;

process.env.ZA_BUILD_PROJECT_VITE_VERSION = cliVersion;
