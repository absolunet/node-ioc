//--------------------------------------------------------
//-- Node IoC - Config - Driver
//--------------------------------------------------------
'use strict';

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