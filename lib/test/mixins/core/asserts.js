//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Asserts
//--------------------------------------------------------
'use strict';

const factory = require('../../../support/mixins/concerns/mixinFactory');


const asserts = factory((SuperClass) => {
	return class AssertsMixin extends SuperClass {

		/**
		 * Make assertion.
		 *
		 * @returns {Assert|null}
		 */
		assert() {
			return this.engine.assert;
		}

	};
});


module.exports = asserts;
