//--------------------------------------------------------
//-- Node IoC - Cache - Cache Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const CacheManager = require('./services/CacheManager');

const CacheClearCommand = require('./commands/CacheClearCommand');

const CacheForgetCommand = require('./commands/CacheForgetCommand');

const CacheTableCommand = require('./commands/CacheTableCommand'); // eslint-disable-next-line jsdoc/require-description-complete-sentence

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


class CacheServiceProvider extends ServiceProvider {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('cache', CacheManager);
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.loadConfig();
    this.loadCommands([CacheClearCommand, CacheForgetCommand, CacheTableCommand]);
  }
  /**
   * Load configuration file.
   */


  loadConfig() {
    this.app.make('config').loadConfigFromFolder(this.app.formatPath(__dirname, '..', 'config'));
  }

}

module.exports = CacheServiceProvider;