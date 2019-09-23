//--------------------------------------------------------
//-- Tests - Unit - HTTP - HTTP Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./HttpServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
});


test('HTTP client is resolvable', () => {
	when.bootingContainer();
	then.httpClientShouldBeResolvable();
});

test('HTTP service is a singleton', () => {
	when.bootingContainer();
	then.httpClientShouldBeSingleton();
});
