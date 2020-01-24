//--------------------------------------------------------
//-- Tests - Unit - Cache - Commands - Cache Forget Command
//--------------------------------------------------------

import gwt from './CacheForgetCommand.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeCacheConfig();
	given.fakeCacheManager();
	given.runner();
	given.emptyArgv();
	given.cacheForgetCommand();
});


test('Cache key is required', async () => {
	await when.preprocessingCommand();
	then.parameterIsRequired('key');
});


test('Can flush given key from default store', async () => {
	given.cacheKeyAsParameter('my_key');
	await when.runningCommand();
	then.shouldHaveDeletedKeyOnDefaultStore('my_key');
});


test('Can flush given key from given store', async () => {
	given.cacheKeyAsParameter('my_key');
	given.alternateStoreAsParameter();
	await when.runningCommand();
	then.shouldHaveDeletedKeyOnAlternateStore('my_key');
});
