//--------------------------------------------------------
//-- Tests - Unit - Application - Main - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

let main;
let result;


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.mainFile = () => {
	main = require('../../../dist/node'); // eslint-disable-line global-require
};


//-- When
//--------------------------------------------------------

when.gettingMixinsWithoutFactory = () => {
	when.attempting(() => {
		({ ...result } = main.mixins.default);
		delete result.factory;
		delete result.default;
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


export default build({ given, when, then });
