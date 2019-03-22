
let cmd = process.argv[2];
if (!cmd) {
    console.error('usage: menv <cmd>');
    console.error('example: menv build');
    process.exit(1);
}

require(`${__dirname}/lib/${cmd}`).run(process.argv.slice(3));