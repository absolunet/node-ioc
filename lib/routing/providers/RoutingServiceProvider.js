//--------------------------------------------------------
//-- Node IoC - HTTP - HTTP Service Provider
//--------------------------------------------------------
'use strict';

const Handler              = require('./../services/Handler');
const Router               = require('./../services/Router');
const RouteRepository      = require('./../repositories/RouteRepository');
const ControllerRepository = require('./../repositories/ControllerRepository');
const ServiceProvider      = require('./../../foundation/ServiceProvider');


class RoutingServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.registerServices();
	}

	/**
	 * Register HTTP services.
	 */
	registerServices() {
		this.app.singleton('router',            Router);
		this.app.singleton('router.handler',    Handler);
		this.app.singleton('router.route',      RouteRepository);
		this.app.singleton('router.controller', ControllerRepository);
	}

}


module.exports = RoutingServiceProvider;
