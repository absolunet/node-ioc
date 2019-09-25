//--------------------------------------------------------
//-- Node IoC - Cache - Services - Store resolver - Drivers - Driver
//--------------------------------------------------------
'use strict';

const hasEngine           = require('../../../../support/mixins/hasEngine');
const NotImplementedError = require('../../../../foundation/exceptions/NotImplementedError');

/* istanbul ignore next */
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
		throw new NotImplementedError(this, 'get', 'Promise<any>');
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
		throw new NotImplementedError(this, 'put', 'Promise<void>');
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
		throw new NotImplementedError(this, 'forever', 'Promise<void>');
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
		throw new NotImplementedError(this, 'increment', 'Promise<void>');
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
		throw new NotImplementedError(this, 'decrement', 'Promise<void>');
	}

	/**
	 * Delete an item in the cache by key.
	 *
	 * @param {string} key
	 * @returns {Promise<void>}
	 * @abstract
	 */
	delete() {
		throw new NotImplementedError(this, 'delete', 'Promise<void>');
	}

	/**
	 * Delete all items the cache.
	 *
	 * @returns {Promise<void>}
	 * @abstract
	 */
	flush() {
		throw new NotImplementedError(this, 'flush', 'Promise<void>');
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
