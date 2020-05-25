"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _NotImplementedError = _interopRequireDefault(require("../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Security - Policy
//--------------------------------------------------------

/**
 * Abstract policy class.
 *
 * @memberof ioc.security
 * @hideconstructor
 */
class Policy {
  /**
   * Policy name.
   *
   * @type {string}
   */
  get name() {
    throw new _NotImplementedError.default(this, 'name', 'string', 'accessor');
  }
  /**
   * Test if the policy passes.
   *
   * @param {...*} parameters - The given parameters.
   * @returns {boolean} Indicates that the policy passed.
   * @abstract
   */


  passes(...parameters) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'passes', 'boolean');
  }
  /**
   * Test if the policy fails.
   *
   * @see ioc.security.Policy#passes
   * @param {...*} parameters - The given parameters.
   * @returns {boolean} Indicates that the policy failed.
   */


  fails(...parameters) {
    return !this.passes(...parameters);
  }

}

var _default = Policy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;