//--------------------------------------------------------
//-- Tests - Unit - Security - Security Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');


//-- Then
//--------------------------------------------------------

then.gateServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('gate');
};

then.gateServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('gate');
};


module.exports = build({ given, when, then });
