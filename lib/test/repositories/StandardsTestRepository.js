//--------------------------------------------------------
//-- Node IoC - Test - Repository - Standards Test repository
//--------------------------------------------------------
'use strict';


const TestRepository = require('./TestRepository');


class StandardsTestRepository extends TestRepository {

	/**
	 * {@inheritdoc}
	 */
	get scope() {
		return 'standards';
	}

}

module.exports = StandardsTestRepository;
