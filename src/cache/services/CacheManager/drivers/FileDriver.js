//--------------------------------------------------------
//-- Node IoC - Cache - Services - Store resolver - Drivers - File driver
//--------------------------------------------------------

import __     from '@absolunet/private-registry';
import Driver from './Driver';


/**
 * Cache driver that uses the file system to store data.
 *
 * @memberof cache.services.CacheManager.drivers
 * @augments cache.services.CacheManager.drivers.Driver
 * @hideconstructor
 */
class FileDriver extends Driver {

	/**
	 * Class dependencies: <code>['app', 'driver.config', 'file', 'helper.date']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'file']);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		if (super.init) {
			super.init();
		}

		__(this).set('name', this.driverConfig.name || 'file');
	}

	/**
	 * @inheritdoc
	 */
	async get(key, defaultValue = null) {
		const entry = await this.getEntry(key);
		if (!entry || typeof entry.value === 'undefined') {
			return defaultValue;
		}

		const { value, expiration } = entry;

		if (this.now() > expiration) {
			this.flush(key);

			return defaultValue;
		}

		return value;
	}

	/**
	 * @inheritdoc
	 */
	async put(key, value, seconds = this.driverConfig.expiration || 600) {
		const content    = await this.getContent();
		const expiration = seconds !== 0 ? this.now() + seconds : Number.MAX_SAFE_INTEGER;
		content[key]     = { value, expiration };
		await this.setContent(content);
	}

	/**
	 * @inheritdoc
	 */
	forever(key, value) {
		return this.put(key, value, 0);
	}

	/**
	 * @inheritdoc
	 */
	async increment(key, increment = 1) {
		const value          = await this.get(key, 0);
		const { expiration } = this.getEntry(key) || {};

		return this.put(key, value + increment, expiration ? expiration - this.now() : undefined);
	}

	/**
	 * @inheritdoc
	 */
	decrement(key, decrement = 1) {
		return this.increment(key, decrement * -1);
	}

	/**
	 * @inheritdoc
	 */
	async delete(key) {
		const content = await this.getContent();
		delete content[key];

		await this.setContent(content);
	}

	/**
	 * @inheritdoc
	 */
	async flush() {
		await this.setContent({});
	}

	/**
	 * Ensure that the JSON file exists.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async ensureFileExists() {
		if (!this.file.exists(this.fileName)) {
			await this.file.engine.async.ensureFile(this.fileName);
			await this.file.writeAsync(this.fileName, {});
		}

		try {
			await this.file.loadAsync(this.fileName);
		} catch (error) {
			if (error instanceof SyntaxError) {
				await this.file.writeAsync(this.fileName, {});
			}
		}
	}

	/**
	 * Get cache entry by key.
	 *
	 * @param {string} key - The cache key.
	 * @returns {Promise<{value: *, expiration: number}>} The cache entry.
	 */
	async getEntry(key) {
		const content = await this.getContent();

		return content[key];
	}

	/**
	 * Get cache entries.
	 *
	 * @returns {Promise<object<string, {value: *, expiration: number}>>} All the cache entries.
	 */
	async getContent() {
		await this.ensureFileExists();

		return this.file.loadAsync(this.fileName);
	}

	/**
	 * Set cache entries.
	 *
	 * @param {object<string, { value: *, expiration: number}>} content - The cache entries.
	 * @returns {Promise} The async process promise.
	 */
	async setContent(content) {
		await this.ensureFileExists();
		await this.file.writeAsync(this.fileName, content);
	}

	/**
	 * Cache file name, that read given "file" configuration value, or a default value.
	 * It should normally be located inside the application storage folder.
	 *
	 * @type {string}
	 */
	get fileName() {
		return this.driverConfig.file || this.app.storagePath(`framework/cache/data/${__(this).get('name')}.json`);
	}

}


export default FileDriver;
