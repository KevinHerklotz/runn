const path = require('path');

/**
 * PackageJsonParser
 */
export default class PackageJsonParser {
    /**
     * Construct PackageJsonParser
     *
     * @param {?Object|string} [PackageJsonOrDirectory] package.json Object or absolute or relative path to package.json
     */
    constructor(PackageJsonOrDirectory) {
        /**
         * package.json Object
         *
         * @private
         * @type {Object}
         */
        this.packageJson = {};

        this.setPackageJson(PackageJsonOrDirectory);
    }

    /**
     * Set packageJson
     *
     * @throws {ReferenceError}                          Throw error if no package.json was found
     * @throws {TypeError}                               Throw error if given parameter is neither an object or string or empty
     * @param  {?Object|string} [packageJsonOrDirectory] package.json Object or absolute or relative path to package.json
     * @return {PackageJsonParser}                       Self reference
     */
    setPackageJson(packageJsonOrDirectory) {
        // If it is a package.json object we just have to assign it to this.packageJson, that's it
        if (!!packageJsonOrDirectory && typeof packageJsonOrDirectory === 'object' && !(packageJsonOrDirectory instanceof Array)) {
            this.packageJson = packageJsonOrDirectory;

        // If it is a string(directory) or empty we have to calculate the path and get the package.json from there
        } else if (typeof packageJsonOrDirectory === 'string' || !packageJsonOrDirectory) {
            let directoryOfPackageJson = '';

            // Without parameter use current path
            if (!packageJsonOrDirectory) {
                directoryOfPackageJson = process.cwd();
            } else {
                // if path is like "path/to/package.json", slice package.json, because we just need the path
                if (path.basename(packageJsonOrDirectory) === 'package.json') {
                    packageJsonOrDirectory = packageJsonOrDirectory.slice(0, -12); // eslint-disable-line no-param-reassign
                }

                // if path is absolute
                if (path.resolve(packageJsonOrDirectory) === path.normalize(packageJsonOrDirectory)) {
                    directoryOfPackageJson = packageJsonOrDirectory;

                // if path is relative
                } else {
                    directoryOfPackageJson = path.join(process.cwd(), packageJsonOrDirectory);
                }
            }

            try {
                this.packageJson = require(path.join(directoryOfPackageJson, 'package.json')); // eslint-disable-line global-require
            } catch (err) {
                throw new ReferenceError(`No package.json was found in "${directoryOfPackageJson}"`);
            }

        // If it is neither an object or string or empty, throw error
        } else {
            throw new TypeError('Parameter must be a package.json Object, an directory or empty.');
        }

        return this;
    }

    /**
     * Get the package.json object
     *
     * @return {Object} package.json object
     */
    getPackageJson() {
        return this.packageJson;
    }

    /**
     * Removes "npm run foo" and replaces it with command of foo script
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
