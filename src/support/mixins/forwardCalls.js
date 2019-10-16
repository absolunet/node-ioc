//--------------------------------------------------------
//-- IoC - Support - Mixins - Has driver
//--------------------------------------------------------

import factory             from './concerns/mixinFactory';
import NotImplementedError from '../../foundation/exceptions/NotImplementedError';


/**
 * Forward calls mixin.
 *
 * @class
 * @name ForwardCalls
 * @memberof support.mixins
 * @hideconstructor
 */
const forwardCalls = factory((SuperClass) => {

	/**
	 * Forward calls mixin.
	 */
	return class ForwardCallsMixin extends SuperClass {

		/**
		 * Forward call to given object.
		 *
		 * @param {string} method - The method to call.
		 * @param {Array<*>} [parameters=[]] - The parameters to send to the forwarded instance method.
		 * @returns {*} - The method result.
		 * @memberof support.mixins.ForwardCalls
		 * @instance
		 */
		forwardCall(method, parameters = []) {
			return this.getForward()[method](...parameters);
		}

		/**
		 * Get object which should receive the call forwarding.
		 *
		 * @returns {object} - The forward instance.
		 * @abstract
		 * @memberof support.mixins.ForwardCalls
		 * @instance
		 */
		getForward() {
			throw new NotImplementedError(this, 'getForward', 'object');
		}

	};

});


export default forwardCalls;
