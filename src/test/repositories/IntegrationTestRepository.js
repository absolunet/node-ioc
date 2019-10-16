//--------------------------------------------------------
//-- Node IoC - Test - Repository - End To End Test repository
//--------------------------------------------------------

import TestRepository from './TestRepository';


/**
 * End to end test repository that scopes to the "e2e" folder.
 *
 * @memberof test.repositories
 * @augments test.repositories.TestRepository
 * @hideconstructor
 */
class IntegrationTestRepository extends TestRepository {

	/**
	 * @inheritdoc
	 */
	get scope() {
		return 'integration';
	}

}


export default IntegrationTestRepository;
