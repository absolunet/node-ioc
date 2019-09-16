//--------------------------------------------------------
//-- Node IoC - Cache - Services - Store resolver - Drivers - Driver
//--------------------------------------------------------
'use strict';

const hasEngine = require('../../../../support/mixins/hasEngine');


class Driver extends hasEngine() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['driver.config', 'helper.date']);
	}

	/**
	 * Retrieve an item from the cache by key.
	 *
	 * @param {string} key
	 * @param {*} [defaultValue]
	 * @returns {Promise<*>}
	 * @abstract
	 */
	get() {
		throw new TypeError('Method get() must be implemented.');
	}

	/**
	 * Insert an item in the cache with key and expiration delay.
	 *
	 * @param {string} key
	 * @param {*} value
	 * @param {number} [seconds]
	 * @returns {Promise<void>}
	 * @abstract
	 */
	put() {
		throw new TypeError('Method put() must be implemented.');
	}

	/**
	 * Insert an item in the cache with key forever, without expiration.
	 *
	 * @param {string} key
	 * @param {*} value
	 * @returns {Promise<void>}
	 * @abstract
	 */
	forever() {
		throw new TypeError('Method forever() must be implemented.');
	}

	/**
	 * Increment an item in cache.
	 *
	 * @param {string} key
	 * @param {number} [increment]
	 * @returns {Promise<void>}
	 * @abstract
	 */
	increment() {
		throw new TypeError('Method implement() must be implemented.');
	}

	/**
	 * Decrement an item in cache.
	 *
	 * @param {string} key
	 * @param {number} [decrement]
	 * @returns {Promise<void>}
	 * @abstract
	 */
	decrement() {
		throw new TypeError('Method decrement() must be implemented.');
	}

	/**
	 * Delete an item in the cache by key.
	 *
	 * @param {string} key
	 * @returns {Promise<void>}
	 * @abstract
	 */
	delete() {
		throw new TypeError('Method delete() must be implemented.');
	}

	/**
	 * Delete all items the cache.
	 *
	 * @returns {Promise<void>}
	 * @abstract
	 */
	flush() {
		throw new TypeError('Method flush() must be implemented.');
	}

	/**
	 * Get current time in seconds.
	 *
	 * @returns {number}
	 */
	now() {
		return this.dateHelper().unix();
	}

	/**
	 * @type {Object<string, *>}
	 */
	get config() {
		return this.driverConfig;
	}

	/**
	 * @type {DateHelper}
	 */
	get dateHelper() {
		return this.helperDate;
	}

}


module.exports = Driver;
