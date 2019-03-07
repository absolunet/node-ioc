//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const Driver = require('./Driver');
const fsp = require('@absolunet/fsp');
const fss = require('@absolunet/fss');


class YamlDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return fss.readYaml(file);
	}

	/**
	 * {@inheritdoc}
	 */
	loadAsync(file) {
		return fsp.readYaml(file);
	}

}

module.exports = YamlDriver;
