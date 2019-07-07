//--------------------------------------------------------
//-- Node IoC - HTTP - HTTP Service Provider
//--------------------------------------------------------
'use strict';

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
		this.app.singleton('router',           Router);
		this.app.singleton('route.repository', RouteRepository);
		this.app.singleton('route.controller', ControllerRepository);
	}

}


module.exports = RoutingServiceProvider;
