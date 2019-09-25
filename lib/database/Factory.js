//--------------------------------------------------------
//-- Node IoC - Database - Factory
//--------------------------------------------------------
'use strict';

const NotImplementedError = require('../foundation/exceptions/NotImplementedError');


class Factory {

	/**
	 * Name of the associated model.
	 *
	 * @type {string}
	 * @abstract
	 */
	get model() {
		throw new NotImplementedError(this, 'model', 'string', 'accessor');
	}

	/**
	 * Factory model attributes.
	 *
	 * @returns {object}
	 * @abstract
	 */
	make() {
		throw new NotImplementedError(this, 'make', 'attributes object');
	}

}

module.exports = Factory;
