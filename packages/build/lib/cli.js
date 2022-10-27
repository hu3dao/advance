import { Command } from 'commander';
const program = new Command();
program.version('@advance/build 1.0.0');
program
    .command('dev') // 注册dev命令
    .description('Run dev server') // 对dev命令的描述
    .option('--open <open>', 'auto open page of url', false) // 定义open选项，默认是false，用于指定启动dev-server时自动打开哪个页面
    .action(async ({ open }) => {
    const { dev } = await import('./commands/dev.js'); // 我们在这里异步引入dev函数，执行
    dev(open);
});
program
    .command('build') // 注册build命令
    .description('Compile pages in production mode') // 对build命令的描述
    .option('--all', 'build all page', false) // 定义all选项，默认是false，用于指定是否打包全部的页面
    .option('--page <page...>', 'build page list') // 定义pages选项，它是可变长参数，最终会将我们输入的参数解析成数组，用于指定需要打包的页面
    .action(async (options) => {
    const { build } = await import('./commands/build.js'); // 我们在这里异步引入build函数，执行
    build(options);
});
program
    .command('create') // 注册create命令
    .description('Create pages base on template')
    .option('--names <names...>', 'create pages name')
    .option('--temp <temp>', 'target template')
    .action(async (options) => {
    const { create } = await import('./commands/create.js');
    create(options);
});
// 格式化用户命令行输入的参数
const parseArgs = (argList) => {
    const args = [];
    argList.forEach(arg => {
        if (arg.includes('=')) {
            const argArr = arg.split('=');
            args.push(argArr[0]);
            args.push(...(argArr[1].split(',').filter(item => item)));
        }
        else {
            args.push(arg);
        }
    });
    return args;
};
// 兼容npm
let userOptions = [];
if (process.env.npm_config_argv) {
    userOptions = JSON.parse(process.env.npm_config_argv).original.slice(2);
}
else {
    userOptions = process.argv.slice(2);
}
// 合并去重
const argv = Array.from(new Set([...process.argv.slice(0, 3), ...parseArgs(userOptions)]));
program.parse(argv);
