//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const FileEngine = require('./services/FileEngine');

const FileManager = require('./services/FileManager');

const Async = require('./systems/Async');

const Sync = require('./systems/Sync'); // eslint-disable-next-line jsdoc/require-description-complete-sentence

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


class FileServiceProvider extends ServiceProvider {
  /**
   * Register the service provider.
   */
  register() {
    this.registerServices();
  }
  /**
   * Register file services.
   */


  registerServices() {
    this.app.singleton('file', FileManager);
    this.app.singleton('file.engine', FileEngine);
    this.app.singleton('file.system.async', Async);
    this.app.singleton('file.system.sync', Sync);
  }

}

module.exports = FileServiceProvider;