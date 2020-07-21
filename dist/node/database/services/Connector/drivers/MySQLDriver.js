"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Connector - MySQL Driver
//--------------------------------------------------------

/**
 * MySQL connector driver.
 *
 * @memberof database.services.Connector.drivers
 * @augments database.services.Connector.drivers.Driver
 * @hideconstructor
 */
class MySQLDriver extends _Driver.default {
  /**
   * @inheritdoc
   */
  get client() {
    return 'mysql';
  }

}

var _default = MySQLDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;