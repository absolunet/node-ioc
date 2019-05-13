//--------------------------------------------------------
//-- Node IoC - Console - Option
//--------------------------------------------------------
'use strict';

const Argument = require('./Argument');


class Option extends Argument {

	/**
	 * Option constructor.
	 *
	 * @param {string} name
	 * @param {*|null} defaultValue
	 * @param {string} description
	 * @param {string|null} alias
	 */
	constructor(name, defaultValue = null, description = '', alias = null) {
		super(name, defaultValue, description, alias);
	}

}


module.exports = Option;
