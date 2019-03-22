# menv
Inheritable Multiple Environment Configuration for Any Language

![Demo: menv build](https://github.com/yinrong/menv/raw/master/demo.png "menv build")

# Usage

## Install
```sh
npm i -g menv
```

## Prepare Config
example: https://github.com/yinrong/menv/tree/master/test/conf


## Build Config
Source config files must be located at "./conf/".
Output config files are located at "./build/conf/".

```sh
menv build
```

## Echo Config
```sh
menv echo <env> <path>
```
