//--------------------------------------------------------
//-- Node IoC - Console - Flag
//--------------------------------------------------------
'use strict';

const Argument = require('./Argument');


/**
 * Flag argument class.
 * Represents a boolean option that look like "some:command --flag" in a command.
 *
 * @memberof console.models
 * @augments console.models.Argument
 */
class Flag extends Argument {

	/**
	 * Flag constructor.
	 *
	 * @param {string} name - The name.
	 * @param {string} description - The description for CLI help.
	 * @param {string|null} alias - The flag alias.
	 */
	constructor(name, description = '', alias = null) {
		super(name, false, description, alias);
		this.value = false;
	}

	/**
	 * @inheritdoc
	 */
	get yargsModel() {
		const model = super.yargsModel;
		model.type = 'boolean';
		delete model.default;

		return model;
	}

}


module.exports = Flag;
