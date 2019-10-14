//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Expects
//--------------------------------------------------------
'use strict';

const factory = require('../../../support/mixins/concerns/mixinFactory');


/**
 * Expects mixin.
 *
 * @class
 * @name Expects
 * @memberof test.mixins.core
 * @hideconstructor
 */
const expects = factory((SuperClass) => {

	/**
	 * Expects mixin.
	 */
	return class ExpectsMixin extends SuperClass {

		/**
		 * Make expect assertion.
		 *
		 * @param {...*} parameters - Call parameters.
		 * @returns {Matchers} - Test engine expect matcher instance.
		 * @memberof test.mixins.core.Expects
		 * @instance
		 */
		expect(...parameters) {
			return this.engine.expect(...parameters);
		}

	};
});


module.exports = expects;
