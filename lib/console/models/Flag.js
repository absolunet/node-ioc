//--------------------------------------------------------
//-- Node IoC - Console - Flag
//--------------------------------------------------------
'use strict';


const Argument = require('./Argument');


class Flag extends Argument {

	/**
	 * Flag constructor.
	 *
	 * @param {string} name
	 * @param {string} description
	 * @param {string|null} alias
	 */
	constructor(name, description = '', alias = null) {
		super(name, false, description, alias);
		this.value = false;
	}

	/**
	 * {@inheritdoc}
	 */
	get yargsModel() {
		const model = super.yargsModel;
		model.type = 'boolean';
		delete model.default;

		return model;
	}

}

module.exports = Flag;
