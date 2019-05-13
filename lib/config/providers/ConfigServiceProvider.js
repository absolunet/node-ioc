//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const ConfigRepository = require('./../repositories/ConfigRepository');
const ConfigGrammar    = require('./../services/ConfigGrammar');
const ServiceProvider  = require('./../../foundation/ServiceProvider');


class ConfigServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.registerServices();
		this.registerConfiguredProviders();
	}

	/**
	 * Register configuration services.
	 */
	registerServices() {
		this.app.singleton('config.grammar', ConfigGrammar);
		this.app.singleton('config',         ConfigRepository);
	}

	/**
	 * Register service providers from configuration file.
	 */
	registerConfiguredProviders() {
		const config  = this.app.make('config');
		const grammar = this.app.make('config.grammar');

		config.get('app.providers', []).forEach((provider) => {
			this.app.register(grammar.formatPath(provider));
		});
	}

}


module.exports = ConfigServiceProvider;
