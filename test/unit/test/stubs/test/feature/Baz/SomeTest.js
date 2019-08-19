//--------------------------------------------------------
//-- Tests - Unit - Test - Baz - Some feature test
//--------------------------------------------------------
'use strict';

const TestCase = require('../../../../../../../lib/test/TestCase');


class SomeTest extends TestCase {

	testLorem() {
		this.expect(true).toBe(true);
	}

}


module.exports = SomeTest;
