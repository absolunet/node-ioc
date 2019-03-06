//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const fss = require('@absolunet/fss');
const fsp = require('@absolunet/fsp');
const Driver = require('./JavaScriptDriver');


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
