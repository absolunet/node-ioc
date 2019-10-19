"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Drivers - PubSubJS Driver
//--------------------------------------------------------

/**
 * Dispatcher driver that uses PubSubJS as dispatcher engine.
 *
 * @memberof events.services.Dispatcher.drivers
 * @augments events.services.Dispatcher.drivers.Driver
 * @hideconstructor
 */
class PubSubJsDriver extends _Driver.default {
  /**
   * @inheritdoc
   * @private
   */
  init() {
    (0, _privateRegistry.default)(this).set('tokens', {});
    this.setEngine(_pubsubJs.default);
  }
  /**
   * @inheritdoc
   */


  on(event, listener) {
    this.saveTokenForCall(event, listener, 'subscribe');
    return this;
  }
  /**
   * @inheritdoc
   */


  once(event, listener) {
    this.saveTokenForCall(event, listener, 'subscribeOnce');
    return this;
  }
  /**
   * @inheritdoc
   */


  off(event, listener) {
    const tokenMap = (0, _privateRegistry.default)(this).get('tokens')[event];

    if (tokenMap) {
      const token = tokenMap.get(listener);

      if (token) {
        this.engine.unsubscribe(token);
      }
    }

    return this;
  }
  /**
   * @inheritdoc
   */


  removeListeners(event) {
    this.engine.clearSubscriptions(event);
    return this;
  }
  /**
   * @inheritdoc
   */


  removeAllListeners() {
    this.engine.clearAllSubscriptions();
    return this;
  }
  /**
   * @inheritdoc
   */


  emit(event, payload) {
    this.engine.publishSync(event, payload);
    return this;
  }
  /**
   * Save token got from the given call on the engine.
   *
   * @param {string} event - The event to listen.
   * @param {Function} listener - The listener.
   * @param {string} method - The method to use on the engine.
   * @returns {events.services.Dispatcher.drivers.PubSubJsDriver} The current driver instance.
   */


  saveTokenForCall(event, listener, method) {
    const tokens = (0, _privateRegistry.default)(this).get('tokens');
    tokens[event] = tokens[event] || new Map();
    tokens[event].set(listener, this.engine[method](event, listener));
    return this;
  }

}

var _default = PubSubJsDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;