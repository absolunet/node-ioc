//--------------------------------------------------------
//-- Node IoC - View - View Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const Engine = require('./services/Engine');

const Factory = require('./services/Factory');

const Resolver = require('./services/Resolver'); // eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The view service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="view.services.Factory.html">view</a></li>
 *     <li><a href="view.services.Engine.html">view.engine</a></li>
 *     <li><a href="view.services.Resolver.html">view.factory</a></li>
 * </ul>
 * It also uses configuration under "view" namespace.
 *
 * @memberof view
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */


class ViewServiceProvider extends ServiceProvider {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('view', Factory);
    this.app.singleton('view.engine', Engine);
    this.app.singleton('view.resolver', Resolver);
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.loadConfig();
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

module.exports = ViewServiceProvider;