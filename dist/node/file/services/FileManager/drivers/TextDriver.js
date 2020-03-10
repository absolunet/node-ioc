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
 * Plain text driver that does not parse or write in any particular way.
 *
 * @memberof file.services.FileManager.drivers
 * @augments file.services.FileManager.drivers.Driver
 * @hideconstructor
 */
class TextDriver extends _Driver.default {
  /**
   * @inheritdoc
   */
  load(file) {
    return this.fileEngine.sync.readFile(file, 'utf8');
  }
  /**
   * @inheritdoc
   */


  loadAsync(file) {
    return this.fileEngine.async.readFile(file, 'utf8');
  }

}

var _default = TextDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;