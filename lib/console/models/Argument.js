//--------------------------------------------------------
//-- Node IoC - Console - Argument
//--------------------------------------------------------
'use strict';


class Argument {

	/**
	 * Argument constructor.
	 *
	 * @param {string} name
	 * @param {*|null} defaultValue
	 * @param {string} description
	 * @param {string|null} alias
	 */
	constructor(name, defaultValue = null, description = '', alias = null) {
		this.name         = name;
		this.defaultValue = defaultValue;
		this.description  = description || name;
		this.alias        = alias;
	}

	/**
	 * Get Yargs argument model.
	 *
	 * @type {{default: *, describe: (string|*), type: string}}
	 */
	get yargsModel() {
		const model = {
			'describe': this.description,
			'type':     'string',
			'default':  this.defaultValue
		};

		if (this.alias) {
			model.alias = this.alias;
		}

		return model;
	}

}


module.exports = Argument;
