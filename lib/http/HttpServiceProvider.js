//--------------------------------------------------------
//-- Node IoC - HTTP - HTTP Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const HttpClient = require('./services/Client');
const HttpServer = require('./services/Server');
const Handler    = require('./services/Handler');
const Router     = require('./services/Router');

const RouteRepository      = require('./repositories/RouteRepository');
const ControllerRepository = require('./repositories/ControllerRepository');

const RedirectController = require('./controllers/RedirectController');
const StaticController   = require('./controllers/StaticController');

const ServeCommand = require('./commands/ServeCommand');


class HttpServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.registerServices();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.bootDefaultControllers();
		this.loadCommands([
			ServeCommand
		]);
	}

	/**
	 * Register HTTP services.
	 */
	registerServices() {
		this.app.singleton('http',              HttpClient);
		this.app.singleton('server',            HttpServer);
		this.app.singleton('router',            Router);
		this.app.singleton('router.handler',    Handler);
		this.app.singleton('router.route',      RouteRepository);
		this.app.singleton('router.controller', ControllerRepository);
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
