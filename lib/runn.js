#! /usr/bin/env node

/**
 * runn entry point
 */
const clc = require('cli-color');
import PackageJsonParser from './PackageJsonParser';

const executingPath = process.cwd();
const packageJsonParser = new PackageJsonParser(executingPath);

try {
    console.log(packageJsonParser.getScriptsFromPackageJson());
} catch (err) {
    console.log(clc.red(err));
}
