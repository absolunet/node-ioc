//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Expectations - Bindings
//--------------------------------------------------------
'use strict';

const factory = require('../../../support/mixins/concerns/mixinFactory');


const bindings = factory((SuperClass) => {
	return class BindingsMixin extends SuperClass {

		/**
		 * Assert that the abstract is bound to the container.
		 *
		 * @param {*} binding
		 * @param {boolean} [bound]
		 * @returns {*}
		 */
		expectBound(binding, bound = true) {
			return this.expect(this.app.isBound(binding)).toBe(bound);
		}

		/**
		 * Assert that the abstract is not bound to the container.
		 *
		 * @param {*} binding
		 * @returns {*}
		 */
		expectNotBound(binding) {
			return this.expectBound(binding, false);
		}

	};
});


module.exports = bindings;
