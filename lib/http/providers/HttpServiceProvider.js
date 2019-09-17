//--------------------------------------------------------
//-- Node IoC - HTTP - HTTP Service Provider
//--------------------------------------------------------
'use strict';

const ConsoleServiceProvider = require('./ConsoleServiceProvider');

const HttpClient         = require('../services/Client');
const HttpServer         = require('../services/Server');
const RedirectController = require('../controllers/RedirectController');
const StaticController   = require('../controllers/StaticController');
const ServiceProvider    = require('../../foundation/ServiceProvider');


class HttpServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.registerServices();
		this.app.register(ConsoleServiceProvider);
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.bootDefaultControllers();
	}

	/**
	 * Register HTTP services.
	 */
	registerServices() {
		this.app.singleton('http',   HttpClient);
		this.app.singleton('server', HttpServer);
	}

	/**
	 * Boot the default controllers.
	 */
	bootDefaultControllers() {
		const controllerRepository = this.app.make('router.controller');
		controllerRepository.group(controllerRepository.coreNamespace, () => {
			controllerRepository.add('StaticController', StaticController);
			controllerRepository.add('RedirectController', RedirectController);
		});
	}

}


module.exports = HttpServiceProvider;
