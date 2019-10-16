"use strict";

exports.default = void 0;

var _hasEngine = _interopRequireDefault(require("../../../../support/mixins/hasEngine"));

var _NotImplementedError = _interopRequireDefault(require("../../../../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Drivers - Driver
//--------------------------------------------------------

/* istanbul ignore next */

/**
 * Abstract driver that defines the basic interface for an event dispatcher driver.
 *
 * @memberof events.services.Dispatcher.drivers
 * @augments support.mixins.HasEngine
 * @abstract
 * @hideconstructor
 */
class Driver extends (0, _hasEngine.default)() {
  /**
   * Add event listener.
   *
   * @param {string} event - The event to listen.
   * @param {Function} listener - The listener.
   * @returns {Driver} - The current driver instance.
   * @abstract
   */
  on(event, listener) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'on', 'Driver');
  }
  /**
   * Remove event listener for single listener.
   *
   * @param {string} event - The event that has been listen.
   * @param {Function} listener - The listener.
   * @returns {Driver} - The current driver instance.
   * @abstract
   */


  off(event, listener) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'off', 'Driver');
  }
  /**
   * Add event listener for first event dispatch only.
   *
   * @param {string} event - The event to listen.
   * @param {Function} listener - The listener.
   * @returns {Driver} - The current driver instance.
   * @abstract
   */


  once(event, listener) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'once', 'Driver');
  }
  /**
   * Dispatch an event with a given payload.
   *
   * @param {string} event - The event to dispatch.
   * @param {*} [payload] - The payload to send into the listeners.
   * @returns {Driver} - The current driver instance.
   * @abstract
   */


  emit(event, payload) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'emit', 'Driver');
  }
  /**
   * Remove listeners for a given event.
   *
   * @param {string} event - The event that has been listen.
   * @returns {Driver} - The current driver instance.
   * @abstract
   */


  removeListeners(event) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'removeListeners', 'Driver');
  }
  /**
   * Remove all listeners for all events.
   *
   * @returns {Driver} - The current driver instance.
   * @abstract
   */


  removeAllListeners() {
    throw new _NotImplementedError.default(this, 'removeAllListeners', 'Driver');
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;