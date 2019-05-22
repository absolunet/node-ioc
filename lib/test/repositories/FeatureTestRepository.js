//--------------------------------------------------------
//-- Node IoC - Test - Repository - Feature Test repository
//--------------------------------------------------------
'use strict';


const TestRepository = require('./TestRepository');


class FeatureTestRepository extends TestRepository {

	/**
	 * {@inheritdoc}
	 */
	get scope() {
		return 'feature';
	}

}

module.exports = FeatureTestRepository;
