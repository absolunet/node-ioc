//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Test Repository - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const TestRepository = require('../../../../dist/node/test/repositories/TestRepository');


//-- Mocks
//--------------------------------------------------------

const ScopedTestRepository = class extends TestRepository {

	get scope() { return 'unit'; }

};


//-- Given
//--------------------------------------------------------

given.testRepository = () => {
	given.repository(TestRepository);
};

given.scopedTestRepository = () => {
	given.repository(ScopedTestRepository);
};


module.exports = build({ given, when, then });
