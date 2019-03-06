//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const fss = require('@absolunet/fss');
const fsp = require('@absolunet/fsp');
const Driver = require('./Driver');


class YamlDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return fss.readYaml(file);
	}

	loadAsync(file) {
		return fsp.readYaml(file);
	}

}

module.exports = YamlDriver;
