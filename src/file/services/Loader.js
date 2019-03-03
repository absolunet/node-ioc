//--------------------------------------------------------
//-- Node IoC - File - Loader
//--------------------------------------------------------
'use strict';


const fs = require('fs');
const __ = require('@absolunet/private-registry');


class Loader {

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
			return {};
		}

		return this.load(file);
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
		const ext = file.split('.').pop();

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

module.exports = Loader;
