//--------------------------------------------------------
//-- Node IoC - Test - Engines - Jest
//--------------------------------------------------------

import Engine from './Engine';


/**
 * Jest engine.
 *
 * @memberof test.engines
 * @augments test.engines.Engine
 * @hideconstructor
 */
class JestEngine extends Engine {

	/**
	 * @inheritdoc
	 */
	get engine() {
		return global.jest;
	}

	/**
	 * @inheritdoc
	 */
	get path() {
		return 'node_modules/jest/bin/jest';
	}

	/**
	 * @inheritdoc
	 */
	get describe() {
		return global.describe;
	}

	/**
	 * @inheritdoc
	 */
	get test() {
		return global.test;
	}

	/**
	 * @inheritdoc
	 */
	get beforeAll() {
		return global.beforeAll;
	}

	/**
	 * @inheritdoc
	 */
	get beforeEach() {
		return global.beforeEach;
	}

	/**
	 * @inheritdoc
	 */
	get afterEach() {
		return global.afterEach;
	}

	/**
	 * @inheritdoc
	 */
	get afterAll() {
		return global.afterAll;
	}

	/**
	 * @inheritdoc
	 */
	get expect() {
		return global.expect;
	}

	/**
	 * @inheritdoc
	 */
	get assert() {
		return global.assert;
	}

}


export default JestEngine;
