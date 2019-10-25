"use strict";

exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------

/**
 * Null driver to be used when testing or if fake load/write process is needed.
 * Always load null value and successfully write given files.
 *
 * @memberof file.services.FileManager.drivers
 * @augments file.services.FileManager.drivers.Driver
 * @hideconstructor
 */
class NullDriver extends _Driver.default {
  /**
   * @inheritdoc
   */
  load() {
    return null;
  }
  /**
   * @inheritdoc
   */


  loadAsync() {
    return Promise.resolve(null);
  }
  /**
   * @inheritdoc
   */


  write() {
    return true;
  }
  /**
   * @inheritdoc
   */


  writeAsync() {
    return Promise.resolve(true);
  }

}

var _default = NullDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;