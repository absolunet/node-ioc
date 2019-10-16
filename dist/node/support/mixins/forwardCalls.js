"use strict";

exports.default = void 0;

var _mixinFactory = _interopRequireDefault(require("./concerns/mixinFactory"));

var _NotImplementedError = _interopRequireDefault(require("../../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- IoC - Support - Mixins - Has driver
//--------------------------------------------------------

/**
 * Forward calls mixin.
 *
 * @class
 * @name ForwardCalls
 * @memberof support.mixins
 * @hideconstructor
 */
const forwardCalls = (0, _mixinFactory.default)(SuperClass => {
  /**
   * Forward calls mixin.
   */
  return class ForwardCallsMixin extends SuperClass {
    /**
     * Forward call to given object.
     *
     * @param {string} method - The method to call.
     * @param {Array<*>} [parameters=[]] - The parameters to send to the forwarded instance method.
     * @returns {*} - The method result.
     * @memberof support.mixins.ForwardCalls
     * @instance
     */
    forwardCall(method, parameters = []) {
      return this.getForward()[method](...parameters);
    }
    /**
     * Get object which should receive the call forwarding.
     *
     * @returns {object} - The forward instance.
     * @abstract
     * @memberof support.mixins.ForwardCalls
     * @instance
     */


    getForward() {
      throw new _NotImplementedError.default(this, 'getForward', 'object');
    }

  };
});
var _default = forwardCalls;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;