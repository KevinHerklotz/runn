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
        const concatenatedScriptsObject = {};
        // regex to find script invocations (npm run)
        // const regex = /(?:^|\&\& |\|\| )(npm run(?:-script)? ([^\&|]*))(?:$| )/g;
        const runScriptRegexp = /(^|\W)(npm run(?:-script)? (?:-s )?([^-][\w:\-]+)(?: -s)?)($|\W(?!-))/g;
        // exclude scripts values if they match the following regular expression
        const excludeScriptRegexp = /onchange/;
        let atLeastOneValueCouldBeReplaced = false;

        do {
            atLeastOneValueCouldBeReplaced = false;
            console.log('Durchlauf');
            for (const key in scriptsObject) {
                if (scriptsObject.hasOwnProperty(key)) {
                    //console.log(scriptsObject[key]);

                    // check if value contains script invocation, but does not match the excludeScriptRegexp
                    if (false && runScriptRegexp.test(scriptsObject[key]) && !excludeScriptRegexp.test(scriptsObject[key])) {

                        if (getCommandName() in concatenatedScriptsObject) {
                            atLeastOneValueCouldBeReplaced = true;
                        }
                    }
                    // if it does not contain a script invocation, a modification is not required
                    else {
                        // move from scriptsObject to concatenatedScriptsObject
                        concatenatedScriptsObject[key] = scriptsObject[key];
                        delete scriptsObject[key];

                        atLeastOneValueCouldBeReplaced = true;
                    }
                }
            }

        //} while (this.doesAnyValueMatchRegex(scriptsObject, runScriptRegexp));
        } while (atLeastOneValueCouldBeReplaced);

        console.log(scriptsObject);
        console.log(concatenatedScriptsObject);

        // if there still is something in scriptsObject throw an Error, because everything should be in concatenatedScriptsObject now
        if (Object.keys(scriptsObject).length !== 0) {
            throw new Error('Not all script invocations could be replaced.');
        }

        //console.log(this.doesAnyValueMatchRegex(scriptsObject, runScriptRegexp));

        //return concatenatedScriptObject;
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
