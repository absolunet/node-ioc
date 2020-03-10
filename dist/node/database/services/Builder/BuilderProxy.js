"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ForwardProxy = _interopRequireDefault(require("../../../support/proxies/ForwardProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector Proxy
//--------------------------------------------------------

/**
 * The connection builder handler forward proxy.
 *
 * @memberof database.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class BuilderProxy extends _ForwardProxy.default {}

var _default = BuilderProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;