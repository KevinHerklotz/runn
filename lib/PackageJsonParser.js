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
        const runScriptRegexp = /(^|\W)(npm run(?:-script)? (?:-s )?([^-][\w:\-]+)(?: -s)?)($|\W(?!-))/;
        // exclude scripts values if they match the following regular expression
        const excludeScriptRegexp = /onchange/;
        let atLeastOneValueCouldBeReplaced = false;

        //console.log(runScriptRegexp.test('npm run build'));
        //runScriptRegexp.lastIndex = 0;
        //console.log(runScriptRegexp.test('npm run build'));

        do {
            atLeastOneValueCouldBeReplaced = false;
            console.log('  ');
            console.log('------------Durchlauf');
            for (const key in scriptsObject) {
                if (scriptsObject.hasOwnProperty(key)) {
                    let match = runScriptRegexp.exec(scriptsObject[key]);

                    // check if value contains script invocation, but does not match the excludeScriptRegexp
                    if (!!match && !excludeScriptRegexp.test(scriptsObject[key])) {
                        console.log('----gefunden für: ' + '(' + scriptsObject[key] + ')');

                        if (match[3] in concatenatedScriptsObject) {
                            scriptsObject[key] = scriptsObject[key].replace(runScriptRegexp, '$1' + concatenatedScriptsObject[match[3]] + '$4');
                            atLeastOneValueCouldBeReplaced = true;
                        }
                    }
                    // if it does not contain a script invocation, a modification is not required
                    else {
                        console.log('----nicht gefunden für: ' + '(' + scriptsObject[key] + ')');
                        // move from scriptsObject to concatenatedScriptsObject
                        concatenatedScriptsObject[key] = scriptsObject[key];
                        delete scriptsObject[key];

                        atLeastOneValueCouldBeReplaced = true;
                    }
                }
            }
        } while (atLeastOneValueCouldBeReplaced);

        console.log(scriptsObject);
        console.log(concatenatedScriptsObject);

        // if there still is something in scriptsObject throw an Error, because everything should be in concatenatedScriptsObject now
        if (Object.keys(scriptsObject).length !== 0) {
            throw new Error('Not all script invocations could be replaced.');
        }

        //return concatenatedScriptObject;
    }
}
