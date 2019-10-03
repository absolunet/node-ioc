//--------------------------------------------------------
//-- Tests - Unit - Cache - Cache Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./CacheServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
});


test('Cache manager is resolvable', () => {
	when.bootingContainer();
	then.cacheManagerShouldBeResolvable();
});

test('Cache manager is a singleton', () => {
	when.bootingContainer();
	then.cacheManagerShouldBeSingleton();
});
