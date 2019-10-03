//--------------------------------------------------------
//-- Tests - Unit - Events - Event Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');


//-- Then
//--------------------------------------------------------

then.eventServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('event');
};

then.eventServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('event');
};


module.exports = build({ given, when, then });
