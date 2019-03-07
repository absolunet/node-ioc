//--------------------------------------------------------
//-- Node IoC - Config - Config Repository
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const dot = require('dot-object');
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
	 * ConfigRepository constructor.
	 *
	 * @param {Container} app
	 * @param {FileLoader} file
	 */
	constructor(app, file) {
		__(this).set('app', app);
		__(this).set('file', file);
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

	/**
	 * Set global configuration from file.
	 *
	 * @param file
	 */
	setConfigFromFile(file) {
		const configPath = __(this).get('app').make('path.config');
		const files = (Array.isArray(file) ? file : [file]).map((fileName) => {
			return path.join(configPath, fileName);
		});
		this.setConfig(this.file.loadFirst(files));
	}

	/**
	 * Get FileLoader instance.
	 *
	 * @returns {FileLoader}
	 */
	get file() {
		return __(this).get('file');
	}

}

module.exports = ConfigRepository;
