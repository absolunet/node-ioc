//--------------------------------------------------------
//-- Tests - Unit - Cache - Cache Service Provider
//--------------------------------------------------------

import gwt from './CacheServiceProvider.gwt';
const { given, when, then } = gwt;


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
