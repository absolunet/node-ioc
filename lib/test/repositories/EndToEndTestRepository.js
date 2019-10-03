//--------------------------------------------------------
//-- Node IoC - Test - Repository - End To End Test repository
//--------------------------------------------------------
'use strict';

const TestRepository = require('./TestRepository');


class EndToEndTestRepository extends TestRepository {

	/**
	 * {@inheritdoc}
	 */
	get scope() {
		return 'e2e';
	}

}

module.exports = EndToEndTestRepository;
