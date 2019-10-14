//--------------------------------------------------------
//-- Node IoC - Config - Config Repository
//--------------------------------------------------------
'use strict';

const __  = require('@absolunet/private-registry');
const dot = require('dot-object');


/**
 * Configuration repository that loads, stores and exposes application configuration.
 *
 * @memberof config.repositories
 * @hideconstructor
 */
class ConfigRepository {

	/**
	 * Class dependencies.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'config.grammar', 'file'];
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		this.setConfig({});
		this.loadConfigFromFolder(null, true);
	}

	/**
	 * Get configuration value.
	 *
	 * @param {string|null} [key] - The configuration key.
	 * @param {*|null} [defaultValue] - The default value to use if the value is not in configuration.
	 * @returns {*} - The configuration value.
	 */
	get(key = null, defaultValue = null) {
		const config = Object.assign({}, __(this).get('config'));
		const value  = typeof key === 'string' ? dot.pick(key, config) : config;

		return typeof value === 'undefined' ? defaultValue : value;
	}

	/**
	 * Set configuration value.
	 *
	 * @param {string} key - The configuration key.
	 * @param {*} value - The configuration value.
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
	 * @param {string} key - The configuration key.
	 * @param {*} value - The configuration value.
	 * @param {boolean} [overwrite] - Flag that indicates if the old value should be overwritten or merged.
	 */
	merge(key, value, overwrite = false) {
		if (typeof value === 'object' && value) {
			const original    = this.get(key, {});
			const mergedValue = overwrite ? Object.assign(original, value) : Object.assign({}, value, original);

			this.set(key, mergedValue);
		}
	}

	/**
	 * Set global configuration.
	 *
	 * @param {*} config - The full configuration object.
	 */
	setConfig(config) {
		__(this).set('config', this.formatValues(config));
	}

	/**
	 * Set global configuration based on folder files.
	 *
	 * @param {string|null} [folder] - The folder to search configuration file into.
	 * @param {boolean} [overwrite] - Flag that indicates if the current configuration should be overridden or merged.
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
	 * @param {string} key - The configuration key.
	 * @param {string} filePath - The file to load which contains the configuration object for the specified key.
	 * @param {boolean} [overwrite] - Flag that indicates if the current configuration should be overridden or merged.
	 */
	loadConfig(key, filePath, overwrite = false) {
		this.merge(key, this.file.load(filePath), overwrite);
	}

	/**
	 * Set global configuration from file.
	 *
	 * @param {string|Array<string>}file - The file, or set of files, to load to set config from. If a set of file is given, the first existing one will be used, and all the others will be ignored.
	 */
	setConfigFromFile(file) {
		const config = this.file.loadFirst(Array.isArray(file) ? file : [file]);

		if (config) {
			this.setConfig(config);
		}
	}

	/**
	 * Format values with grammar.
	 *
	 * @param {*} config - The configuration value, either a single value or a whole object.
	 * @returns {*} - The formatted value or values.
	 */
	formatValues(config) {
		if (typeof config === 'object' && config) {
			return Object.keys(config).reduce((object, key) => {
				object[key] = this.formatValues(object[key]);

				return object;
			}, config);
		}

		return this.configGrammar.format(config);
	}

}


module.exports = ConfigRepository;
