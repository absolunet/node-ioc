//--------------------------------------------------------
//-- Node IoC - Database - Model - Model Proxy
//--------------------------------------------------------

import ForwardProxy from '../../support/proxies/ForwardProxy';


/**
 * Model proxy handler that forwards calls to an ORM model factory.
 *
 * @memberof database
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class ModelProxy extends ForwardProxy {

	/**
	 * @inheritdoc
	 */
	get(factory, property) {
		return super.get(factory(), property);
	}

	/**
	 * Trap for instantiation with the "new" keyword.
	 *
	 * @param {Function} factory - The model factory.
	 * @param {Array<*>} parameters - The parameters to send to the constructor.
	 * @returns {*} - The newly instantiated model.
	 */
	construct(factory, parameters) {
		const Model = factory().getForward();

		return new Model(...parameters);
	}

}


export default ModelProxy;
