const fs = require('fs');
const path = require('path');

/**
 * PackageJsonParser
 */
export default class PackageJsonParser {
    /**
     * Construct PackageJsonParser
     *
     * @param {string} directory path where package.json is
     */
    constructor(directory) {
        this.directory = directory;
    }

    /**
     * Get package.json from directory and return object
     *
     * @param  {Object} [directory] Directory of package.json
     * @return {Object} packageJsonObject
     */
    getPackageJsonObject(directory = this.directory) {
        const filePath = path.join(directory, 'package.json');
        let packageJsonObject = fs.readFileSync(filePath, {encoding: 'utf-8'});

        packageJsonObject = JSON.parse(packageJsonObject);
        return packageJsonObject;
    }

    /**
     * Get script part of package.json object
     *
     * @param  {Object} [packageJsonObject] Object that contains "scripts" part of package.json
     * @return {Object} scriptObject
     */
    getScriptsFromPackageJson(packageJsonObject = this.getPackageJsonObject()) {
        return packageJsonObject.scripts;
    }

    /**
     * Removes "npm run foo" and replaces it with foo command
     *
     * @param  {Object} [scriptsObject]            Object that contains "scripts" part of package.json
     * @return {Object} concatenatedScriptsObject
     */
    concatenateNodeScripts(scriptsObject = this.getScriptsFromPackageJson()) {
        const runScriptRegexp = /(^|\W)(npm run(?:-script)? (?:-s )?([^-][\w:\-]+)(?: -s)?)($|\W(?!-))/g;
    }

    /**
     * Returns true if a value of a given object matches given regular expression
     *
     * @param {Object} object Object to match its values
     * @param {RegExp} regex  Regular expression object
     * @return {boolean}      Return true if match was found
     */
    doesAnyValueMatchRegex(object, regex) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                if (regex.test(object[key])) {
                    return true;
                }
            }
        }

        return false;
    }
}
