"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - View - Services - Drivers - Driver
//--------------------------------------------------------

/**
 * Null view engine driver.
 * It always renders empty templates and never throws.
 *
 * @memberof view.services.Engine.drivers
 * @hideconstructor
 */
class NullDriver extends _Driver.default {
  /**
   * @inheritdoc
   */
  make() {
    return null;
  }
  /**
   * @inheritdoc
   */


  render() {
    return '';
  }

}

var _default = NullDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;