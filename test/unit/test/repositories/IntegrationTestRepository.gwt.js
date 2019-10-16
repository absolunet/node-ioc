//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - End-To-End Test Repository - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const IntegrationTestRepository = require('../../../../dist/node/test/repositories/IntegrationTestRepository');


//-- Given
//--------------------------------------------------------

given.IntegrationTestRepository = () => {
	given.repository(IntegrationTestRepository);
};


module.exports = build({ given, when, then });
