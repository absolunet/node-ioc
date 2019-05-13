//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./JavaScriptDriver');


class JsonDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return this.fileEngine.sync.readJson(file);
	}

	loadAsync(file) {
		return this.fileEngine.async.readJson(file);
	}

}


module.exports = JsonDriver;
