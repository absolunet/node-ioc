"use strict";

exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------

/**
 * JavaScript driver that allows .js file interpretation on load. However, it writes in plain text.
 *
 * @memberof file.services.FileManager.drivers
 * @augments file.services.FileManager.drivers.Driver
 * @hideconstructor
 */
class JavaScriptDriver extends _Driver.default {
  /**
   * Class dependencies: <code>['app', 'file.engine']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app']);
  }
  /**
   * @inheritdoc
   */


  load(file) {
    return this.app.getContext().require(file);
  }
  /**
   * @inheritdoc
   */


  loadAsync(file) {
    return Promise.resolve(this.app.getContext().require(file));
  }

}

var _default = JavaScriptDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;