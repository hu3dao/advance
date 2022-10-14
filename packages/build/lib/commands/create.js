import path from 'path';
import { CWD, PAGES_PATH, TEMPLATE_PATH } from '../common/constant.js';
import { copy, isExist } from '../common/utils.js';
import fs from 'fs';
import chalk from 'chalk';
export async function create({ names, temp }) {
    if (!names || !Array.isArray(names)) {
        console.log(chalk.red('请输入要创建的name'));
        return;
    }
    const template = temp ? path.resolve(CWD, temp) : TEMPLATE_PATH;
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
        fs.mkdirSync(sourceDir);
        copy(template, sourceDir);
        console.log(chalk.green(`${name}创建成功`));
    });
}
