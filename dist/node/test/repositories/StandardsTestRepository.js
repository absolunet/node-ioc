//--------------------------------------------------------
//-- Node IoC - Test - Repository - Standards Test repository
//--------------------------------------------------------
'use strict';

const TestRepository = require('./TestRepository');
/**
 * Standards test repository that scopes to the "standards" folder.
 *
 * @memberof test.repositories
 * @augments test.repositories.TestRepository
 * @hideconstructor
 */


class StandardsTestRepository extends TestRepository {
  /**
   * @inheritdoc
   */
  get scope() {
    return 'standards';
  }

}

module.exports = StandardsTestRepository;