"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ForwardProxy = _interopRequireDefault(require("../../../support/proxies/ForwardProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Async proxy
//--------------------------------------------------------

/**
 * The Async system proxy handler that forward calls to @absolunet/fsp module.
 *
 * @memberof file.systems
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class SyncProxy extends _ForwardProxy.default {}

var _default = SyncProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;