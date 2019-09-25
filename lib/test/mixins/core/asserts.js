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
		 * @returns {Assert|null}
		 */
		assert() {
			return (this.engine || {}).assert || global.assert || null;
		}

	};
});
