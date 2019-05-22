//--------------------------------------------------------
//-- Node IoC - Test - Engines - Engine
//--------------------------------------------------------
'use strict';


class Engine {

	/**
	 * Engine accessor.
	 *
	 * @returns {*}
	 */
	get engine() {
		throw new TypeError('Engine must be given. It should return the engine concrete.');
	}

	/**
	 * Engine CLI path accessor.
	 *
	 * @returns {string}
	 */
	get path() {
		throw new TypeError('Engine path must be given. It should return the real path to the executable file');
	}

	/**
	 * Extra argument to send to the CLI from the tested folder type.
	 *
	 * @param {string} [repositoryName]
	 * @returns {string}
	 */
	getPathArgument(repositoryName = '') {
		return '';
	}

}

module.exports = Engine;
