//--------------------------------------------------------
//-- Tests - Unit - Test - Baz - Some unit test
//--------------------------------------------------------
'use strict';

const TestCase = require('./../../../../../../../lib/test/TestCase');


class SomeTest extends TestCase {

	testLorem() {
		this.expect(true).toBe(true);
	}

	testSomethingVeryLong() {
		this.expect(true).toBe(true);
	}

}


module.exports = SomeTest;
