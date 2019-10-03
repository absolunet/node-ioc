//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Expects
//--------------------------------------------------------
'use strict';

const factory = require('../../../support/mixins/concerns/mixinFactory');


const expects = factory((SuperClass) => {
	return class ExpectsMixin extends SuperClass {

		/**
		 * Make expect assertion.
		 *
		 * @param {...Array<*>} parameters
		 * @returns {Matchers}
		 */
		expect(...parameters) {
			return this.engine.expect(...parameters);
		}

	};
});


module.exports = expects;
