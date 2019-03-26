# menv
Inheritable Multiple Environment Configuration for Any Language

![Demo: menv build](https://github.com/yinrong/menv/raw/master/demo.png "menv build")

# Usage

## 1. Without NodeJS Runtime

### 1.1. Install / Upgrade
```bash
curl -s https://registry.npmjs.org/menv-wrapper/-/menv-wrapper-1.2.2.tgz |tar zx package/menv --strip-components=1
./menv
git add -f menv .gitignore
git commit -m 'add menv'
git push
```

### 1.2. Prepare Config
example: https://github.com/yinrong/menv/tree/master/test/conf

### 1.3. Build Config
* Source config files must be located at "./conf/".
* Output config files are located at "./build/conf/".

```bash
./menv build
```

### 1.4. Echo Config
```bash
./menv echo <env> <path>
```


## 2. With NodeJS Runtime

### 2.1. Install / Upgrade
```bash
npm i -g menv
```

### 2.2. Prepare Config
example: https://github.com/yinrong/menv/tree/master/test/conf


### 2.3. Build Config
* Source config files must be located at "./conf/".
* Output config files are located at "./build/conf/".

```bash
menv build
```

### 2.4. Echo Config
```bash
menv echo <env> <path>
```
