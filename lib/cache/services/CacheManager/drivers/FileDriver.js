//--------------------------------------------------------
//-- Node IoC - Cache - Services - Store resolver - Drivers - File driver
//--------------------------------------------------------
'use strict';

const __     = require('@absolunet/private-registry');
const Driver = require('./Driver');


class FileDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'file']);
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		if (super.init) {
			super.init();
		}

		__(this).set('name', this.driverConfig.name || 'file');
	}

	/**
	 * {@inheritdoc}
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
	 * {@inheritdoc}
	 */
	async put(key, value, seconds = this.driverConfig.expiration || 600) {
		const content    = await this.getContent();
		const expiration = seconds !== 0 ? this.now() + seconds : Number.MAX_SAFE_INTEGER;
		content[key]     = { value, expiration };
		await this.setContent(content);
	}

	/**
	 * {@inheritdoc}
	 */
	forever(key, value) {
		return this.put(key, value, 0);
	}

	/**
	 * {@inheritdoc}
	 */
	async increment(key, increment = 1) {
		const value          = await this.get(key, 0);
		const { expiration } = this.getEntry(key) || {};

		return this.put(key, value + increment, expiration ? expiration - this.now() : undefined);
	}

	/**
	 * {@inheritdoc}
	 */
	decrement(key, decrement = 1) {
		return this.increment(key, decrement * -1);
	}

	/**
	 * {@inheritdoc}
	 */
	async delete(key) {
		const content = await this.getContent();
		delete content[key];

		await this.setContent(content);
	}

	/**
	 * {@inheritdoc}
	 */
	async flush() {
		await this.setContent({});
	}

	/**
	 * Ensure that the JSON file exists.
	 *
	 * @returns {Promise<void>}
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
	 * @param {string} key
	 * @returns {Promise<{value: *, expiration: number}>}
	 */
	async getEntry(key) {
		const content = await this.getContent();

		return content[key];
	}

	/**
	 * Get cache entries.
	 *
	 * @returns {Promise<Object<string, { value: *, expiration: number}>>}
	 */
	async getContent() {
		await this.ensureFileExists();

		return this.file.loadAsync(this.fileName);
	}

	/**
	 * Set cache entries.
	 *
	 * @param {Object<string, { value: *, expiration: number}>} content
	 * @returns {Promise<void>}
	 */
	async setContent(content) {
		await this.ensureFileExists();
		await this.file.writeAsync(this.fileName, content);
	}

	/**
	 * @type {string}
	 */
	get fileName() {
		return this.driverConfig.file || this.app.storagePath(`framework/cache/data/${__(this).get('name')}.json`);
	}

}


module.exports = FileDriver;
