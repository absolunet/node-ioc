//--------------------------------------------------------
//-- Node IoC - Test - Service - Test runner
//--------------------------------------------------------
'use strict';

const hasEngine = require('../../support/mixins/hasEngine');


class TestRunner extends hasEngine() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
	}

	/**
	 * Run a list of tests.
	 *
	 * @param {Array<{instane: TestCase, name: string, namespace: string, tests: Array<{method: string, description: string}>}>} testList
	 */
	run(testList = []) {
		testList.forEach(this.runTest.bind(this));
	}

	/**
	 * Run every tests of a single test case instance.
	 *
	 * @param {{instance: TestCase, name: string, namespace: string, tests: Array<{method: string, description: string}>}} test
	 */
	runTest({ instance, name, namespace, tests }) {
		if (typeof this.engine === 'undefined') {
			throw new TypeError('Test engine is not defined');
		}


		instance
			.setApp(this.app)
			.setEngine(this.engine);

		this.describe(namespace, () => {
			this.describe(name, () => {
				this.beforeAll((...parameters) => { return instance.beforeAll(...parameters); });
				this.beforeEach((...parameters) => { return instance.beforeEach(...parameters); });
				tests.forEach(({ method, description }) => {
					this.test(description, (...parameters) => { return instance[method](...parameters); });
				});
				this.afterEach((...parameters) => { return instance.afterEach(...parameters); });
				this.afterAll((...parameters) => { return instance.afterAll(...parameters); });
			});
		});
	}

	/**
	 * Describe the inner tests.
	 *
	 * @param {Array<*>} parameters
	 */
	describe(...parameters) {
		return this.engine.describe(...parameters);
	}

	/**
	 * Setup before the first inner test.
	 *
	 * @param {...Array<*>} parameters
	 */
	beforeAll(...parameters) {
		return this.engine.beforeAll(...parameters);
	}

	/**
	 * Setup before any inner test.
	 * @param {...Array<*>} parameters
	 */
	beforeEach(...parameters) {
		return this.engine.beforeEach(...parameters);
	}

	/**
	 * Tear down after the last inner test.
	 *
	 * @param {...Array<*>} parameters
	 */
	afterAll(...parameters) {
		return this.engine.afterAll(...parameters);
	}

	/**
	 * Tear down after any inner test.
	 *
	 * @param {...Array<*>} parameters
	 */
	afterEach(...parameters) {
		return this.engine.afterEach(...parameters);
	}

	/**
	 * Test a given case.
	 *
	 * @param {...Array<*>} parameters
	 * @returns {*}
	 */
	test(...parameters) {
		return this.engine.test(...parameters);
	}

}

module.exports = TestRunner;
