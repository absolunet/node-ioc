//--------------------------------------------------------
//-- Node IoC - Validation - Services - Validator
//--------------------------------------------------------
'use strict';


class Validator {

	/**
	 * Validator constructor.
	 */
	constructor() {
		return require('@hapi/joi'); // eslint-disable-line global-require
	}

}


module.exports = Validator;
