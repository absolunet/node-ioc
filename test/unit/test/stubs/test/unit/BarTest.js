//--------------------------------------------------------
//-- Tests - Unit - Test - Bar unit test
//--------------------------------------------------------
'use strict';

const TestCase = require('../../../../../../lib/test/TestCase');


class BarTest extends TestCase {

	testLorem() {
		this.expect(true).toBe(true);
	}

}


module.exports = BarTest;
