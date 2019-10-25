//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Expectations - Bindings
//--------------------------------------------------------

import factory from '../../../support/mixins/concerns/mixinFactory';


/**
 * Bindings mixin.
 *
 * @class
 * @name Bindings
 * @memberof test.mixins.expectations
 * @hideconstructor
 */
const bindings = factory((SuperClass) => {

	/**
	 * Bindings mixin.
	 */
	return class BindingsMixin extends SuperClass {

		/**
		 * Assert that the abstract is bound to the container.
		 *
		 * @param {string} abstract - The abstract to check.
		 * @param {boolean} [bound] - Expected result.
		 * @memberof test.mixins.expectations.Bindings
		 * @instance
		 */
		expectBound(abstract, bound = true) {
			this.expect(this.app.isBound(abstract)).toBe(bound);
		}

		/**
		 * Assert that the abstract is not bound to the container.
		 *
		 * @param {string} abstract - The abstract to check.
		 * @memberof test.mixins.expectations.Bindings
		 * @instance
		 */
		expectNotBound(abstract) {
			this.expectBound(abstract, false);
		}

	};

});


export default bindings;
