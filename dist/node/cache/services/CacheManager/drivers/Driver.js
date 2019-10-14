//--------------------------------------------------------
//-- Node IoC - Cache - Services - Store resolver - Drivers - Driver
//--------------------------------------------------------
'use strict';

const hasEngine = require('../../../../support/mixins/hasEngine');

const NotImplementedError = require('../../../../foundation/exceptions/NotImplementedError');
/* istanbul ignore next */

/**
 * Abstract cache driver class that describe abstract methods to be implemented for a cache manager driver.
 *
 * @memberof cache.services.CacheManager.drivers
 * @augments support.mixins.HasEngine
 * @hideconstructor
 */


class Driver extends hasEngine() {
  /**
   * Class dependencies.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['driver.config', 'helper.date']);
  }
  /**
   * Retrieve an item from the cache by key.
   *
   * @param {string} key - The cache key.
   * @param {*} [defaultValue] - The default value.
   * @returns {Promise<*>} - The cached value.
   * @abstract
   */


  get(key, defaultValue) {
    // eslint-disable-line no-unused-vars
    throw new NotImplementedError(this, 'get', 'Promise<any>');
  }
  /**
   * Insert an item in the cache with key and expiration delay.
   *
   * @param {string} key - The cache key.
   * @param {*} value - The value to cache.
   * @param {number} [seconds] - The cache expiration delay, in seconds.
   * @returns {Promise<void>} - The async call promise.
   * @async
   * @abstract
   */


  put(key, value, seconds) {
    // eslint-disable-line no-unused-vars
    throw new NotImplementedError(this, 'put', 'Promise<void>');
  }
  /**
   * Insert an item in the cache with key forever, without expiration.
   *
   * @param {string} key - The cache key.
   * @param {*} value - The value to cache.
   * @returns {Promise<void>} - The async call promise.
   * @async
   * @abstract
   */


  forever(key, value) {
    // eslint-disable-line no-unused-vars
    throw new NotImplementedError(this, 'forever', 'Promise<void>');
  }
  /**
   * Increment an item in cache.
   *
   * @param {string} key - The cache key.
   * @param {number} [increment=1] - The increment value to add to the cached entry.
   * @returns {Promise<void>} - The async call promise.
   * @async
   * @abstract
   */


  increment(key, increment = 1) {
    // eslint-disable-line no-unused-vars
    throw new NotImplementedError(this, 'increment', 'Promise<void>');
  }
  /**
   * Decrement an item in cache.
   *
   * @param {string} key - The cache key.
   * @param {number} [decrement] - The decrement value to substract from the cached entry.
   * @returns {Promise<void>} - The async call promise.
   * @async
   * @abstract
   */


  decrement(key, decrement = 1) {
    // eslint-disable-line no-unused-vars
    throw new NotImplementedError(this, 'decrement', 'Promise<void>');
  }
  /**
   * Delete an item in the cache by key.
   *
   * @param {string} key - The cache key.
   * @returns {Promise<void>} - The async call promise.
   * @async
   * @abstract
   */


  delete(key) {
    // eslint-disable-line no-unused-vars
    throw new NotImplementedError(this, 'delete', 'Promise<void>');
  }
  /**
   * Delete all items the cache.
   *
   * @returns {Promise<void>} - The async call promise.
   * @async
   * @abstract
   */


  flush() {
    throw new NotImplementedError(this, 'flush', 'Promise<void>');
  }
  /**
   * Get current time in seconds.
   *
   * @returns {number} - The current unix timestamp.
   */


  now() {
    return this.dateHelper().unix();
  }
  /**
   * Current driver configuration data.
   *
   * @type {object<string, *>}
   */


  get config() {
    return this.driverConfig;
  }
  /**
   * Date helper.
   *
   * @type {DateHelper}
   */


  get dateHelper() {
    return this.helperDate;
  }

}

module.exports = Driver;