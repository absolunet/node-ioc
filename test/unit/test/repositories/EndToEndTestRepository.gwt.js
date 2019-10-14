//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - End-To-End Test Repository - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const EndToEndTestRepository = require('../../../../src/test/repositories/EndToEndTestRepository');


//-- Given
//--------------------------------------------------------

given.endToEndTestRepository = () => {
	given.repository(EndToEndTestRepository);
};


module.exports = build({ given, when, then });
