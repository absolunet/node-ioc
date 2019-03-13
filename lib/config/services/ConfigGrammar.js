//--------------------------------------------------------
//-- Node IoC - Config - Config Grammar
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
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
	 * Grammar constructor.
	 *
	 * @param app
	 */
	constructor(app) {
		__(this).set('app', app);
	}

	/**
	 * Format given path to absolute path.
	 *
	 * @param filePath
	 */
	formatPath(filePath) {
		return slash(this.replacements.reduce((str, { search, replace }) => {
			return str.replace(search, replace);

		}, filePath));
	}

	/**
	 * Replacements list accessor.
	 *
	 * @returns {{search: RegExp, replace: string}[]}
	 */
	get replacements() {
		return [
			{ search:/^@\//u, replace:`${__(this).get('app').make('path.base')}/` }
		];
	}

}

module.exports = ConfigGrammar;
