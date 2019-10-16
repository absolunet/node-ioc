//--------------------------------------------------------
//-- Node IoC - Test - Repository - Unit Test repository
//--------------------------------------------------------

import TestRepository from './TestRepository';


/**
 * Unit test repository that scopes to the "unit" folder.
 *
 * @memberof test.repositories
 * @augments test.repositories.TestRepository
 * @hideconstructor
 */
class UnitTestRepository extends TestRepository {

	/**
	 * @inheritdoc
	 */
	get scope() {
		return 'unit';
	}

}


export default UnitTestRepository;
