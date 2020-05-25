"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Enum = _interopRequireDefault(require("../../support/Enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Log - Enums - Level
//--------------------------------------------------------

/**
 * Log levels.
 *
 * @memberof log.enums
 * @augments support.Enum
 * @hideconstructor
 */
class Level extends _Enum.default {
  /**
   * Emergency level.
   *
   * @type {number}
   */
  get EMERGENCY() {
    return 7;
  }
  /**
   * Alert level.
   *
   * @type {number}
   */


  get ALERT() {
    return 6;
  }
  /**
   * Critical level.
   *
   * @type {number}
   */


  get CRITICAL() {
    return 5;
  }
  /**
   * Error level.
   *
   * @type {number}
   */


  get ERROR() {
    return 4;
  }
  /**
   * Warning level.
   *
   * @type {number}
   */


  get WARNING() {
    return 3;
  }
  /**
   * Notice level.
   *
   * @type {number}
   */


  get NOTICE() {
    return 2;
  }
  /**
   * Info level.
   *
   * @type {number}
   */


  get INFO() {
    return 1;
  }
  /**
   * Debug level.
   *
   * @type {number}
   */


  get DEBUG() {
    return 0;
  }

}

var _default = Level;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;