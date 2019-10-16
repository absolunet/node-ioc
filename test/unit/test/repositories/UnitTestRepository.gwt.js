//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Unit Test Repository - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const UnitTestRepository = require('../../../../dist/node/test/repositories/UnitTestRepository');


//-- Given
//--------------------------------------------------------

given.unitTestRepository = () => {
	given.repository(UnitTestRepository);
};


module.exports = build({ given, when, then });
