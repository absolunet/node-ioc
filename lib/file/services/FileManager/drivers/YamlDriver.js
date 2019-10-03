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

	/**
	 * {@inheritdoc}
	 */
	write(file, content) {
		return this.fileEngine.sync.writeYaml(file, content);
	}

	/**
	 * {@inheritdoc}
	 */
	writeAsync(file, content) {
		return this.fileEngine.async.writeYaml(file, content);
	}

}


module.exports = YamlDriver;
