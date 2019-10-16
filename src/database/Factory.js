//--------------------------------------------------------
//-- Node IoC - Database - Factory
//--------------------------------------------------------

import NotImplementedError from '../foundation/exceptions/NotImplementedError';


/**
 * Model factory base class.
 *
 * @memberof database
 * @abstract
 * @hideconstructor
 */
class Factory {

	/**
	 * Name of the associated model.
	 *
	 * @type {string}
	 * @abstract
	 */
	get model() {
		throw new NotImplementedError(this, 'model', 'string', 'accessor');
	}

	/**
	 * Factory model attributes.
	 *
	 * @param {faker} faker - A Faker instance.
	 * @returns {object} - The factoried model data.
	 * @abstract
	 */
	make(faker) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'make', 'attributes object');
	}

}


export default Factory;
