//--------------------------------------------------------
//-- Node IoC - Config - Driver
//--------------------------------------------------------
'use strict';


class Driver {

	/**
	 * Load the given file.
	 *
	 * @param {string} file
	 * @returns {*}
	 * @abstract
	 */
	load() {
		throw new Error('Method load() must be implemented.');
	}

	/**
	 * Asynchronously load the given file.
	 *
	 * @param {string} file
	 * @returns {Promise<*>}
	 * @abstract
	 */
	loadAsync() {
		throw new Error('Method load() must be implemented.');
	}

}

module.exports = Driver;
