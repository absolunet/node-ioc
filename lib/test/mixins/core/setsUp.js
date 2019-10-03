//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Sets up
//--------------------------------------------------------
'use strict';

const factory = require('../../../support/mixins/concerns/mixinFactory');

/* eslint-disable no-empty-function */
const setsUp = factory((SuperClass) => {
	return class SetsUpMixin extends SuperClass {

		/**
		 * Setup before the first class test.
		 */
		beforeAll() {
		}

		/**
		 * Setup before any class test.
		 */
		beforeEach() {
		}

		/**
		 * Tear down after any class test.
		 */
		afterEach() {
		}

		/**
		 * Tear down after the last class test.
		 */
		afterAll() {
		}

	};
});
/* eslint-enable no-empty-function */

module.exports = setsUp;
