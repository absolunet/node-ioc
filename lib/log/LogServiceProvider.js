//--------------------------------------------------------
//-- Node IoC - Log - Log Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const Level  = require('./enums/Level');
const Logger = require('./services/Logger');

const LogTableCommand = require('./commands/LogTableCommand');


class LogServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('log.level', Level);
		this.app.singleton('log',       Logger);
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.loadConfig();
		this.loadCommands([
			LogTableCommand
		]);
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
