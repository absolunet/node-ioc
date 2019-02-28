//--------------------------------------------------------
//-- Spark IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('./../../foundation/ServiceProvider');
const ConfigLoader = require('./../services/ConfigLoader');
const ConfigRepository = require('./../repositories/ConfigRepository');

class ConfigServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.bind('config.loader', ConfigLoader);
		this.app.singleton('config', ConfigRepository);

		this.app.make('config').get('app.providers', []).forEach((provider) => {
			this.app.register(provider);
		});
	}

}

module.exports = ConfigServiceProvider;
