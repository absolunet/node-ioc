//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const Driver = require('./Driver');


class YamlDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return this.fileEngine.sync.readYaml(file);
	}

	/**
	 * {@inheritdoc}
	 */
	loadAsync(file) {
		return this.fileEngine.async.readYaml(file);
	}

}

module.exports = YamlDriver;
