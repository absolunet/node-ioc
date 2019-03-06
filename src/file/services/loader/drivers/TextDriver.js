//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const fss = require('@absolunet/fss');
const fsp = require('@absolunet/fsp');
const Driver = require('./Driver');


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
