//--------------------------------------------------------
//-- Tests - Unit - Validation - Validation Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');


//-- Then
//--------------------------------------------------------

then.validatorServiceIsResolvable = () => {
	then.serviceShouldBeResolvable('validator');
};

then.validatorServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('validator');
};


module.exports = build({ given, when, then });
