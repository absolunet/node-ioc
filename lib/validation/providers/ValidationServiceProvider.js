//--------------------------------------------------------
//-- Node IoC - Validation - Validation Service Provider
//--------------------------------------------------------
'use strict';

const Validator       = require('./../services/Validator');
const ServiceProvider = require('./../../foundation/ServiceProvider');


class ValidationServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('validator', Validator);
	}

}


module.exports = ValidationServiceProvider;
