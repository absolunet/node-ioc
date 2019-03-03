//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const fs = require('fs');
const yaml = require('js-yaml');
const Driver = require('./../../file/services/Driver');


class YamlDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
	}

}

module.exports = YamlDriver;
