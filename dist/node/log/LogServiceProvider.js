//--------------------------------------------------------
//-- Node IoC - Log - Log Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const Level = require('./enums/Level');

const Logger = require('./services/Logger');

const LogTableCommand = require('./commands/LogTableCommand'); // eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The log service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="log.services.Logger.html">log</a></li>
 *     <li><a href="log.enums.Level.html">log.level</a></li>
 * </ul>
 * It also offers these commands:
 * <ul>
 *     <li><a href="log.commands.LogTableCommand.html">log:table</a></li>
 * </ul>
 * It also uses configuration under "logging" namespace.
 *
 * @memberof log
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */


class LogServiceProvider extends ServiceProvider {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('log', Logger);
    this.app.singleton('log.level', Level);
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.loadConfig();
    this.loadCommands([LogTableCommand]);
  }
  /**
   * Load configuration file.
   */


  loadConfig() {
    if (this.app.isBound('config')) {
      this.app.make('config').loadConfigFromFolder(this.app.formatPath(__dirname, '..', 'config'));
    }
  }

}

module.exports = LogServiceProvider;