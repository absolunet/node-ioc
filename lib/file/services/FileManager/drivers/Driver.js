//--------------------------------------------------------
//-- Node IoC - Config - Driver
//--------------------------------------------------------
'use strict';

const NotImplementedError = require('../../../../foundation/exceptions/NotImplementedError');


/* istanbul ignore next */
class Driver {

	static get dependencies() {
		return ['file.engine'];
	}

	/**
	 * Load the given file.
	 *
	 * @param {string} file
	 * @returns {*}
	 * @abstract
	 */
	load() {
		throw new NotImplementedError(this, 'load', 'any');
	}

	/**
	 * Asynchronously load the given file.
	 *
	 * @param {string} file
	 * @returns {Promise<*>}
	 * @abstract
	 */
	loadAsync() {
		throw new NotImplementedError(this, 'loadAsync', 'Promise<any>');
	}

	/**
	 * Write file in the given destination.
	 *
	 * @param {string} destination
	 * @param {string|Stream} data
	 * @param {*} [options]
	 * @return {boolean}
	 * @abstract
	 */
	write(destination, data, options = {}) {
		try {
			this.fileEngine.sync.writeFile(destination, data, options);

			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Asynchronously write file in the given directory.
	 *
	 * @param {string} destination
	 * @param {string|Stream} data
	 * @param {*} [options]
	 * @returns {Promise<*>}
	 * @abstract
	 */
	writeAsync(destination, data, options = {}) {
		return this.fileEngine.async.writeFile(destination, data, options);
	}

}


module.exports = Driver;
