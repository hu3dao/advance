import path from 'path';
import { CWD, PAGES_PATH, CAN_USE_FS_CP_NODE_VERSION } from '../common/constant.js';
import { isExist, ckeckNodeVersion } from '../common/utils.js';
import fs from 'fs';
import chalk from 'chalk';
export async function create({ names, temp }) {
    if (!names || !Array.isArray(names)) {
        console.log(chalk.red('请输入要创建的name'));
        return;
    }
    if (!temp) {
        console.log(chalk.red('请指定模板'));
        return;
    }
    const template = path.resolve(CWD, temp);
    names.forEach(async (name) => {
        const sourceDir = path.resolve(PAGES_PATH, name);
        if (isExist(sourceDir)) {
            console.log(chalk.red(`${name}已存在`));
            return;
        }
        if (!isExist(template)) {
            console.log(chalk.red('模板不存在'));
            return;
        }
        if (ckeckNodeVersion(CAN_USE_FS_CP_NODE_VERSION)) {
            fs.cpSync(template, sourceDir, { recursive: true });
            console.log(chalk.green(`${name}创建成功`));
        }
        else {
            console.error(chalk.red(`node版本需要>=${CAN_USE_FS_CP_NODE_VERSION}`));
        }
    });
}
