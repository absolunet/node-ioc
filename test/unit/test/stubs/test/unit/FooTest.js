//--------------------------------------------------------
//-- Tests - Unit - Test - Foo unit test
//--------------------------------------------------------
'use strict';

const TestCase = require('./../../../../../../lib/test/TestCase');


class FooTest extends TestCase {

	testLorem() {
		this.expect(true).toBe(true);
	}

}


module.exports = FooTest;
