//--------------------------------------------------------
//-- IoC - Support - Mixins - Has driver
//--------------------------------------------------------
'use strict';

const factory             = require('./concerns/mixinFactory');
const NotImplementedError = require('../../foundation/exceptions/NotImplementedError');


const forwardCalls = factory((SuperClass) => {
	return class ForwardCallsMixin extends SuperClass {

		/**
		 * Forward call to given object.
		 *
		 * @param {string} method
		 * @param {Array<*>} [parameters=[]]
		 * @returns {*}
		 */
		forwardCall(method, parameters = []) {
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
			throw new NotImplementedError(this, 'getForward', 'object');
		}

	};
});


module.exports = forwardCalls;
