//--------------------------------------------------------
//-- Node IoC - File - Loader
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const fss = require('@absolunet/fss');
const JavaScriptDriver = require('./drivers/JavaScriptDriver');
const NullDriver = require('./drivers/NullDriver');
const JsonDriver = require('./drivers/JsonDriver');
const path = require('path');
const TextDriver = require('./drivers/TextDriver');
const YamlDriver = require('./drivers/YamlDriver');


class FileManager {

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
			return fss.exists(f);
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
		return this.loadFirst(files, true);
	}

	/**
	 * Load all files in folder.
	 *
	 * @param {string} folder
	 * @returns {*}
	 */
	loadInFolder(folder) {
		if (!fss.exists(folder)) {
			throw new Error(`Folder [${folder}] does not exists`);
		}

		const files = fss.scandir(folder, 'file');
		const data = {};

		files.forEach((file) => {
			const fileData = this.getDriverForFile(file).load(path.join(folder, file));
			const fileName = file.split('/').pop().split('.').shift();

			data[fileName] = fileData;
		});

		return data;
	}

	/**
	 * Scan directory.
	 *
	 * @param {string} folder
	 * @param {string} [type]
	 * @param {*} [options]
	 * @returns {string[]}
	 */
	scandir(folder, type = 'file', options = {}) {
		try {
			return fss.scandir(folder, type, options);
		} catch (error) {
			return [];
		}
	}

	write(file, destination) {
		this.getDriverForFile(destination).write(file, destination);
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

module.exports = FileManager;
