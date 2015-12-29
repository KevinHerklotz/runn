#! /usr/bin/env node

/**
 * runn entry point
 */
import PackageJsonParser from './PackageJsonParser';

const executingPath = process.cwd();
const packageJsonParser = new PackageJsonParser(executingPath);

try {
    console.log(packageJsonParser.getPackageJsonObject());
} catch (err) {
    console.log(err);
}
