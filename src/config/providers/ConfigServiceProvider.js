//--------------------------------------------------------
//-- Spark IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('./../../foundation/ServiceProvider');
const Loader = require('./../services/Loader');
const Grammar = require('./../services/Grammar');
const ConfigRepository = require('./../repositories/ConfigRepository');

class ConfigServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('config.loader', Loader);
		this.app.singleton('config.grammar', Grammar);
		this.app.singleton('config', ConfigRepository);

		const grammar = this.app.make('config.grammar');
		this.app.make('config').get('app.providers', []).forEach((provider) => {
			this.app.register(grammar.formatPath(provider));
		});
	}

}

module.exports = ConfigServiceProvider;
