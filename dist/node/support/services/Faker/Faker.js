"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _FakerProxy = _interopRequireDefault(require("./FakerProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Services - Faker
//--------------------------------------------------------

/**
 * Faker class that decorates the faker module.
 *
 * @memberof support.services
 * @hideconstructor
 */
class Faker {
  /**
   * Faker constructor.
   *
   * @returns {support.services.Faker} The faker instance wrapped by a proxy.
   */
  constructor() {
    return new Proxy(this, new _FakerProxy.default());
  }
  /**
   * Get faker package for forward calls.
   *
   * @returns {Faker} The faker package.
   */


  getForward() {
    return require('faker'); // eslint-disable-line global-require
  }

}

var _default = Faker;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;