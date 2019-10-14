//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Standards Test Repository - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const StandardsTestRepository = require('../../../../src/test/repositories/StandardsTestRepository');


//-- Given
//--------------------------------------------------------

given.standardsTestRepository = () => {
	given.repository(StandardsTestRepository);
};


module.exports = build({ given, when, then });
