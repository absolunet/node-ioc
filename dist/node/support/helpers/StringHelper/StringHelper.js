"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _StringHelperProxy = _interopRequireDefault(require("./StringHelperProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Helpers - String
//--------------------------------------------------------

/**
 * String helper.
 *
 * @memberof support.helpers
 * @hideconstructor
 */
class StringHelper {
  /**
   * StringHelper constructor.
   */
  constructor() {
    return new Proxy(this, new _StringHelperProxy.default());
  }
  /**
   * Convert to plural version of the string.
   *
   * @param {string} [string] - The word to pluralize.
   * @param {number} [quantity] - How many of the word exist.
   * @returns {string} The pluralized word.
   */


  plural(string, quantity = 2) {
    return require('pluralize')(string, quantity); // eslint-disable-line global-require
  }
  /**
   * Convert to singular version of the string.
   *
   * @param {string} string - The word to singularize.
   * @returns {string} The singularized word.
   */


  singular(string) {
    return this.plural(string, 1);
  }
  /**
   * Get to-case package for forward calls.
   *
   * @returns {ToCase} The to-case package.
   */


  getForward() {
    return require('to-case'); // eslint-disable-line global-require
  }

}

var _default = StringHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;