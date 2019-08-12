//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Asserts
//--------------------------------------------------------
'use strict';

const factory = require('../../../support/mixins/concerns/mixinFactory');


module.exports = factory((SuperClass) => {
	return class Asserts extends SuperClass {

		/**
		 * Make assertion.
		 *
		 * @returns {Assert|AssertAssertion|*}
		 * @throws
		 */
		assert() {
			const name = 'assert';

			if (global[name]) {
				return global[name];
			}

			if (this.engine && this.engine[name]) {
				return this.engine[name];
			}

			throw new TypeError(`There is no global property or method "${name}"`);
		}

	};
});
