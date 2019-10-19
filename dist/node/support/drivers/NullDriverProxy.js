"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - Support - Drivers - Null Driver proxy
//--------------------------------------------------------

/**
 * Null driver proxy that is infinitely chaineable.
 * It is a great solution to test something that needs a complex instance or a suite of nested dependencies.
 *
 * @memberof support.drivers
 * @hideconstructor
 */
class NullDriverProxy {
  /**
   * NullDriverProxy constructor.
   *
   * @returns {Function} A generic class wrapped by a proxy, which handler is the current null driver proxy instance.
   */
  constructor() {
    return new Proxy(class {}, this); // eslint-disable-line jsdoc/require-jsdoc
  }
  /**
   * Handle construct call.
   *
   * @returns {support.drivers.NullDriverProxy} A null driver proxy instance.
   */


  construct() {
    return this.makeProxy();
  }
  /**
   * Handle property access.
   *
   * @param {object} object - The generic class instance.
   * @param {string|symbol|number} property - The property name.
   * @returns {GeneratorFunction|null|support.drivers.NullDriverProxy} A generator for iterator property, null for symbol property, null driver proxy instance for anything else.
   */


  get(object, property) {
    if (typeof property === 'symbol') {
      if (property === Symbol.iterator) {
        return function* () {}; // eslint-disable-line no-empty-function
      }

      return null;
    }

    if (!object[property]) {
      object[property] = this.makeProxy();
    }

    return object[property];
  }
  /**
   * Handle function call on null driver.
   *
   * @returns {support.drivers.NullDriverProxy} A null driver proxy instance.
   */


  apply() {
    return this.makeProxy();
  }
  /**
   * Make new null proxy.
   *
   * @returns {support.drivers.NullDriverProxy} A null driver proxy instance.
   */


  makeProxy() {
    const {
      constructor: NullProxy
    } = this;
    return new NullProxy();
  }

}

var _default = NullDriverProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;