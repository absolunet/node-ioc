//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./CacheManager.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.manager();
	given.defaultStoreConfig('runtime');
	given.runtimeStoreConfig();
	given.fileStoreConfig();
	given.testStoreConfig();
});


test('Can resolve default store', () => {
	when.resolvingDefaultStore();
	then.shouldHaveRuntimeDriver();
});

test('Can resolve default store from resolve() method', () => {
	when.resolvingStore();
	then.shouldHaveRuntimeDriver();
});

test('Can resolve store by name', () => {
	given.configForTestStore({ foo: 'bar' });
	when.resolvingStore('test');
	then.shouldHaveTestDriver();
	then.driverShouldHaveConfig({ foo: 'bar' });
});

test('Can build store by driver', () => {
	given.configForTestStore({ foo: 'bar' });
	when.buildingDriver('test');
	then.shouldHaveTestDriver();
	then.driverShouldNotHaveConfig({ foo: 'bar' });
});

test('Can build store by driver and config', () => {
	given.configForTestStore({ foo: 'bar' });
	when.buildingDriver('test', { foo: 'other bar' });
	then.shouldHaveTestDriver();
	then.driverShouldHaveConfig({ foo: 'other bar' });
});

test('Common configured config are merged with passed config when building', () => {
	given.prefixConfig('node_ioc_test');
	given.expirationConfig(100);
	when.buildingDriver('test');
	when.buildingOtherDriver('test', { baz: 'test', prefix: 'node_ioc_custom_prefix' });
	then.driverShouldHaveExactConfig({
		prefix: 'node_ioc_test',
		expiration: 100
	});
	then.otherDriverShouldHaveExactConfig({
		baz: 'test',
		prefix: 'node_ioc_custom_prefix',
		expiration: 100
	});
});

test('Forwards calls to the default store', async () => {
	given.defaultStoreConfig('test');
	await when.gettingCachedValue('foo');
	then.testDriverGetMethodWouldHaveBeenCalledWith('foo');
	then.resultShouldBeTestDriverGetMethodReturnedValue();
});

test('Throws if given store does not exists', () => {
	when.resolvingStore('unexisting');
	then.shouldHaveThrown();
});
