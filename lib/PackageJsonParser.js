const fs = require('fs');
const path = require('path');

/**
 * PackageJsonParser
 */
export default class PackageJsonParser {
    /**
     * Construct PackageJsonParser
     * @param {string} directory path where package.json is
     */
    constructor(directory) {
        this.directory = directory;
    }

    /**
     * Get package.json from directory and return object
     *
     * @return {Object} packageJsonObject
     */
    getPackageJsonObject() {
        const filePath = path.join(this.directory, 'package.json');
        let packageJsonObject = fs.readFileSync(filePath, {encoding: 'utf-8'});

        packageJsonObject = JSON.parse(packageJsonObject);
        return packageJsonObject;
    }

    /**
     * Get script part of package.json object
     * @return {Object} scriptObject
     */
    getScriptsFromPackageJson() {
        return this.getPackageJsonObject().scripts;
    }
}
