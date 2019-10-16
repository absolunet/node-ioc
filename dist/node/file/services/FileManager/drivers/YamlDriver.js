"use strict";

exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------

/**
 * YAML driver that allow .yml/.yaml file interpretation load. Allow to write into .yml/yaml file from a JSON serialisable instance.
 *
 * @memberof file.services.FileManager.drivers
 * @augments file.services.FileManager.drivers.Driver
 * @hideconstructor
 */
class YamlDriver extends _Driver.default {
  /**
   * @inheritdoc
   */
  load(file) {
    return this.fileEngine.sync.readYaml(file);
  }
  /**
   * @inheritdoc
   */


  loadAsync(file) {
    return this.fileEngine.async.readYaml(file);
  }
  /**
   * @inheritdoc
   */


  write(file, content) {
    return this.fileEngine.sync.writeYaml(file, content);
  }
  /**
   * @inheritdoc
   */


  writeAsync(file, content) {
    return this.fileEngine.async.writeYaml(file, content);
  }

}

var _default = YamlDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;