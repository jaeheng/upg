#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require("path");
const util = require('util');
const shell = require("shelljs");

const DS = path.sep;
/**
 * 获取文件的md5
 * @param path string 文件的路径
 */
function getFileMd5(path) {
	var buffer = fs.readFileSync(path);
	var fsHash = crypto.createHash('md5');
	
	fsHash.update(buffer);
	return fsHash.digest('hex');
}

// 遍历源文件夹, 生成文件树
/**
 * @param path string 要遍历的文件夹路径
 * @params srcTree 文件树数组
 */
function readDirSync (path, srcTree) {
	var pa = fs.readdirSync(path);

	pa.forEach(function(ele,index){
		if (ele != '.git') {
			var info = fs.statSync(path+DS+ele)
			if(info.isDirectory()){
				srcTree.push({
					isDir: true,
					name: ele,
					path: path,
					children: []
				})
				var lastIndex = srcTree.length - 1
				readDirSync(path+DS+ele, srcTree[lastIndex].children);
			}else{
				var filePath = path + DS + ele;
				var fileMd5 = getFileMd5(filePath);
				srcTree.push({
					isDir: false,
					name: ele,
					path: path + DS + ele,
					md5: fileMd5
				});
			}
		}
	})
}

/**
 * 排序
 */
function sortArray ($array) {
	if ($array instanceof Array) {
		$array.sort();
		$array.map(function (item) {
			if (item instanceof Array) {
				sortArray(item)
			}
		})
	}
}

function md5InArray ($item, $array) {
	var key = false;
	for (var i = 0; i < $array.length; i++) {
		if ($array[i].md5 === $item.md5 && $array[i].name === $item.name) {
			key = true;
		}
	}
	return key;
}

function getIndexOfSrcTree(name, srcTree) {
	var index = false;
	srcTree.map(function (item, i) {
		if (item.name == name) {
			index = i;
		}
	})
	return (index === false) ? false : index;
}

function compareArray ($srcTree, $updateTree, $notSamePaths, $updateDir) {
	for (var i = 0; i < $updateTree.length; i++) {
		if ($updateTree[i].isDir) {
			var indexOfSrcTree = getIndexOfSrcTree($updateTree[i].name, $srcTree);
			if (indexOfSrcTree === false) {
				// 如果文件夹不在源文件夹里， 则整个文件夹都要移到升级包
				// console.log($updateTree[i].name)
				// console.log($srcTree[0]);
				var path = $updateTree[i].path;
				path = path.replace($updateDir, '');
				$notSamePaths.push(path);
				continue;
			}
			// console.log(indexOfSrcTree);
			compareArray($srcTree[indexOfSrcTree].children, $updateTree[i].children, $notSamePaths, $updateDir);
			continue;
		}
		if (!md5InArray($updateTree[i],$srcTree )) {
			var path = $updateTree[i].path;
				path = path.replace($updateDir, '');
			$notSamePaths.push(path);
		}
	}
}

function copy(src, dst) {
  	var info = fs.statSync(src);

	if(info.isDirectory()){
		shell.mkdir('-p', dst);
		shell.cp('-R', src + DS + '*', dst);
		// console.log('mkdir -p ' + dst)
	} else {
		$arr = dst.split(DS);
		$fileName = $arr.pop();
		$fileDir = $arr.join(DS);
		shell.mkdir('-p', $fileDir);
		shell.cp('-R', src, dst);
		// shell.exec('cp -R ' + src + ' ' + dst);
		// console.log('cp -p ' + $fileDir)
	}
}

/**
 * 处理返回
 */
function returnHandle (state, msg) {
	return {
		state: state,
		msg: msg
	}
}

function run (srcDir, updateDir, $outputDir) {
	var $srcTree = [];
	var $updateTree = [];
	$outputDir += DS + 'dist'
	
	try {
		readDirSync(srcDir, $srcTree);
		readDirSync(updateDir, $updateTree);
		console.log('获取文件树成功');
	} catch (err) {
		var msg = '获取文件树失败: ' + err;
		console.log(msg);
		return returnHandle(0, msg);
	}


	sortArray($srcTree);
	sortArray($updateTree);

	// console.log(util.inspect($srcTree, false, null));
	// console.log(JSON.stringify($updateTree));
	// return false;
	// console.log(JSON.stringify($srcTree));
	// return false;
	var $notSamePaths = [];


	try {
		compareArray($srcTree, $updateTree, $notSamePaths, updateDir);
		console.log('对比树，获取md5不同的文件树');
	} catch (err) {
		var msg = '对比树失败:' + err;
		console.log(msg);
		return returnHandle(0, msg);
	}

	// console.log(JSON.stringify($notSamePaths));
	// return false;

	// console.log(JSON.stringify($notSamePaths));
	console.log('开始生成升级包');

	try {
		$notSamePaths.map(function (item) {
			copy(srcDir + item, $outputDir + item);
			// console.log(item)
		});
		var msg = '生成升级包成功!';
		console.log(msg);
		return returnHandle(1, msg);
	} catch (err) {
		var msg = '生成升级包失败:' + err;
		console.log(msg);
		return returnHandle(0, msg);
	}
		
}

exports = module.exports = {
	run: run
};