//--------------------------------------------------------
//-- Node IoC - Test - Repository - Feature Test repository
//--------------------------------------------------------

import TestRepository from './TestRepository';


/**
 * Feature test repository that scopes to the "feature" folder.
 *
 * @memberof test.repositories
 * @augments test.repositories.TestRepository
 * @hideconstructor
 */
class FeatureTestRepository extends TestRepository {

	/**
	 * @inheritdoc
	 */
	get scope() {
		return 'feature';
	}

}


export default FeatureTestRepository;
