import fs from 'fs';
import path from 'path';
// 判断文件是否存在
const isExist = (path) => {
    return fs.existsSync(path);
};
// 复制
const copy = (srcDir, desDir) => {
    const sourceFile = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const file of sourceFile) {
        // 源文件 地址+文件名
        const srcFile = path.resolve(srcDir, file.name);
        // 目标文件
        const tagFile = path.resolve(desDir, file.name);
        // 文件是目录且未创建
        if (file.isDirectory() && !fs.existsSync(tagFile)) {
            fs.mkdirSync(tagFile);
            copy(srcFile, tagFile);
        }
        else if (file.isDirectory() && fs.existsSync(tagFile)) {
            // 文件时目录且已存在
            copy(srcFile, tagFile);
        }
        !file.isDirectory() && fs.copyFileSync(srcFile, tagFile, fs.constants.COPYFILE_FICLONE);
    }
};
export { isExist, copy };
