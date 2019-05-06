//--------------------------------------------------------
//-- Node IoC - Config - Config Grammar
//--------------------------------------------------------
'use strict';

const os    = require('os');
const slash = require('slash');


class ConfigGrammar {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * Replacements list accessor.
	 *
	 * @returns {{search: RegExp, replace: string}[]}
	 */
	get replacements() {
		return [
			{ search: /^@\//u, replace: `${this.app.make('path.base')}/` },
			{ search: /^~\//u, replace: `${os.homedir()}/` }
		];
	}

	/**
	 * Format given path to absolute path.
	 *
	 * @param filePath
	 */
	formatPath(filePath) {
		return slash(this.replacements.reduce((text, { search, replace }) => {
			return text.replace(search, replace);
		}, filePath));
	}

}


module.exports = ConfigGrammar;
