//--------------------------------------------------------
//-- Node IoC - Security - Policy
//--------------------------------------------------------

import NotImplementedError from '../foundation/exceptions/NotImplementedError';


/**
 * Abstract policy class.
 *
 * @memberof ioc.security
 * @hideconstructor
 */
class Policy {

	/**
	 * Policy name.
	 *
	 * @type {string}
	 */
	get name() {
		throw new NotImplementedError(this, 'name', 'string', 'accessor');
	}

	/**
	 * Test if the policy passes.
	 *
	 * @param {...*} parameters - The given parameters.
	 * @returns {boolean} Indicates that the policy passed.
	 * @abstract
	 */
	passes(...parameters) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'passes', 'boolean');
	}

	/**
	 * Test if the policy fails.
	 *
	 * @see ioc.security.Policy#passes
	 * @param {...*} parameters - The given parameters.
	 * @returns {boolean} Indicates that the policy failed.
	 */
	fails(...parameters) {
		return !this.passes(...parameters);
	}

}


export default Policy;
