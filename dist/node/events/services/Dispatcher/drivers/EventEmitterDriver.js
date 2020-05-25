"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _events = _interopRequireDefault(require("events"));

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Drivers - Event Emitter Driver
//--------------------------------------------------------

/**
 * Dispatcher driver that uses the native EventEmitter from Node.js as dispatcher engine.
 *
 * @memberof events.services.Dispatcher.drivers
 * @augments events.services.Dispatcher.drivers.Driver
 * @hideconstructor
 */
class EventEmitterDriver extends _Driver.default {
  /**
   * @inheritdoc
   * @private
   */
  init() {
    (0, _privateRegistry.default)(this).set('listeners', new WeakMap());
    this.setEngine(new _events.default());
  }
  /**
   * @inheritdoc
   */


  on(event, listener) {
    this.engine.on(event, this.makeListenerForEvent(event, listener));
    return this;
  }
  /**
   * @inheritdoc
   */


  once(event, listener) {
    this.engine.once(event, this.makeListenerForEvent(event, listener));
    return this;
  }
  /**
   * @inheritdoc
   */


  off(event, listener) {
    this.engine.off(event, (0, _privateRegistry.default)(this).get('listeners').get(listener) || listener);
    return this;
  }
  /**
   * @inheritdoc
   */


  emit(event, payload = null) {
    this.engine.emit(event, payload);
    return this;
  }
  /**
   * @inheritdoc
   */


  removeListeners(event) {
    this.engine.removeAllListeners(event);
    return this;
  }
  /**
   * @inheritdoc
   */


  removeAllListeners() {
    this.engine.removeAllListeners();
    return this;
  }
  /**
   * Make and save a listener that will call the given listener with the event and the payload instead of the payload only.
   *
   * @param {string} event - The event to listen.
   * @param {Function} listener - The listener.
   * @returns {Function} The listener wrapper acting as the listener singleton inside the EventEmitter instance.
   */


  makeListenerForEvent(event, listener) {
    const realListener = payload => {
      return listener(event, payload);
    };

    (0, _privateRegistry.default)(this).get('listeners').set(listener, realListener);
    return realListener;
  }

}

var _default = EventEmitterDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;