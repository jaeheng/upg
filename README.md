# UPG - update-package-generator

> 升级包制作工具
> 工具原理： 遍历源码文件夹， 将文件md5值不相同的移动到升级包内（带路径）


## 运行

```
> npm install
> npm start
```

## 打包为64位windows程序
```
> npm run build
```
运行后会在当前目录的上一级生成一个名为`upg-win32-x64`的文件夹， 此文件夹就是程序目录。 点击文件夹内的`upg.exe`即可运行

## 说明

本项目依赖[electron](https://electronjs.org/) (使用 JavaScript, HTML 和 CSS 构建跨平台的桌面应用)
构建mac os软件可参考 `electron` 的文档

Author: jaeheng