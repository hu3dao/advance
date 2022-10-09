import { Command } from 'commander';
const program = new Command();
program.version('@advance/build 1.0.0');
program
    .command('dev')
    .description('Run dev server')
    .option('--open <open>', 'auto open page of url', false)
    .action(async ({ open }) => {
    const { dev } = await import('./commands/dev.js');
    dev(open);
});
program
    .command('build')
    .description('Compile components in production mode')
    .option('--all', 'build all page', false)
    .option('--pages <pages...>', 'build page list')
    .action(async (options) => {
    const { build } = await import('./commands/build.js');
    build(options);
});
program.parse();
