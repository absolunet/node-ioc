//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Engine
//--------------------------------------------------------

import gwt from './FileEngine.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeAsync();
	given.fakeSync();
	given.fileEngine();
});


test('Exposes async system', () => {
	when.gettingAsync();
	then.shouldHaveAsyncSystem();
});

test('Exposes sync system', () => {
	when.gettingSync();
	then.shouldHaveSyncSystem();
});

test('Forwards calls to the sync system by default', () => {
	when.callingScandir();
	then.scandirShouldNotHaveBeenCalledOnAsyncSystem();
	then.scandirShouldHaveBeenCalledOnSyncSystem();
});

