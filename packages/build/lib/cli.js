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
    .option('--pages <pages...>', 'build page list') // 定义pages选项，它是可变长参数，最终会将我们输入的参数解析成数组，用于指定需要打包的页面
    .action(async (options) => {
    const { build } = await import('./commands/build.js'); // 我们在这里异步引入build函数，执行
    build(options);
});
program.parse();
