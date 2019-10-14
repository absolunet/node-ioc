//--------------------------------------------------------
//-- Tests - Unit - Application - Main - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const Application = require('../../../src/foundation/Application');

let main;
let result;
let mockedSetTimeout;


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.mainFile = () => {
	main = require('../../../src'); // eslint-disable-line global-require
};

given.mockedSetTimeout = () => {
	mockedSetTimeout = jest.spyOn(global, 'setTimeout');
};


//-- When
//--------------------------------------------------------

when.gettingApplication = () => {
	when.attempting(() => {
		result = main.app;
	});
};

when.gettingMixinsWithoutFactory = () => {
	when.attempting(() => {
		({ ...result } = main.mixins);
		delete result.factory;
	});
};

when.loadingMainFile = () => {
	when.attempting(() => {
		require('../../../src'); // eslint-disable-line global-require
	});
};

when.gettingAllKeysExceptApplicationAndMixins = () => {
	when.attempting(() => {
		const descriptors = Object.entries(Object.getOwnPropertyDescriptors(main))
			.filter(([key]) => {
				return !['app', 'mixins'].includes(key);
			})
			.map(([key, descriptor]) => {
				return [key, descriptor.get()];
			});
		result = Object.fromEntries(descriptors);
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveReceivedApplicationInstance = () => {
	expect(result).toBeInstanceOf(Application);
};

then.mockedSetTimeoutCallbackShouldNotHaveBeenCalled = () => {
	then.shouldNotHaveThrown();
	expect(mockedSetTimeout).not.toHaveBeenCalled();
};

then.restoreMockedSetTimeout = () => {
	mockedSetTimeout.mockRestore();
};

then.allKeysShouldBeConstructor = () => {
	then.shouldNotHaveThrown();
	expect(typeof result).toBe('object');
	Object.values(result).forEach((value) => {
		expect(typeof value === 'function' && typeof value.prototype !== 'undefined').toBe(true);
	});
};

then.allKeysShouldFactoryConstructor = () => {
	then.shouldNotHaveThrown();
	expect(typeof result).toBe('object');
	Object.values(result).forEach((value) => {
		expect(typeof value).toBe('function');
		const factory = value();
		expect(typeof factory === 'function' && typeof factory.prototype !== 'undefined').toBe(true);
	});
};


module.exports = build({ given, when, then });
