//--------------------------------------------------------
//-- Node IoC - Cache - Cache Service Provider
//--------------------------------------------------------
'use strict';

const CacheManager           = require('../services/CacheManager');
const ConsoleServiceProvider = require('./ConsoleServiceProvider');
const ServiceProvider        = require('../../foundation/ServiceProvider');


class CacheServiceProvider extends ServiceProvider {

	/**
	 * {@inheritdoc}
	 */
	register() {
		this.app.make('config').loadConfigFromFolder(this.app.formatPath(__dirname, '..', 'config'));

		this.app.singleton('cache', CacheManager);
		this.app.register(ConsoleServiceProvider);
	}

}


module.exports = CacheServiceProvider;
