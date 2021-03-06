"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hasDriver = _interopRequireDefault(require("../../../support/mixins/hasDriver"));

var _DispatcherProxy = _interopRequireDefault(require("./DispatcherProxy"));

var _EventEmitterDriver = _interopRequireDefault(require("./drivers/EventEmitterDriver"));

var _PubSubJsDriver = _interopRequireDefault(require("./drivers/PubSubJsDriver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher
//--------------------------------------------------------

/**
 * Event dispatcher that manages the events publishing and subscribing.
 *
 * @memberof events.services
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Dispatcher extends (0, _hasDriver.default)() {
  /**
   * Dispatcher constructor.
   *
   * @param {...*} parameters - Injected parameters.
   * @returns {event.services.Dispatcher} The dispatcher instance wrapped by a proxy.
   */
  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new _DispatcherProxy.default());
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    super.init();
    this.addDriver('emitter', _EventEmitterDriver.default);
    this.addDriver('pubsubjs', _PubSubJsDriver.default);
  }
  /**
   * Get default driver to forward calls.
   *
   * @returns {event.services.Dispatcher.drivers.Driver} The default driver instance.
   */


  getForward() {
    if (this.hasDriver('default')) {
      return this.driver();
    }

    const {
      app
    } = this;
    const defaultDriver = 'emitter';
    const driver = app.isBound('config') ? app.make('config').get('events.default', defaultDriver) : defaultDriver;
    return this.driver(driver);
  }

}

var _default = Dispatcher;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;