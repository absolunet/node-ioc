//--------------------------------------------------------
//-- Node IoC - HTTP - HTTP Service Provider
//--------------------------------------------------------
'use strict';

const HttpClient      = require('./../services/Client/Client');
const ServiceProvider = require('./../../foundation/ServiceProvider');


class HttpServiceProvider extends ServiceProvider {

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
		this.app.singleton('http', HttpClient);
	}

}


module.exports = HttpServiceProvider;
