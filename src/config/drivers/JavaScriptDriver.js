//--------------------------------------------------------
//-- Spark IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');

class JavaScriptDriver extends Driver {

	load(file) {
		return require(file); // eslint-disable-line global-require
	}

}

module.exports = JavaScriptDriver;
