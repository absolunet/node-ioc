//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const Driver = require('./Driver');


class JavaScriptDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return require(file); // eslint-disable-line global-require
	}

	/**
	 * {@inheritdoc}
	 */
	loadAsync(file) {
		return Promise.resolve(require(file)); // eslint-disable-line global-require
	}

}

module.exports = JavaScriptDriver;
