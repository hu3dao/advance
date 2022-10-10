import fs from 'fs';
// 判断文件是否存在
const isExist = (path) => {
    return fs.existsSync(path);
};
export { isExist };
