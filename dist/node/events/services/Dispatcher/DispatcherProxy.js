"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ForwardProxy = _interopRequireDefault(require("../../../support/proxies/ForwardProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Dispatcher Proxy
//--------------------------------------------------------

/**
 * Dispatcher proxy handler that forwards calls to the configured driver.
 *
 * @memberof events.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class DispatcherProxy extends _ForwardProxy.default {}

var _default = DispatcherProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;