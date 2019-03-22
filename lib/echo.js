const x = {
    _: require('lodash'),
}

module.exports.run = (argv) => {
    let env = argv[0];
    let path = argv[1];
    if (!path) {
        console.error('usage: menv echo <env> <conf_path></conf_path>');
        process.exit(1);
    }
    let conf = require(`${process.cwd()}/build/conf/${env}`);
    let v = x._.get(conf, path);
    if (v === undefined) {
        console.error(`config not found with env=${env}, path=${path}`);
        process.exit(2);
    }
    if (v.constructor === String) {
        console.log(v);
        return;
    }
    console.log(JSON.stringify(v));
};