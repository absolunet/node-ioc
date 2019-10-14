//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const ConfigRepository      = require('./repositories/ConfigRepository');
const ConfigGrammar         = require('./services/ConfigGrammar');
const EnvironmentRepository = require('./repositories/EnvironmentRepository');
const Evaluator             = require('./services/Evaluator');


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The config service provider.
 * It binds the following services:
 *	<ul>
 *	   <li><a href="config.repositories.ConfigRepository.html">config</a></li>
 *	   <li><a href="config.repositories.EnvironmentRepository.html">env</a></li>
 *	   <li><a href="config.services.ConfigGrammar.html">config.grammar</a></li>
 *	   <li><a href="config.services.Evaluator.html">evaluator</a></li>
 * </ul>
 * Also, during register phase, it reads the "app.providers" configuration to register all listed service providers into the application.
 *
 * @memberof config
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
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
