//--------------------------------------------------------
//-- Node IoC - Config - Config Repository
//--------------------------------------------------------
'use strict';

const __   = require('@absolunet/private-registry');
const dot  = require('dot-object');
const path = require('path');


class ConfigRepository {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app', 'file'];
	}

	/**
	 * Initialize repository.
	 */
	init() {
		this.setConfig({});
		this.loadConfigFromFolder(null, true);
	}

	/**
	 * Get configuration value.
	 *
	 * @param {string|null} key
	 * @param {*|null} defaultValue
	 * @returns {*}
	 */
	get(key = null, defaultValue = null) {
		const config = Object.assign({}, __(this).get('config'));
		const value  = key === null ? config : dot.pick(key, config);

		return typeof value === 'undefined' ? defaultValue : value;
	}

	/**
	 * Set configuration value.
	 *
	 * @param {string} key
	 * @param {*} value
	 */
	set(key, value) {
		if (typeof key === 'string') {
			if (typeof value === 'object' && !Array.isArray(value)) {
				let config = this.get(key);
				if (!config) {
					config = {};
					dot.str(key, config, __(this).get('config'));
				}
				Object.assign(config, value);
			} else {
				dot.str(key, value, __(this).get('config'));
			}
		} else {
			this.setConfig(key);
		}
	}

	/**
	 * Merge configuration value to existing value.
	 *
	 * @param {string} key
	 * @param {*} value
	 * @param {boolean} [overwrite]
	 */
	merge(key, value, overwrite = false) {
		if (typeof value === 'object' && value) {
			if (this.get(key) === null) {
				this.set(key, {});
			}

			const original = this.get(key);
			const newValue = overwrite ? Object.assign(original, value) : Object.assign({}, value, original);

			this.set(key, newValue);
		}
	}

	/**
	 * Set global configuration.
	 *
	 * @param {*} config
	 */
	setConfig(config) {
		__(this).set('config', config);
	}

	/**
	 * Set global configuration based on folder files.
	 *
	 * @param {string} folder
	 * @param {boolean} [overwrite]
	 */
	loadConfigFromFolder(folder = null, overwrite = false) {
		const directory = folder || this.app.make('path.config');
		this.file.scandir(directory).forEach((file) => {
			const index = file.split('/').pop().split('.').shift();
			this.loadConfig(index, path.join(directory, file), overwrite);
		});
	}

	/**
	 * Load configuration from file and store as a root index.
	 *
	 * @param {string} index
	 * @param {string} filePath
	 * @param {boolean} [overwrite]
	 */
	loadConfig(index, filePath, overwrite = false) {
		this.merge(index, this.file.load(filePath), overwrite);
	}

	/**
	 * Set global configuration from file.
	 *
	 * @param file
	 */
	setConfigFromFile(file) {
		const configPath = this.app.make('path.config');
		const files = (Array.isArray(file) ? file : [file]).map((fileName) => {
			return path.join(configPath, fileName);
		});
		this.setConfig(this.file.loadFirst(files));
	}

}


module.exports = ConfigRepository;
