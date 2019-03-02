//--------------------------------------------------------
//-- Spark IoC - Config - Config Repository
//--------------------------------------------------------
'use strict';

const path = require('path');
const dot = require('dot-object');
const __ = require('@absolunet/private-registry');


class ConfigRepository {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app', 'config.loader'];
	}

	/**
	 * ConfigRepository constructor.
	 *
	 * @param {Container} app
	 * @param {Loader} loader
	 */
	constructor(app, loader) {
		__(this).set('app', app);
		__(this).set('loader', loader);
		this.setConfigFromFile(['js', 'json', 'yml', 'yaml'].map((ext) => {
			return path.join(`config.${ext}`);
		}));
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

		return key === null ? config : dot.pick(key, config) || defaultValue;
	}

	/**
	 * Set configuration value.
	 *
	 * @param {string} key
	 * @param {*} value
	 */
	set(key, value) {
		if (typeof key === 'string') {
			dot.str(key, value, __(this).get('config'));
		} else {
			this.setConfig(key);
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

	setConfigFromFile(file) {
		const configPath = __(this).get('app').make('path.config');
		const files = (Array.isArray(file) ? file : [file]).map((fileName) => {
			return path.join(configPath, fileName);
		});
		this.setConfig(this.loader.loadFirst(files));
	}

	get loader() {
		return __(this).get('loader');
	}

}

module.exports = ConfigRepository;
