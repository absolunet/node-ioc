"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------

/**
 * JSON driver that allow .json file interpretation load. Allow to write into .json file from a JSON serialisable instance.
 *
 * @memberof file.services.FileManager.drivers
 * @augments file.services.FileManager.drivers.Driver
 * @hideconstructor
 */
class JsonDriver extends _Driver.default {
  /**
   * @inheritdoc
   */
  load(file) {
    return this.fileEngine.sync.readJson(file);
  }
  /**
   * @inheritdoc
   */


  loadAsync(file) {
    return this.fileEngine.async.readJson(file);
  }
  /**
   * @inheritdoc
   */


  write(file, content, options = {}) {
    try {
      this.fileEngine.sync.writeJson(file, content, options);
      return true;
    } catch (error) {
      return false;
    }
  }
  /**
   * @inheritdoc
   */


  async writeAsync(file, content, options = {}) {
    try {
      await this.fileEngine.async.writeJson(file, content, options);
      return true;
    } catch (error) {
      return false;
    }
  }

}

var _default = JsonDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;