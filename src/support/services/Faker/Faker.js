//--------------------------------------------------------
//-- Node IoC - Support - Services - Faker
//--------------------------------------------------------

import FakerProxy from './FakerProxy';


/**
 * Faker class that decorates the faker module.
 *
 * @memberof support.services
 * @hideconstructor
 */
class Faker {

	/**
	 * Faker constructor.
	 *
	 * @returns {support.services.Faker} The faker instance wrapped by a proxy.
	 */
	constructor() {
		return new Proxy(this, new FakerProxy());
	}

	/**
	 * Get faker package for forward calls.
	 *
	 * @returns {Faker} The faker package.
	 */
	getForward() {
		return require('faker'); // eslint-disable-line global-require
	}

}


export default Faker;
