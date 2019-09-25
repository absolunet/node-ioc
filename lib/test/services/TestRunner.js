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
		return ['app'];
	}

	/**
	 * Run a list of tests.
	 *
	 * @param {{instane: TestCase, name: string, namespace: string, tests: {method: string, description: string}[]}[]} testList
	 */
	run(testList = []) {
		testList.forEach(this.runTest.bind(this));
	}

	/**
	 * Run every tests of a single test case instance.
	 *
	 * @param {{instane: TestCase, name: string, namespace: string, tests: {method: string, description: string}[]}} test
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
				this.beforeAll(instance.beforeAll.bind(instance));
				this.beforeEach(instance.beforeEach.bind(instance));
				tests.forEach(({ method, description }) => {
					this.test(description, instance[method].bind(instance));
				});
				this.afterEach(instance.afterEach.bind(instance));
				this.afterAll(instance.afterAll.bind(instance));
			});
		});
	}

	/**
	 * Describe the inner tests.
	 *
	 * @param {*[]} parameters
	 */
	describe(...parameters) {
		const callback = this.engine.describe || global.describe;

		return callback(...parameters);
	}

	/**
	 * Setup before the first inner test.
	 *
	 * @param {*[]} parameters
	 */
	beforeAll(...parameters) {
		const callback = this.engine.beforeAll || global.beforeAll;

		return callback(...parameters);
	}

	/**
	 * Setup before any inner test.
	 * @param {*[]} parameters
	 */
	beforeEach(...parameters) {
		const callback = this.engine.beforeEach || global.beforeEach;

		return callback(...parameters);
	}

	/**
	 * Tear down after the last inner test.
	 *
	 * @param {*[]} parameters
	 */
	afterAll(...parameters) {
		const callback = this.engine.afterAll || global.afterAll;

		return callback(...parameters);
	}

	/**
	 * Tear down after any inner test.
	 *
	 * @param {*[]} parameters
	 */
	afterEach(...parameters) {
		const callback = this.engine.afterEach || global.afterEach;

		return callback(...parameters);
	}

	/**
	 * Test a given case.
	 *
	 * @param {*[]} parameters
	 * @returns {*}
	 */
	test(...parameters) {
		const callback = this.engine.test || this.engine.it || global.test || global.it;

		return callback(...parameters);
	}

}

module.exports = TestRunner;
