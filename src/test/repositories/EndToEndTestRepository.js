//--------------------------------------------------------
//-- Node IoC - Test - Repository - End To End Test repository
//--------------------------------------------------------
'use strict';

const TestRepository = require('./TestRepository');


/**
 * End to end test repository that scopes to the "e2e" folder.
 *
 * @memberof test.repositories
 * @augments test.repositories.TestRepository
 * @hideconstructor
 */
class EndToEndTestRepository extends TestRepository {

	/**
	 * @inheritdoc
	 */
	get scope() {
		return 'e2e';
	}

}

module.exports = EndToEndTestRepository;
