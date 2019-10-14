//--------------------------------------------------------
//-- Node IoC - Validation - Validation Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const Validator = require('./services/Validator');


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The validation service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="validation.services.Validator.html">validator</a></li>
 * </ul>
 *
 * @memberof validation
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class ValidationServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('validator', Validator);
	}

}


module.exports = ValidationServiceProvider;
