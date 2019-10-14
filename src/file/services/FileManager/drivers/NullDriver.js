//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


/**
 * Null driver to be used when testing or if fake load/write process is needed.
 * Always load null value and successfully write given files.
 *
 * @memberof file.services.FileManager.drivers
 * @augments file.services.FileManager.drivers.Driver
 * @hideconstructor
 */
class NullDriver extends Driver {

	/**
	 * @inheritdoc
	 */
	load() {
		return null;
	}

	/**
	 * @inheritdoc
	 */
	loadAsync() {
		return Promise.resolve(null);
	}

	/**
	 * @inheritdoc
	 */
	write() {
		return true;
	}

	/**
	 * @inheritdoc
	 */
	writeAsync() {
		return Promise.resolve(true);
	}

}


module.exports = NullDriver;
