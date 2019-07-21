//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const ConfigRepository      = require('../repositories/ConfigRepository');
const ConfigGrammar         = require('../services/ConfigGrammar');
const EnvironmentRepository = require('../repositories/EnvironmentRepository');
const Evaluator             = require('../services/Evaluator');
const ServiceProvider       = require('../../foundation/ServiceProvider');


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
		this.app.singleton('env',            EnvironmentRepository);
		this.app.singleton('evaluator',      Evaluator);
	}

	/**
	 * Register service providers from configuration file.
	 */
	registerConfiguredProviders() {
		this.app.make('config').get('app.providers', [])
			.forEach((provider) => {
				this.app.register(provider);
			});
	}

}


module.exports = ConfigServiceProvider;
