//--------------------------------------------------------
//-- Node IoC - Events - Event Service Provider
//--------------------------------------------------------
'use strict';

const path            = require('path');
const ServiceProvider = require('../../foundation/ServiceProvider');
const Dispatcher      = require('../services/Dispatcher');


class EventServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('event', Dispatcher);
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
			this.app.make('config').loadConfigFromFolder(path.join(__dirname, '..', 'config'));
		}
	}

}


module.exports = EventServiceProvider;