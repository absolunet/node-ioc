"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _CacheManager = _interopRequireDefault(require("./services/CacheManager"));

var _CacheClearCommand = _interopRequireDefault(require("./commands/CacheClearCommand"));

var _CacheForgetCommand = _interopRequireDefault(require("./commands/CacheForgetCommand"));

var _CacheTableCommand = _interopRequireDefault(require("./commands/CacheTableCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Cache - Cache Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The cache service provider.
 * It offers these commands:
 * <ul>
 *     <li><a href="cache.commands.CacheClearCommand.html">cache:clear</a></li>
 *     <li><a href="cache.commands.CacheForgetCommand.html">cache:forget</a></li>
 *     <li><a href="cache.commands.CacheTableCommand.html">cache:table</a></li>
 * </ul>
 * It also uses configuration under "cache" namespace.
 *
 * @memberof cache
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class CacheServiceProvider extends _ServiceProvider.default {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('cache', _CacheManager.default);
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.loadConfig();
    this.loadCommands([_CacheClearCommand.default, _CacheForgetCommand.default, _CacheTableCommand.default]);
  }
  /**
   * Load configuration file.
   */


  loadConfig() {
    this.app.make('config').loadConfigFromFolder(this.app.formatPath(__dirname, '..', 'config'));
  }

}

var _default = CacheServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;