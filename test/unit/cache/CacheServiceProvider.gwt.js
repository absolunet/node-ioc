//--------------------------------------------------------
//-- Tests - Unit - Cache - Cache Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');


//-- Then
//--------------------------------------------------------

then.cacheManagerShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('cache');
};

then.cacheManagerShouldBeSingleton = () => {
	then.shouldHaveSingleton('cache');
};


module.exports = build({ given, when, then });
