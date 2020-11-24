//--------------------------------------------------------
//-- Node IoC - Validation - Services - Validator
//--------------------------------------------------------


/**
 * Validator that decorates Hapi Joi module.
 *
 * @memberof validation.services
 * @hideconstructor
 */
class Validator {

	/**
	 * Validator constructor.
	 *
	 * @returns {joi} Hapi Joi module.
	 */
	constructor() {
		return require('joi'); // eslint-disable-line global-require
	}

}


export default Validator;
