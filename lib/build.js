const x = {
  fs: require('fs'),
  path: require('path'),
  yaml: require('js-yaml'),
  debug: require('debug')('menv'),
  readdir: require("recursive-readdir"),
  _: require('lodash'),
  mkdirp: require('mkdirp'),
};

function merge(dst, src) {
  x._.mergeWith(dst, src, (a, b) => {
    if (x._.isArray(a) && x._.isArray(b)) {
      return b;
    }
  });
}

function substituteVars(c, root) {
  if (root === undefined) {
    root = c;
  }
  for (let k in c) {
    x.debug(`substituteVars check key=${k}`);
    if (c[k] === null || c[k] === undefined) {
      continue;
    }
    if (c[k].constructor !== String) {
      substituteVars(c[k], root);
      continue;
    }

    // recursively substitute
    let n_replaced = 0;
    do {
      n_replaced = 0;
      x.debug(`chceck replace ${c[k]}`);
      c[k] = c[k].replace(/\${([^}]+)}/, (g0, g1) => {
        n_replaced++;
        x.debug(`replacing g0=${g0}`);
        return x._.get(root, g1);
      });
    } while (n_replaced > 0);

  }
}

function writeConfig(dir, c) {
  x.mkdirp.sync(`build/${dir}`);
  let fn = `build/${dir}/${c.__env__}.json`;
  x.fs.writeFileSync(fn, JSON.stringify(c, null, 4));
  console.error(`build success. env=${c.__env__}, file=${fn}`);
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
    merge(final, c_included);
  }
  merge(final, c);
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
      x.debug('skip empty file.');
      continue;
    }
    let dir = x.path.dirname(f);
    c.__env__ = x.path.basename(f).replace(/\.[^.]+$/, '');
    substituteVars(c);
    x.debug(`loaded onfig:`, c);
    writeConfig(dir, c);
  }

};