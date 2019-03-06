//--------------------------------------------------------
//-- Node IoC - File - Loader
//--------------------------------------------------------
'use strict';


const fs = require('fs');
const __ = require('@absolunet/private-registry');

const TextDriver = require('./drivers/TextDriver');
const JavaScriptDriver = require('./drivers/JavaScriptDriver');
const JsonDriver = require('./drivers/JsonDriver');
const YamlDriver = require('./drivers/YamlDriver');
const NullDriver = require('./drivers/NullDriver');


class FileLoader {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * Loader constructor.
	 *
	 * @param {Application} app
	 */
	constructor(app) {
		__(this).set('app', app);
		__(this).set('drivers', {});
		this.addDriver('text', TextDriver);
		this.addDriver('js', JavaScriptDriver);
		this.addDriver('json', JsonDriver);
		this.addDriver('yaml', YamlDriver);
		this.addDriver('null', NullDriver);
		this.setDriverAlias('yaml', 'yml');
		this.setDefaultDriver('text');
	}

	/**
	 * Load file data.
	 *
	 * @param {string} file
	 * @param {boolean} [async]
	 * @returns {*}
	 */
	load(file, async = false) {
		const driver = this.getDriverForFile(file);
		const method = `load${async ? 'Async' : ''}`;

		return driver[method](file);
	}

	/**
	 * Asynchronously load file data.
	 *
	 * @param {string} file
	 * @returns {*}
	 */
	loadAsync(file) {
		return this.load(file, true);
	}

	/**
	 * Load first existing file.
	 *
	 * @param {string[]} files
	 * @param {boolean} [async]
	 * @returns {*}
	 */
	loadFirst(files, async = false) {
		const file = files.find((f) => {
			return fs.existsSync(f);
		});
		if (!file) {
			return {};
		}

		return this.load(file, async);
	}

	/**
	 * Asynchronously load first existing file.
	 *
	 * @param {string[]} files
	 * @returns {*}
	 */
	loadFirstAsync(files) {
		return this.ooadFirst(files, true);
	}

	/**
	 * Get loader driver by name.
	 *
	 * @param name
	 * @returns {Driver}
	 */
	driver(name = 'default') {
		const driver = __(this).get('drivers')[name];
		if (!driver) {
			throw new Error(`Driver [${name}] cannot be found.`);
		}

		return driver;
	}

	/**
	 * Get driver based on file name.
	 *
	 * @param {string} file
	 * @returns {Driver}
	 */
	getDriverForFile(file) {
		if (!file) {
			return this.driver('null');
		}

		const ext = file.split('.').pop();
		if (!__(this).get('drivers')[ext]) {
			return this.driver();
		}

		return this.driver(ext);
	}

	/**
	 * Add a driver and bind it with the given name.
	 *
	 * @param {string} name
	 * @param {Driver} driver
	 */
	addDriver(name, driver) {
		__(this).get('drivers')[name] = __(this).get('app').make(driver);
	}

	/**
	 * Set given driver name as the default driver.
	 *
	 * @param {string} name
	 */
	setDefaultDriver(name) {
		this.setDriverAlias(name, 'default');
	}

	/**
	 * Give driver an alias name.
	 *
	 * @param {string} name
	 * @param {string} alias
	 */
	setDriverAlias(name, alias) {
		this.addDriver(alias, this.driver(name));
	}

}

module.exports = FileLoader;
