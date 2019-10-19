"use strict";

exports.default = void 0;

var _FakerProxy = _interopRequireDefault(require("./FakerProxy"));

var _forwardCalls = _interopRequireDefault(require("../../mixins/forwardCalls"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Services - Faker
//--------------------------------------------------------

/**
 * Faker class that decorates the faker module.
 *
 * @memberof support.services
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */
class Faker extends (0, _forwardCalls.default)() {
  /**
   * Faker constructor.
   *
   * @param {...*} parameters - The injected parameters.
   * @returns {support.services.Faker} Thee faker instance wrapped by a proxy.
   */
  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new _FakerProxy.default());
  }
  /**
   * @inheritdoc
   */


  getForward() {
    return require('faker'); // eslint-disable-line global-require
  }

}

var _default = Faker;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;