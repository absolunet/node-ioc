"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Enum = _interopRequireDefault(require("../../support/Enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Enums - Type
//--------------------------------------------------------

/**
 * Test type enum.
 *
 * @memberof test.enums
 * @augments support.Enum
 * @hideconstructor
 */
class Type extends _Enum.default {
  /**
   * Unit tests.
   *
   * @type {string}
   */
  get UNIT() {
    return 'unit';
  }
  /**
   * Feature tests.
   *
   * @type {string}
   */


  get FEATURE() {
    return 'feature';
  }
  /**
   * End to end tests.
   *
   * @type {string}
   */


  get ENDTOEND() {
    return 'endtoend';
  }
  /**
   * Integration tests.
   *
   * @type {string}
   */


  get INTEGRATION() {
    return 'integration';
  }

}

var _default = Type;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;