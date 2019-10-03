//--------------------------------------------------------
//-- Tests - Unit - View - View Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');


then.engineServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('view.engine');
};

then.factoryServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('view');
};

then.resolverServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('view.resolver');
};

then.engineServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('view.engine');
};

then.factoryServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('view');
};

then.resolverServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('view.resolver');
};


module.exports = build({ given, when, then });
