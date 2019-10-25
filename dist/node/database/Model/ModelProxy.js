"use strict";

exports.default = void 0;

var _ForwardProxy = _interopRequireDefault(require("../../support/proxies/ForwardProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Model - Model Proxy
//--------------------------------------------------------

/**
 * Model proxy handler that forwards calls to an ORM model factory.
 *
 * @memberof database
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class ModelProxy extends _ForwardProxy.default {
  /**
   * @inheritdoc
   */
  get(factory, property) {
    return super.get(factory(), property);
  }
  /**
   * Trap for instantiation with the "new" keyword.
   *
   * @param {Function} factory - The model factory.
   * @param {Array<*>} parameters - The parameters to send to the constructor.
   * @returns {*} The newly instantiated model.
   */


  construct(factory, parameters) {
    const Model = factory().getForward();
    return new Model(...parameters);
  }

}

var _default = ModelProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;