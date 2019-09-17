//--------------------------------------------------------
//-- Node IoC - Cache - Cache Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const CacheManager = require('./services/CacheManager');

const CacheClearCommand  = require('./commands/CacheClearCommand');
const CacheForgetCommand = require('./commands/CacheForgetCommand');
const CacheTableCommand  = require('./commands/CacheTableCommand');


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
		this.loadCommands([
			CacheClearCommand,
			CacheForgetCommand,
			CacheTableCommand
		]);
	}

	/**
	 * Load configuration file.
	 */
	loadConfig() {
		this.app.make('config').loadConfigFromFolder(this.app.formatPath(__dirname, '..', 'config'));
	}

}


module.exports = CacheServiceProvider;
