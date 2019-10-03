//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


class NullDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load() {
		return null;
	}

	/**
	 * {@inheritdoc}
	 */
	loadAsync() {
		return Promise.resolve(null);
	}

	/**
	 * {@inheritdoc}
	 */
	write() {
		return true;
	}

	/**
	 * {@inheritdoc}
	 */
	writeAsync() {
		return Promise.resolve(true);
	}

}


module.exports = NullDriver;
