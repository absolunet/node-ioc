//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../../common.gwt');

const container     = require('../../../container');
const RuntimeDriver = require('../../../../../dist/node/cache/services/CacheManager/drivers/RuntimeDriver');
const CacheManager  = require('../../../../../dist/node/cache/services/CacheManager');


//-- Mocks
//--------------------------------------------------------

const fakeGet = jest.fn(() => { return Promise.resolve('bar'); });
const FakeTestDriver = class extends RuntimeDriver {

	get(...parameters) {
		return fakeGet(...parameters);
	}

};


//-- Given
//--------------------------------------------------------

let manager;

given.manager = () => {
	manager = container.make(CacheManager, { app: container, config: container.make('config') });
};

given.runtimeStoreConfig = () => {
	given.storeConfig('runtime', { driver: 'runtime' });
};

given.fileStoreConfig = () => {
	given.storeConfig('file', { driver: 'file' });
};

given.testStoreConfig = () => {
	given.testDriver();
	given.storeConfig('test', { driver: 'test' });
};

given.testDriver = () => {
	manager.addDriver('test', FakeTestDriver);
};

given.configForStore = (store, config) => {
	given.storeConfig(store, { ...container.make('config').get(`cache.stores.${store}`, {}), ...config });
};

given.configForTestStore = (config) => {
	given.configForStore('test', config);
};


//-- When
//--------------------------------------------------------

let result;
let result2;

when.resolvingDefaultStore = () => {
	when.attempting(() => {
		result = manager.resolveDefault();
	});
};

when.resolvingStore = (store) => {
	when.attempting(() => {
		result = manager.resolve(store);
	});
};

when.buildingDriver = (driver, config) => {
	when.attempting(() => {
		result = manager.build(driver, config);
	});
};

when.buildingOtherDriver = (driver, config) => {
	when.attempting(() => {
		result2 = manager.build(driver, config);
	});
};

when.gettingCachedValue = async (key) => {
	await when.attemptingAsync(async () => {
		result = await manager.get(key);
	});
};


//-- Then
//--------------------------------------------------------

then.driverShouldBeInstanceOf = (driver) => {
	then.shouldNotHaveThrown();
	expect(result).toBeInstanceOf(driver);
};

then.shouldHaveRuntimeDriver = () => {
	then.driverShouldBeInstanceOf(RuntimeDriver);
};

then.shouldHaveTestDriver = () => {
	then.driverShouldBeInstanceOf(FakeTestDriver);
};

then.driverShouldHaveDriverConfigProperty = () => {
	then.shouldNotHaveThrown();
	expect(result.driverConfig).toBeTruthy();
};

then.otherDriverShouldHaveDriverConfigProperty = () => {
	then.shouldNotHaveThrown();
	expect(result2.driverConfig).toBeTruthy();
};

then.driverShouldHaveConfig = (config) => {
	then.driverShouldHaveDriverConfigProperty();
	expect(result.driverConfig).toMatchObject(config);
};

then.driverShouldNotHaveConfig = (config) => {
	then.driverShouldHaveDriverConfigProperty();
	expect(result.driverConfig).not.toMatchObject(config);
};

then.otherDriverShouldHaveConfig = (config) => {
	then.driverShouldHaveDriverConfigProperty();
	expect(result2.driverConfig).toMatchObject(config);
};

then.otherDriverShouldNotHaveConfig = (config) => {
	then.driverShouldHaveDriverConfigProperty();
	expect(result2.driverConfig).not.toMatchObject(config);
};

then.driverShouldHaveExactConfig = (config) => {
	then.otherDriverShouldHaveDriverConfigProperty();
	expect(result.driverConfig).toStrictEqual(config);
};

then.otherDriverShouldHaveExactConfig = (config) => {
	then.otherDriverShouldHaveDriverConfigProperty();
	expect(result2.driverConfig).toStrictEqual(config);
};

then.testDriverGetMethodWouldHaveBeenCalledWith = (...parameters) => {
	expect(fakeGet).toHaveBeenCalledWith(...parameters);
};

then.resultShouldBeTestDriverGetMethodReturnedValue = () => {
	then.shouldNotHaveThrown();
	expect(result).toBe('bar');
};


module.exports = build({ given, when, then });
