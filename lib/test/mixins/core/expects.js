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
		 */
		expect(...parameters) {
			const callback = (this.engine || {}).expect || global.expect;

			return callback(...parameters);
		}

	};
});
