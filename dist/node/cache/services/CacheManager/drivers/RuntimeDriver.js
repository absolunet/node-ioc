"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Cache - Services - Store resolver - Drivers - File driver
//--------------------------------------------------------

/**
 * Cache driver that uses a runtime variable to cache data.
 * Since it only uses a variable, the cached values are flushed hen the process closes.
 *
 * @memberof cache.services.CacheManager.drivers
 * @augments cache.services.CacheManager.drivers.Driver
 * @hideconstructor
 */
class RuntimeDriver extends _Driver.default {
  /**
   * @inheritdoc
   * @private
   */
  init() {
    (0, _privateRegistry.default)(this).set('store', {});
  }
  /**
   * @inheritdoc
   */


  get(key, defaultValue = null) {
    const entry = (0, _privateRegistry.default)(this).get('store')[key];

    if (!entry || typeof entry.value === 'undefined') {
      return defaultValue;
    }

    const {
      value,
      expiration
    } = entry;

    if (this.now() > expiration) {
      this.flush(value);
      return defaultValue;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      this.delete(key);
      return defaultValue;
    }
  }
  /**
   * @inheritdoc
   */


  put(key, value, seconds = this.driverConfig.expiration || 600) {
    (0, _privateRegistry.default)(this).get('store')[key] = {
      value: JSON.stringify(value),
      expiration: seconds !== 0 ? this.now() + seconds : Number.MAX_SAFE_INTEGER
    };
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


  increment(key, increment = 1) {
    const value = this.get(key, 0);
    const {
      expiration
    } = (0, _privateRegistry.default)(this).get('store')[key] || {};
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


  delete(key) {
    delete (0, _privateRegistry.default)(this).get('store')[key];
  }
  /**
   * @inheritdoc
   */


  flush() {
    (0, _privateRegistry.default)(this).set('store', {});
  }

}

var _default = RuntimeDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;