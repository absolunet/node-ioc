//--------------------------------------------------------
//-- Node IoC - Test - Engines - Engine
//--------------------------------------------------------
'use strict';

const NotImplementedError = require('../../foundation/exceptions/NotImplementedError');


class Engine {

	/**
	 * Engine accessor.
	 *
	 * @returns {*}
	 */
	get engine() {
		throw new NotImplementedError(this, 'engine', 'engine', 'accessor');
	}

	/**
	 * Engine CLI path accessor.
	 *
	 * @returns {string}
	 */
	get path() {
		throw new NotImplementedError(this, 'path', 'string', 'accessor');
	}

	/**
	 * Extra argument to send to the CLI from the tested folder type.
	 *
	 * @param {string} [repositoryName]
	 * @returns {string}
	 */
	getPathArgument() {
		return '';
	}

}

module.exports = Engine;
