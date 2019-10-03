//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Feature Test Repository - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const FeatureTestRepository = require('../../../../lib/test/repositories/FeatureTestRepository');


//-- Given
//--------------------------------------------------------

given.featureTestRepository = () => {
	given.repository(FeatureTestRepository);
};


module.exports = build({ given, when, then });
