//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Asserts
//--------------------------------------------------------

import factory from '../../../support/mixins/concerns/mixinFactory';


/**
 * Asserts mixin.
 *
 * @class
 * @name Asserts
 * @memberof test.mixins.core
 * @hideconstructor
 */
const asserts = factory((SuperClass) => {

	/**
	 * Asserts mixin.
	 */
	return class AssertsMixin extends SuperClass {

		/**
		 * Make assertion.
		 *
		 * @returns {Assert|null} The assert object.
		 * @memberof test.mixins.core.Asserts
		 * @instance
		 */
		assert() {
			return this.engine.assert;
		}

	};
});


export default asserts;
