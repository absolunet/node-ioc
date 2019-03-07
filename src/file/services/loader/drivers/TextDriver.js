//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const Driver = require('./Driver');
const fsp = require('@absolunet/fsp');
const fss = require('@absolunet/fss');


class TextDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return fss.readFile(file, 'utf8');
	}

	/**
	 * {@inheritdoc}
	 */
	loadAsync(file) {
		return fsp.readFile(file, 'utf8');
	}

}

module.exports = TextDriver;
