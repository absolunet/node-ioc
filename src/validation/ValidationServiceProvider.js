//--------------------------------------------------------
//-- Node IoC - Validation - Validation Service Provider
//--------------------------------------------------------

import ServiceProvider from '../foundation/ServiceProvider';
import Validator       from './services/Validator';


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
	 * @inheritdoc
	 */
	get name() {
		return 'Node IoC - Validation';
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.bindValidator();
	}

	/**
	 * Bind validator service.
	 */
	bindValidator() {
		this.app.singleton('validator', Validator);
	}

}


export default ValidationServiceProvider;
