//--------------------------------------------------------
//-- Node IoC - Test - Repository - Feature Test repository
//--------------------------------------------------------
'use strict';

const TestRepository = require('./TestRepository');
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

module.exports = FeatureTestRepository;