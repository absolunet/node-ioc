//--------------------------------------------------------
//-- Spark IoC - Config - Config Repository
//--------------------------------------------------------
'use strict';

const fs = require('fs');
const __ = require('@absolunet/private-registry');
const JavaScriptDriver = require('./../drivers/JavaScriptDriver');
const JsonDriver = require('./../drivers/JsonDriver');
const YamlDriver = require('./../drivers/YamlDriver');


class Loader {

	static get dependencies() {
		return ['app'];
	}

	constructor(app) {
		__(this).set('app', app);
		__(this).set('drivers', {});
		this.addDriver('js', JavaScriptDriver);
		this.addDriver('json', JsonDriver);
		this.addDriver('yaml', YamlDriver);
		this.setDriverAlias('yaml', 'yml');
		this.setDefaultDriver('js');
	}

	/**
	 * Load file data.
	 *
	 * @param {string} file
	 * @returns {*}
	 */
	load(file) {
		return Object.assign({}, this.getDriverForFile(file).load(file));
	}

	/**
	 * Load first existing file.
	 *
	 * @param {string[]} files
	 * @returns {*}
	 */
	loadFirst(files) {
		const file = files.find((f) => {
			return fs.existsSync(f);
		});
		if (!file) {
			throw new Error('No file in the given collection exists.');
		}

		return this.load(file);
	}

	driver(name = 'default') {
		const driver = __(this).get('drivers')[name];
		if (!driver) {
			throw new Error(`Driver [${name}] cannot be found.`);
		}

		return driver;
	}

	getDriverForFile(file) {
		const ext = file.split('.').pop();

		return this.driver(ext);
	}

	addDriver(name, driver) {
		__(this).get('drivers')[name] = __(this).get('app').make(driver);
	}

	setDefaultDriver(name) {
		this.setDriverAlias(name, 'default');
	}

	setDriverAlias(name, alias) {
		this.addDriver(alias, this.driver(name));
	}

}

module.exports = Loader;
