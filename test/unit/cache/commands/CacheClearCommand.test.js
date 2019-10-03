//--------------------------------------------------------
//-- Tests - Unit - Cache - Commands - Cache Clear Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./CacheClearCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeCacheConfig();
	given.fakeCacheManager();
	given.runner();
	given.emptyArgv();
	given.cacheClearCommand();
});


test('Flushes the default store', async () => {
	await when.runningCommand();
	then.defaultStoreShouldHaveBeenFlushed();
});

test('Flushes the given store instead of the default one', async () => {
	given.alternateStoreAsOption();
	await when.runningCommand();
	then.alternateStoreShouldHaveBeenFlushed();
});
