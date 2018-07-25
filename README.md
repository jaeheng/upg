# UPG - update-package-generator

> 升级包制作工具
> 工具原理： 遍历源码文件夹， 将文件md5值不相同的移动到升级包内（带路径）

## 特性
```
文件夹A					文件夹B									文件夹C
	1.txt 					1.txt
	2.txt 		->升级 		2.txt(修改过)		->生成升级包 		2.txt
	3.txt 					3.txt(修改过)							3.txt
```

- 比如服务器上是文件夹A
- 但是网站程序升级了， 解压后是文件夹B
- 我们通过该工具获取到文件夹C之后， 直接用文件夹C来覆盖文件夹A即可完成升级。
- 这样处理过之后， 文件夹C（升级包）在升级之前可以去除掉一些自定义配置文件等，用户可保持自定义的东西，而不被更新程序覆盖掉。

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