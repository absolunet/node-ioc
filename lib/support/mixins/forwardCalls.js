//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Has driver
//--------------------------------------------------------
'use strict';

const factory = require('./concerns/mixinFactory');


module.exports = factory((SuperClass) => {
	return class ForwardCalls extends SuperClass {

		/**
		 * Forward call to given object.
		 *
		 * @param {string} method
		 * @param {Array<*>}parameters
		 * @returns {*}
		 */
		forwardCall(method, parameters) {
			const forward = this.getForward();

			return forward[method](...parameters);
		}

		/**
		 * Get object which should receive the call forwarding.
		 *
		 * @returns {object}
		 * @abstract
		 */
		getForward() {
			throw new TypeError('Method getForward() must be implemented. It should return an object.');
		}

	};
});
