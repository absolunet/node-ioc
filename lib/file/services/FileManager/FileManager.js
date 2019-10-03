//--------------------------------------------------------
//-- Node IoC - File - Manager
//--------------------------------------------------------
'use strict';

const JavaScriptDriver = require('./drivers/JavaScriptDriver');
const JsonDriver       = require('./drivers/JsonDriver');
const NullDriver       = require('./drivers/NullDriver');
const TextDriver       = require('./drivers/TextDriver');
const YamlDriver       = require('./drivers/YamlDriver');
const hasDriver        = require('../../../support/mixins/hasDriver');


class FileManager extends hasDriver() {

	/**
	 * {@inheritdoc}
	 */
	init() {
		super.init();
		this.addDriver('text', TextDriver);
		this.addDriver('js',   JavaScriptDriver);
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
		return this.engine.exists(file);
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
	 * @param {Array<string>} files
	 * @param {boolean} [async=false]
	 * @returns {*}
	 */
	loadFirst(files, async = false) {
		const file = this.findFirst(files);

		if (!file) {
			return null;
		}

		return this.load(file, async);
	}

	/**
	 * Asynchronously load first existing file.
	 *
	 * @param {Array<string>} files
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
	 * @returns {object<string,*>}
	 */
	loadInFolder(folder, options = {}, driver = null) {
		if (!this.exists(folder)) {
			throw new TypeError(`Folder [${folder}] does not exists.`);
		}

		const files = this.scandir(folder, 'file', options);
		const data = {};

		const driverInstance = driver ? this.driver(driver) : null;

		files.forEach((file) => {
			const fileData = (driverInstance || this.getDriverForFile(file)).load(this.app.formatPath(folder, file));
			const fileName = file.split('/').pop().split('.').shift();

			data[fileName] = fileData;
		});

		return data;
	}

	/**
	 * Load all files in folder recursively.
	 *
	 * @param {string} folder
	 * @param {*} [options]
	 * @param {string|null} [driver]
	 * @returns {object<string,*>}
	 */
	loadRecursivelyInFolder(folder, options = {}, driver = null) {
		return this.loadInFolder(folder, { ...options, recursive: true }, driver);
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
			return this.engine.scandir(folder, type, options);
		} catch (error) {
			return [];
		}
	}

	/**
	 * Write given file to a given destination.
	 *
	 * @param {string} file
	 * @param {string} content
	 */
	write(file, content) {
		this.getDriverForFile(file).write(file, content);
	}

	/**
	 * Asynchronously write given file to a given destination.
	 *
	 * @param {string} file
	 * @param {string} content
	 * @returns {Promise<void>}
	 */
	async writeAsync(file, content) {
		await this.getDriverForFile(file).writeAsync(file, content);
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

		if (this.hasDriver(extension)) {
			return this.driver(extension);
		}

		return this.driver();
	}

	/**
	 * @type {FileEngine}
	 */
	get engine() {
		return this.app.make('file.engine');
	}

}


module.exports = FileManager;
