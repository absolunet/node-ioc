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
    this.loadConfigFromFolder(__dirname, '..', 'config');
    this.bindCacheManager();
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.loadCommands([_CacheClearCommand.default, _CacheForgetCommand.default, _CacheTableCommand.default]);
  }
  /**
   * Bind cache manager service.
   */


  bindCacheManager() {
    this.app.singleton('cache', _CacheManager.default);
  }

}

var _default = CacheServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;