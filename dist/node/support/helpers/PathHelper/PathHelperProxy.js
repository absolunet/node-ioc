"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ForwardProxy = _interopRequireDefault(require("../../proxies/ForwardProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Path Helper proxy
//--------------------------------------------------------

/**
 * Proxy handler that forwards calls to the path module.
 *
 * @memberof support.helpers
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class PathHelperProxy extends _ForwardProxy.default {}

var _default = PathHelperProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;