//--------------------------------------------------------
//-- Tests - Unit - Log - Log Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');


//-- Then
//--------------------------------------------------------

then.loggerServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('log');
};

then.loggerServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('log');
};


module.exports = build({ given, when, then });
