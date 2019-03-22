const x = {
  fs: require('fs'),
  path: require('path'),
  yaml: require('js-yaml'),
  debug: require('debug')('menv'),
  readdir: require("recursive-readdir"),
  _: require('lodash'),
  mkdirp: require('mkdirp'),
};


function substituteVars(c, root) {
  if (root === undefined) {
    root = c;
  }
  for (let k in c) {
    if (c[k] === null && c[k] === undefined) {
      continue;
    }
    if (c[k].constructor !== String) {
      return substituteVars(c[k], root);
    }

    // recursively substitute
    let n_replaced;
    do {
      n_replaced = 0;
      c[k] = c[k].replace(/\${([^}]+)}/, (g0, g1) => {
        n_replaced++;
        return x._.get(root, g1);
      });
    } while (n_replaced > 0);

  }
}

function writeConfig(c) {
  let fn = `build/conf/${c.__env__}.json`;
  x.fs.writeFileSync(fn, JSON.stringify(c, null, 4));
}

function loadConfig(f) {
  let c = x.yaml.safeLoad(x.fs.readFileSync(f, 'utf8'));
  if (!c) {
    return null;
  }
  if (c.__include__ === undefined) {
    return c;
  }
  if (c.__include__.constructor !== Array) {
    c.__include__ = [ c.__include__, ]
  }
  let final = {};
  for (let e of c.__include__) {
    let absolute_path = x.path.dirname(f);
    let real_path = x.path.join(absolute_path, e);
    let c_included = loadConfig(real_path);
    x._.assignIn(final, c_included);
  }
  x._.assignIn(final, c);
  return final;
}

module.exports.run = async () => {
  x.debug('start run menv build.');
  let files = await x.readdir('conf');
  x.debug('cwd:', process.cwd());
  x.debug('files:', files);
  x.mkdirp.sync('build/conf');
  for (let f of files) {
    if (!f.match(/\.yaml$/)) {
      continue;
    }
    x.debug(`load file=${f}`);
    let c = loadConfig(f);
    if (c === null) {
      x.debug('empty file', f);
      continue;
    }
    c.__env__ = x.path.basename(f).replace(/\.[^.]+$/, '');
    substituteVars(c);
    x.debug(`loaded config:`, c);
    writeConfig(c);
  }

};