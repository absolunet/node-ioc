//--------------------------------------------------------
//-- Tests - Unit - Log - Log Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./LogServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
});


test('Logger service is resolvable', () => {
	when.bootingContainer();
	then.loggerServiceShouldBeResolvable();
});

test('Logger service is a singleton', () => {
	when.bootingContainer();
	then.loggerServiceShouldBeSingleton();
});
