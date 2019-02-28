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
	 * @param {ConfigLoader} configLoader
	 */
	constructor(app, configLoader) {
		__(this).set('loader', configLoader);
		if (app.isBound('path.config')) {
			const configPath = app.make('path.config');
			this.setFirstFile(['js'].map((ext) => {
				return path.join(configPath, `config.${ext}`);
			}));
		} else {
			this.setConfig({});
		}
	}

	/**
	 * Get configuration value.
	 *
	 * @param {string} key
	 * @param {*} defaultValue
	 * @returns {*}
	 */
	get(key, defaultValue) {
		return dot.pick(key, __(this).get('config')) || defaultValue;
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
	 * Set configuration file to fetch configuration from.
	 *
	 * @param {string} file
	 */
	setFile(file) {
		const config = __(this).get('loader').load(file);
		this.setConfig(config);
	}

	/**
	 * Set first existing configuration file from collection to fetch configuration from.
	 *
	 * @param {string[]} files
	 */
	setFirstFile(files) {
		const config = __(this).get('loader').loadFirst(files);
		this.setConfig(config);
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
	 * File mutator.
	 *
	 * @param {string} file
	 */
	set file(file) {
		this.setFile(file);
	}

}

module.exports = ConfigRepository;
