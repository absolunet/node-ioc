//--------------------------------------------------------
//-- Node IoC - Test - Repository - Unit Test repository
//--------------------------------------------------------
'use strict';


const TestRepository = require('./TestRepository');


class UnitTestRepository extends TestRepository {

	/**
	 * {@inheritdoc}
	 */
	get scope() {
		return 'unit';
	}

}

module.exports = UnitTestRepository;
