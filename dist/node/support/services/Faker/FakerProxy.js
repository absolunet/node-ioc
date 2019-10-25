"use strict";

exports.default = void 0;

var _ForwardProxy = _interopRequireDefault(require("../../proxies/ForwardProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Services - Faker proxy
//--------------------------------------------------------

/**
 * The faker proxy handler that forwards calls to the Faker instance.
 *
 * @memberof support.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class FakerProxy extends _ForwardProxy.default {}

var _default = FakerProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;