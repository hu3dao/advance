// 格式化命令行参数
const parseArgs = (arr) => {
  const argsMap = {};
    arr.forEach((args) => {
      args.split(' ').forEach((arg) => {
        if (/^--/.test(arg)) {
          const argItem = arg.slice(2);
          if (argItem.includes('=')) {
            const argArr = argItem.split('=');
            argsMap[argArr[0]] = argArr[1];
          }
        }
      });
    });
    return argsMap;
}


export {
  parseArgs
}