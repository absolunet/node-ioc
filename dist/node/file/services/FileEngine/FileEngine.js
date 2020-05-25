"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _FileEngineProxy = _interopRequireDefault(require("./FileEngineProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - File - Engine
//--------------------------------------------------------

/**
 * File engine that allows simple operation inside the native Node.js file system.
 *
 * Any calls that are not listed are forwarded to the sync file system.
 *
 * @memberof file.services
 * @hideconstructor
 */
class FileEngine {
  /**
   * Class dependencies: <code>['app', 'file.system.async', 'file.system.sync']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'file.system.async', 'file.system.sync'];
  }
  /**
   * FileEngine constructor.
   *
   * @returns {file.services.FileEngine} The file engine instance wrapped by a proxy.
   */


  constructor() {
    return new Proxy(this, new _FileEngineProxy.default());
  }
  /**
   * Async file system.
   *
   * @type {file.system.Async}
   */


  get async() {
    return this.fileSystemAsync;
  }
  /**
   * Sync file system.
   *
   * @type {file.system.Sync}
   */


  get sync() {
    return this.fileSystemSync;
  }
  /**
   * Get the sync file system for forward calls.
   *
   * @returns {file.systems.Sync} The sync file system.
   */


  getForward() {
    return this.sync;
  }

}

var _default = FileEngine;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;