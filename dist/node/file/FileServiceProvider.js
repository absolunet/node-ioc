"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _FileEngine = _interopRequireDefault(require("./services/FileEngine"));

var _FileManager = _interopRequireDefault(require("./services/FileManager"));

var _Async = _interopRequireDefault(require("./systems/Async"));

var _Sync = _interopRequireDefault(require("./systems/Sync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The file service provider.
 * It bind these following services:
 * <ul>
 *     <li><a href="file.services.FileManager.html">file</a></li>
 *     <li><a href="file.services.FileEngine.html">file.engine</a></li>
 *     <li><a href="file.systems.Async.html">file.system.async</a></li>
 *     <li><a href="file.systems.Sync.html">file.system.sync</a></li>
 * </ul>
 *
 * @memberof file
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class FileServiceProvider extends _ServiceProvider.default {
  /**
   * Register the service provider.
   */
  register() {
    this.bindFileManager();
    this.bindFileEngine();
    this.bindAsyncFileSystem();
    this.bindSyncFileSystem();
  }
  /**
   * Bind file manager service.
   */


  bindFileManager() {
    this.app.singleton('file', _FileManager.default);
  }
  /**
   * Bind file engine service.
   */


  bindFileEngine() {
    this.app.singleton('file.engine', _FileEngine.default);
  }
  /**
   * Bind async file system.
   */


  bindAsyncFileSystem() {
    this.app.singleton('file.system.async', _Async.default);
  }
  /**
   * Bind sync file system.
   */


  bindSyncFileSystem() {
    this.app.singleton('file.system.sync', _Sync.default);
  }

}

var _default = FileServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;