//--------------------------------------------------------
//-- Node IoC - Support - Services - Faker
//--------------------------------------------------------

import FakerProxy   from './FakerProxy';
import forwardsCalls from '../../mixins/forwardsCalls';


/**
 * Faker class that decorates the faker module.
 *
 * @memberof support.services
 * @augments support.mixins.ForwardsCalls
 * @hideconstructor
 */
class Faker extends forwardsCalls() {

	/**
	 * Faker constructor.
	 *
	 * @param {...*} parameters - The injected parameters.
	 * @returns {support.services.Faker} Thee faker instance wrapped by a proxy.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new FakerProxy());
	}

	/**
	 * @inheritdoc
	 */
	getForward() {
		return require('faker'); // eslint-disable-line global-require
	}

}


export default Faker;
