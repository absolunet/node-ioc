//--------------------------------------------------------
//-- Node IoC - Database - Factory
//--------------------------------------------------------
'use strict';


class Factory {

	/**
	 * Name of the associated model.
	 *
	 * @type {string}
	 * @abstract
	 */
	get model() {
		throw new TypeError('Accessor "model" must be implemented. It should return a valid model name.');
	}

	/**
	 * Factory model attributes.
	 *
	 * @returns {object}
	 * @abstract
	 */
	make() {
		throw new TypeError('Method "make" must be implemented. It should return an attributes object.');
	}

}

module.exports = Factory;
