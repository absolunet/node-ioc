"use strict";

exports.default = void 0;

var _StringHelperProxy = _interopRequireDefault(require("./StringHelperProxy"));

var _forwardCalls = _interopRequireDefault(require("../../mixins/forwardCalls"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Helpers - String
//--------------------------------------------------------

/**
 * String helper.
 *
 * @memberof support.helpers
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */
class StringHelper extends (0, _forwardCalls.default)() {
  /**
   * StringHelper constructor.
   *
   * @param {...*} parameters - The injected parameters.
   */
  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new _StringHelperProxy.default());
  }
  /**
   * Convert to plural version of the string.
   *
   * @param {string} [string] - The word to pluralize.
   * @param {number} [quantity] - How many of the word exist.
   * @returns {string} - The pluralized word.
   */


  plural(string, quantity = 2) {
    return require('pluralize')(string, quantity); // eslint-disable-line global-require
  }
  /**
   * Convert to singular version of the string.
   *
   * @param {string} string - The word to singularize.
   * @returns {string} - The singularized word.
   */


  singular(string) {
    return this.plural(string, 1);
  }
  /**
   * @inheritdoc
   */


  getForward() {
    return require('to-case'); // eslint-disable-line global-require
  }

}

var _default = StringHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;