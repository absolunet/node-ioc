//--------------------------------------------------------
//-- Node IoC - File - Manager
//--------------------------------------------------------

import JavaScriptDriver from './drivers/JavaScriptDriver';
import JsonDriver       from './drivers/JsonDriver';
import NullDriver       from './drivers/NullDriver';
import TextDriver       from './drivers/TextDriver';
import YamlDriver       from './drivers/YamlDriver';
import hasDriver        from '../../../support/mixins/hasDriver';


/**
 * File manager that wraps some opinionated file system actions through the file engine.
 *
 * @memberof file.services
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class FileManager extends hasDriver() {

	/**
	 * @inheritdoc
	 * @private
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
	 * Load file data through the appropriate driver.
	 *
	 * @param {string} file - The file name.
	 * @param {boolean} [async] - Indicates that the call should be made async.
	 * @returns {*|Promise<*>} The content of the file.
	 */
	load(file, async = false) {
		const driver = this.getDriverForFile(file);
		const method = `load${async ? 'Async' : ''}`;

		return driver[method](file);
	}

	/**
	 * Asynchronously load file data.
	 *
	 * @param {string} file - The file name.
	 * @returns {Promise<*>} The content of the file.
	 */
	loadAsync(file) {
		return this.load(file, true);
	}

	/**
	 * Check if file exists.
	 *
	 * @param {string} file - The file name.
	 * @returns {boolean} Indicates that toe file or folder exists.
	 */
	exists(file) {
		return this.engine.exists(file);
	}

	/**
	 * Find first existing file.
	 *
	 * @param {Array<string>} files - List of file names.
	 * @returns {string|null} The first found file in the list, or null if none is found.
	 */
	findFirst(files) {
		return files.find((f) => {
			return this.exists(f);
		}) || null;
	}

	/**
	 * Load first existing file.
	 *
	 * @param {Array<string>} files - List of file names.
	 * @param {boolean} [async=false] - Indicates that the call should be made async.
	 * @returns {*|Promise<*>} The content of the first found file.
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
	 * @param {Array<string>} files - List of the file names.
	 * @returns {Promise<*>} The content of the first found file.
	 */
	loadFirstAsync(files) {
		return this.loadFirst(files, true);
	}

	/**
	 * Load all files in folder.
	 *
	 * @param {string} folder - The folder name.
	 * @param {*} [options] - The options to send during scanning directory.
	 * @param {string|null} [driver] - The driver name to use. If none is provided, the most appropriate driver for each file will be used.
	 * @returns {object<string,*>} The content fetched for each found file.
	 */
	loadInFolder(folder, options = {}, driver = null) {
		const data = {};

		if (!this.exists(folder)) {
			return data;
		}

		const files = this.scandir(folder, 'file', options);

		const driverInstance = driver ? this.driver(driver) : null;

		files.forEach((file) => {
			const fileData = (driverInstance || this.getDriverForFile(file)).load(this.app.formatPath(folder, file));
			const fileName = file.replace(/.\w+$/u, '');

			data[fileName] = fileData;
		});

		return data;
	}

	/**
	 * Load all files in folder recursively.
	 *
	 * @param {string} folder - The folder name.
	 * @param {*} [options] - The options to send during scanning directory.
	 * @param {string|null} [driver] - The driver name to use. If none is provided, the most appropriate driver for each file will be used.
	 * @returns {object<string,*>} The content fetched for each found file.
	 */
	loadRecursivelyInFolder(folder, options = {}, driver = null) {
		return this.loadInFolder(folder, { ...options, recursive: true }, driver);
	}

	/**
	 * Scan directory.
	 *
	 * @param {string} folder - The folder to scan.
	 * @param {string} [type] - The type of element we need to find, either "file" or "folder".
	 * @param {*} [options] - The options to send during scanning directory.
	 * @returns {Array<string>} The list of found items in the scanned directory.
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
	 * @param {string} file - The file path.
	 * @param {string} content - The content to write inside the file.
	 */
	write(file, content) {
		this.getDriverForFile(file).write(file, content);
	}

	/**
	 * Asynchronously write given file to a given destination.
	 *
	 * @param {string} file - The file path.
	 * @param {string} content - The content to write inside the file.
	 * @returns {Promise} The async process promise.
	 */
	async writeAsync(file, content) {
		await this.getDriverForFile(file).writeAsync(file, content);
	}

	/**
	 * Get driver based on file extension.
	 *
	 * @param {string} file - The file name.
	 * @returns {file.services.FileManager.drivers.Driver} The best guessed driver instance for the given file name.
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
	 * The file engine.
	 *
	 * @type {file.services.FileEngine}
	 */
	get engine() {
		return this.app.make('file.engine');
	}

}


export default FileManager;
