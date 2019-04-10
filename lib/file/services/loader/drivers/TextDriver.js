//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const Driver = require('./Driver');


class TextDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return this.fileEngine.sync.readFile(file, 'utf8');
	}

	/**
	 * {@inheritdoc}
	 */
	loadAsync(file) {
		return this.fileEngine.async.readFile(file, 'utf8');
	}

}

module.exports = TextDriver;
