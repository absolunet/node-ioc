"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ForwardProxy = _interopRequireDefault(require("../../../support/proxies/ForwardProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - File - Engine Proxy
//--------------------------------------------------------

/**
 * File engine proxy handler that forwards calls to the sync file system.
 *
 * @memberof file.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class FileEngineProxy extends _ForwardProxy.default {}

var _default = FileEngineProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;