//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - GWT
//--------------------------------------------------------

import gwt from '../../../common.gwt';
const { given, when, then, build } = gwt;

import container from '../../../../container';

let driver;
let entries;
let result;


//-- Mocks
//--------------------------------------------------------

const FakeClass = class {

	constructor() {
		this.foo = 'bar';
		this.baz = 'test';
	}

};


//-- Given
//--------------------------------------------------------

given.emptyDriver = () => {
	driver = undefined;
};

given.driver = (concrete, config = {}) => {
	driver = container.make(concrete, { 'driver.config': config });
};

given.emptyEntry = () => {
	entries = [];
};

given.cacheEntry = (key, value, seconds) => {
	entries.push({ key, value, seconds });
};

given.cacheInstanceAsEntry = (key, seconds) => {
	const value = new FakeClass();
	given.cacheEntry(key, value, seconds);
};


//-- When
//--------------------------------------------------------

when.cachingValue = async (key, value, seconds) => {
	await when.attemptingAsync(async () => {
		await driver.put(key, value, seconds);
	});
};

when.cachingValues = async (values) => {
	for (const { key, value, seconds } of values) {
		await when.cachingValue(key, value, seconds); // eslint-disable-line no-await-in-loop
	}
};

when.cachingGivenValues = async () => {
	await when.cachingValues(entries);
};

when.gettingCachedValue = async (key, defaultValue) => {
	await when.attemptingAsync(async () => {
		result = await driver.get(key, defaultValue);
	});
};

when.gettingCachedValues = async (...keys) => {
	result = {};
	await when.attemptingAsync(async () => {
		await Promise.all(keys.map(async (key) => {
			result[key] = await driver.get(key);
		}));
	});
};

when.incrementing = async (key, increment) => {
	await when.attemptingAsync(async () => {
		await driver.increment(key, increment);
	});
};

when.decrementing = async (key, increment) => {
	await when.attemptingAsync(async () => {
		await driver.decrement(key, increment);
	});
};

when.deletingEntry = async (key) => {
	await when.attemptingAsync(async () => {
		await driver.delete(key);
	});
};

when.flushingCache = async () => {
	await when.attemptingAsync(async () => {
		await driver.flush();
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (value) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(value);
};

then.resultShouldNotBe = (value) => {
	then.shouldNotHaveThrown();
	expect(result).not.toBe(value);
};

then.resultShouldEqual = (value) => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(value);
};

then.resultShouldNotEqual = (value) => {
	then.shouldNotHaveThrown();
	expect(result).not.toStrictEqual(value);
};

then.resultShouldBeUnserializedInstance = () => {
	then.resultShouldEqual({ foo: 'bar', baz: 'test' });
	expect(result).not.toBeInstanceOf(FakeClass);
};


export default build({ given, when, then });
