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
     * Get package.json from path and return object
     *
     * @returns {Object} packageJsonObject
     */
    getPackageJsonObject() {
        const filePath = path.join(this.directory, 'packaged.json');

        return fs.readFileSync(filePath, {encoding: 'utf-8'});
    }
}
