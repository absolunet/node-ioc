//--------------------------------------------------------
//-- Tests - Unit - HTTP - HTTP Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');


//-- Then
//--------------------------------------------------------

then.httpClientShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('http');
};

then.httpClientShouldBeSingleton = () => {
	then.shouldHaveSingleton('http');
};


module.exports = build({ given, when, then });
