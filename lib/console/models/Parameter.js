//--------------------------------------------------------
//-- Node IoC - Console - Parameter
//--------------------------------------------------------
'use strict';

const Argument = require('./Argument');


class Parameter extends Argument {

	/**
	 * Parameter constructor.
	 *
	 * @param {string} name
	 * @param {boolean} required
	 * @param {*|null} defaultValue
	 * @param {string} description
	 */
	constructor(name, required = true, defaultValue = null, description = '') {
		super(name, defaultValue, description);
		this.required = required;
	}

	/**
	 * Parameter signature.
	 *
	 * @returns {string}
	 */
	get signature() {
		if (this.required) {
			return `<${this.name}>`;
		}

		return `[${this.name}]`;
	}

}


module.exports = Parameter;
