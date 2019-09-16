//--------------------------------------------------------
//-- Node IoC - Config - Config Repository
//--------------------------------------------------------
'use strict';

const __  = require('@absolunet/private-registry');
const dot = require('dot-object');


class ConfigRepository {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app', 'config.grammar', 'file'];
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
	 * @param {string|null} [key]
	 * @param {*|null} [defaultValue]
	 * @returns {*}
	 */
	get(key = null, defaultValue = null) {
		const config = Object.assign({}, __(this).get('config'));
		const value  = typeof key === 'string' ? dot.pick(key, config) : config;

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
			dot.override = true;
			const formattedValue = this.formatValues(value);
			dot.str(key, formattedValue, __(this).get('config'));
			dot.override = false;
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
			const original = this.get(key, {});
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
		__(this).set('config', this.formatValues(config));
	}

	/**
	 * Set global configuration based on folder files.
	 *
	 * @param {string|null} [folder]
	 * @param {boolean} [overwrite]
	 */
	loadConfigFromFolder(folder = null, overwrite = false) {
		const directory = folder || this.app.make('path.config');
		this.file.scandir(directory).forEach((file) => {
			const index = file.split('/').pop().split('.').shift();
			this.loadConfig(index, this.app.formatPath(directory, file), overwrite);
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
		const files = (Array.isArray(file) ? file : [file]).map((fileName) => {
			return this.app.configPath(fileName);
		});
		this.setConfig(this.file.loadFirst(files));
	}

	/**
	 * Format values from grammar.
	 *
	 * @param {*} config
	 */
	formatValues(config) {
		if (typeof config === 'object' && config) {
			return Object.keys(config).reduce((object, key) => {
				object[key] = this.formatValues(object[key]);

				return object;
			}, config);
		}

		return this.grammar.format(config);
	}

	/**
	 * @type {ConfigGrammar}
	 */
	get grammar() {
		return __(this).get('config.grammar');
	}

}


module.exports = ConfigRepository;
