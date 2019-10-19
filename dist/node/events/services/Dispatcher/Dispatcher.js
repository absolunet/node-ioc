"use strict";

exports.default = void 0;

var _hasDriver = _interopRequireDefault(require("../../../support/mixins/hasDriver"));

var _forwardCalls = _interopRequireDefault(require("../../../support/mixins/forwardCalls"));

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
 * @augments support.mixins.ForwardCalls
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Dispatcher extends (0, _forwardCalls.default)((0, _hasDriver.default)()) {
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
    const {
      app
    } = this;
    const defaultDriver = app.isBound('config') ? app.make('config').get('events.default', 'emitter') : 'emitter';
    this.setDefaultDriver(defaultDriver);
  }
  /**
   * @inheritdoc
   */


  getForward() {
    return this.driver();
  }

}

var _default = Dispatcher;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;