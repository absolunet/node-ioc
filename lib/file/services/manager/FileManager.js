//--------------------------------------------------------
//-- Node IoC - File - Loader
//--------------------------------------------------------
'use strict';

const path = require('path');
const __   = require('@absolunet/private-registry');

const JavaScriptDriver = require('./drivers/JavaScriptDriver');
const JsonDriver       = require('./drivers/JsonDriver');
const NullDriver       = require('./drivers/NullDriver');
const TextDriver       = require('./drivers/TextDriver');
const YamlDriver       = require('./drivers/YamlDriver');
const hasDriver        = require('../../../support/mixins/hasDriver');


class FileManager extends hasDriver() {

	/**
	 * FileManager initializer
	 */
	init() {
		super.init();
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
	 * Check if file exists.
	 *
	 * @param {string} file
	 * @returns {boolean}
	 */
	exists(file) {
		return this.engine.sync.exists(file);
	}

	/**
	 * Find first existing file.
	 *
	 * @param {Array<string>} files
	 * @returns {string|null}
	 */
	findFirst(files) {
		return files.find((f) => {
			return this.exists(f);
		}) || null;
	}

	/**
	 * Load first existing file.
	 *
	 * @param {string[]} files
	 * @param {boolean} [async]
	 * @returns {*}
	 */
	loadFirst(files, async = false) {
		const file = this.findFirst(files);

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
	 * @param {*} [options]
	 * @param {string|null} [driver]
	 * @returns {*}
	 */
	loadInFolder(folder, options = {}, driver = null) {
		if (!this.exists(folder)) {
			throw new Error(`Folder [${folder}] does not exists.`);
		}

		const files = this.scandir(folder, 'file', options);
		const data = {};

		const driverInstance = driver ? this.driver(driver) : null;

		files.forEach((file) => {
			const fileData = (driverInstance || this.getDriverForFile(file)).load(path.join(folder, file));
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
	 * @returns {Array<string>}
	 */
	scandir(folder, type = 'file', options = {}) {
		try {
			return this.engine.sync.scandir(folder, type, options);
		} catch (error) {
			return [];
		}
	}

	/**
	 * Write given file to a given destination.
	 *
	 * @param {string} content
	 * @param {string} destination
	 */
	write(content, destination) {
		this.getDriverForFile(destination).write(content, destination);
	}

	/**
	 * Asynchronously write given file to a given destination.
	 *
	 * @param {string} content
	 * @param {string} destination
	 * @returns {Promise<void>}
	 */
	async writeAsync(content, destination) {
		await this.getDriverForFile(destination).writeAsync(content, destination);
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

		const extension = file.split('.').pop();
		if (!__(this).get('drivers')[extension]) {
			return this.driver();
		}

		return this.driver(extension);
	}

	/**
	 * @type {FileEngine}
	 */
	get engine() {
		return __(this).get('app').make('file.engine');
	}

}


module.exports = FileManager;
