"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ForwardProxy = _interopRequireDefault(require("../../../support/proxies/ForwardProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Cache - Repositories - Cache repository proxy
//--------------------------------------------------------

/**
 * The Cache manager proxy handler.
 *
 * @memberof cache.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class CacheManagerProxy extends _ForwardProxy.default {}

var _default = CacheManagerProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;