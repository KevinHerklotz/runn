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
        this.packageJson = require(path.join(process.cwd(), 'package.json')); // eslint-disable-line global-require
    }

    }

    /**
     * Removes "npm run foo" and replaces it with foo command
     *
     * @param  {Object} [scriptsObject]            Object that contains "scripts" part of package.json
     * @return {Object} concatenatedScriptsObject
     */
    concatenateNpmScripts(scriptsObject = this.packageJson.scripts) {
        const concatenatedScriptsObject = {};

        /**
         * regex to find script invocations (npm run)
         *
         * matches:
         * 1: opening character (like "(" or just "")
         * 2: complete script invocation (like "npm run -s foo")
         * 3: script name that is called (in the example above it would be "foo")
         * 4: closing character (like ")" or just "")
         */
        const runScriptRegexp = /(^|\W)(npm run(?:-script)? (?:-s )?([^-][\w:\-]+)(?: -s)?)($|\W(?!-))/;

        // exclude scripts values if they match the following regular expression
        const excludeScriptRegexp = /onchange/; // issue that onchange works with one command only
        let atLeastOneValueCouldBeReplaced = false;

        // successive replace script invocations with their reference content and successive move them from scriptsObject to concatenatedScriptsObject
        do {
            atLeastOneValueCouldBeReplaced = false;

            for (const key in scriptsObject) {
                if (scriptsObject.hasOwnProperty(key)) {
                    const match = runScriptRegexp.exec(scriptsObject[key]);

                    // check if value contains script invocation, but does not match the excludeScriptRegexp
                    if (!!match && !excludeScriptRegexp.test(scriptsObject[key])) {
                        // check if name of the found script already exists in concatenatedScriptsObject so it can be replaced
                        if (match[3] in concatenatedScriptsObject) {
                            scriptsObject[key] = scriptsObject[key].replace(runScriptRegexp, `$1${concatenatedScriptsObject[match[3]]}$4`);
                            atLeastOneValueCouldBeReplaced = true;
                        }

                    // if it does not contain a script invocation, a modification is not required
                    } else {
                        // move from scriptsObject to concatenatedScriptsObject
                        concatenatedScriptsObject[key] = scriptsObject[key];
                        delete scriptsObject[key];

                        atLeastOneValueCouldBeReplaced = true;
                    }
                }
            }
        } while (atLeastOneValueCouldBeReplaced);

        // if there still is something in scriptsObject throw an Error, because everything should be in concatenatedScriptsObject now
        if (Object.keys(scriptsObject).length !== 0) {
            throw new Error('Not all script invocations could be replaced.');
        }

        return concatenatedScriptsObject;
    }
}
