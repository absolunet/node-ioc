//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Expects
//--------------------------------------------------------
'use strict';

const factory = require('../../../support/mixins/concerns/mixinFactory');


module.exports = factory((SuperClass) => {
	return class Expect extends SuperClass {

		/**
		 * Make expect assertion.
		 *
		 * @param {*[]} parameters
		 * @returns {Matchers}
		 * @throws
		 */
		expect(...parameters) {
			const name = 'expect';

			if (global[name]) {
				return global[name](...parameters);
			}

			throw new TypeError(`There is no global property or method "${name}"`);
		}

	};
});
