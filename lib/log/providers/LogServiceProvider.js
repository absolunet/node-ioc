//--------------------------------------------------------
//-- Node IoC - Log - Log Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider        = require('../../foundation/ServiceProvider');
const ConsoleServiceProvider = require('./ConsoleServiceProvider');
const Level                  = require('../enums/Level');
const Logger                 = require('../services/Logger');


class LogServiceProvider extends ServiceProvider {

	/**
	 * {@inheritdoc}
	 */
	register() {
		this.app.singleton('log.level', Level);
		this.app.singleton('log',       Logger);

		this.app.register(ConsoleServiceProvider);
	}

	/**
	 * {@inheritdoc}
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


module.exports = LogServiceProvider;
