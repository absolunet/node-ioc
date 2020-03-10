"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ForwardProxy = _interopRequireDefault(require("../../proxies/ForwardProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Helpers - String Helper proxy
//--------------------------------------------------------

/**
 * Proxy handler that forwards calls to the to-case module.
 *
 * @memberof support.helpers
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class StringHelperProxy extends _ForwardProxy.default {}

var _default = StringHelperProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;