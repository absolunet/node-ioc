//--------------------------------------------------------
//-- Node IoC - HTTP - HTTP Service Provider
//--------------------------------------------------------
'use strict';

const ConsoleServiceProvider = require('./ConsoleServiceProvider');
const HttpClient             = require('./../services/Client');
const HttpServer             = require('./../services/Server');
const ServiceProvider        = require('./../../foundation/ServiceProvider');


class HttpServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.register(ConsoleServiceProvider);
		this.registerServices();
	}

	/**
	 * Register HTTP services.
	 */
	registerServices() {
		this.app.singleton('http',   HttpClient);
		this.app.singleton('server', HttpServer);
	}

}


module.exports = HttpServiceProvider;
