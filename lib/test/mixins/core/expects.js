//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Expects
//--------------------------------------------------------
'use strict';

const factory = require('./../../../support/mixins/concerns/mixinFactory');


module.exports = factory((SuperClass) => {
	return class Expect extends SuperClass {

		/**
		 * Make expect assertion.
		 *
		 * @param {*[]} args
		 * @returns {Matchers}
		 * @throws
		 */
		expect(...args) {
			const name = 'expect';

			if (global[name]) {
				return global[name](...args);
			}

			throw new TypeError(`There is no global property or method "${name}"`);
		}

	};
});
