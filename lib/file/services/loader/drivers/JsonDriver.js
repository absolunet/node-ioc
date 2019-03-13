//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const Driver = require('./JavaScriptDriver');
const fsp = require('@absolunet/fsp');
const fss = require('@absolunet/fss');


class JsonDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return fss.readJson(file);
	}

	loadAsync(file) {
		return fsp.readJson(file);
	}

}

module.exports = JsonDriver;
