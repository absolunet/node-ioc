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
 * Connector proxy handler that forwards calls to the underlying driver.
 *
 * @memberof database.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class ConnectorProxy extends _ForwardProxy.default {}

var _default = ConnectorProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;