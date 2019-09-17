//--------------------------------------------------------
//-- Node IoC - Validation - Validation Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const Validator = require('./services/Validator');


class ValidationServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('validator', Validator);
	}

}


module.exports = ValidationServiceProvider;
