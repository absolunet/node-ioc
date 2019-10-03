//--------------------------------------------------------
//-- Node IoC - Config - Driver
//--------------------------------------------------------
'use strict';

const NotImplementedError = require('../../../../foundation/exceptions/NotImplementedError');


/* istanbul ignore next */
class Driver {

	/**
	 * {@inheritdoc}
	 */
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
	 * @param {string} file
	 * @param {string|Stream} content
	 * @param {*} [options]
	 * @return {boolean}
	 */
	write(file, content, options = {}) {
		try {
			this.fileEngine.sync.writeFile(file, content, options);

			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Asynchronously write file in the given directory.
	 *
	 * @param {string} file
	 * @param {string|Stream} content
	 * @param {*} [options]
	 * @returns {Promise<*>}
	 */
	writeAsync(file, content, options = {}) {
		return this.fileEngine.async.writeFile(file, content, options);
	}

}


module.exports = Driver;
