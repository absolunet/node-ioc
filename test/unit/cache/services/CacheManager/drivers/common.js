//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - Common tests
//--------------------------------------------------------
'use strict';


module.exports = ({ given, when, then }) => {

	test('Can put item in cache and retrieve it', async () => {
		given.cacheEntry('foo', 'bar');
		await when.cachingGivenValues();
		await when.gettingCachedValue('foo');
		then.resultShouldBe('bar');
	});

	test('Can put item in cache and retrieve it after two second', async () => {
		given.cacheEntry('foo', 'bar');
		await when.cachingGivenValues();
		await when.waiting(2000);
		await when.gettingCachedValue('foo');
		then.resultShouldBe('bar');
	});

	test('Can put item with an expiration time', async () => {
		given.cacheEntry('foo', 'bar', 1);
		await when.cachingGivenValues();
		await when.waiting(2000);
		await when.gettingCachedValue('foo');
		then.resultShouldBe(null);
	});

	test('Can put item in cache with already existing key and overwrite the value', async () => {
		await when.cachingValue('foo', 'bar');
		await when.cachingValue('foo', 'baz');
		await when.gettingCachedValue('foo');
		then.resultShouldBe('baz');
	});

	test('Can get a non-existing item in cache', async () => {
		await when.gettingCachedValue('foo');
		then.resultShouldBe(null);
	});

	test('Can get a non-existing item in cache with a default value', async () => {
		await when.gettingCachedValue('foo', 'default value');
		then.resultShouldBe('default value');
	});

	test('Can put a plain object or array in cache', async () => {
		const object = { key: 'value' };
		given.cacheEntry('foo', object);
		await when.cachingGivenValues();
		await when.gettingCachedValue('foo');
		then.resultShouldEqual(object);
		then.resultShouldNotBe(object);
	});

	test('Can put an instance in cache and store its primitive value', async () => {
		given.cacheInstanceAsEntry('foo');
		await when.cachingGivenValues();
		await when.gettingCachedValue('foo');
		then.resultShouldBeUnserializedInstance();
	});

	test('Can increment a cached value', async () => {
		given.cacheEntry('foo', 1);
		await when.cachingGivenValues();
		await when.incrementing('foo');
		await when.gettingCachedValue('foo');
		then.resultShouldBe(2);
	});

	test('Can decrement a cached value', async () => {
		given.cacheEntry('foo', 4);
		await when.cachingGivenValues();
		await when.decrementing('foo');
		await when.gettingCachedValue('foo');
		then.resultShouldBe(3);
	});

	test('Can increment a non-existing value by initializing it to 0', async () => {
		await when.incrementing('foo');
		await when.gettingCachedValue('foo');
		then.resultShouldBe(1);
	});

	test('Can decrement a non-existing value by initializing it to 0', async () => {
		await when.decrementing('foo');
		await when.gettingCachedValue('foo');
		then.resultShouldBe(-1);
	});

	test('Can delete a cached value', async () => {
		given.cacheEntry('foo', 'bar');
		given.cacheEntry('baz', 'test');
		await when.cachingGivenValues();
		await when.deletingEntry('foo');
		await when.gettingCachedValues('foo', 'baz');
		then.resultShouldEqual({ foo: null, baz: 'test' });
	});

	test('Can delete a non-existing value', async () => {
		await when.deletingEntry('foo');
		await when.gettingCachedValue('foo');
		then.resultShouldBe(null);
	});

	test('Can flush the whole cache', async () => {
		given.cacheEntry('foo', 'bar');
		given.cacheEntry('baz', 'test');
		await when.cachingGivenValues();
		await when.flushingCache();
		await when.gettingCachedValues('foo', 'baz');
		then.resultShouldEqual({ foo: null, baz: null });
	});

};
