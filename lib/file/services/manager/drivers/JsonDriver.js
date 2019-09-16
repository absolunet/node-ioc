//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


class JsonDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return this.fileEngine.sync.readJson(file);
	}

	/**
	 * {@inheritdoc}
	 */
	loadAsync(file) {
		return this.fileEngine.async.readJson(file);
	}

	/**
	 * {@inheritdoc}
	 */
	write(content, file, options = {}) {
		try {
			this.fileEngine.sync.writeJson(file, content, options);

			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * {@inheritdoc}
	 */
	async writeAsync(content, destination, options = {}) {
		try {
			await this.fileEngine.async.writeJson(destination, content, options);

			return true;
		} catch (error) {
			return false;
		}
	}

}


module.exports = JsonDriver;
