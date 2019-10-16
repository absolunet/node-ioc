//--------------------------------------------------------
//-- Tests - Unit - Support - Drivers - Null Driver Proxy - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container        = require('../../container');
const NullDriverProxy = require('../../../../dist/node/support/drivers/NullDriverProxy');

let nullInstance;
let result;


//-- Given
//--------------------------------------------------------

given.nullInstance = () => {
	nullInstance = container.make(NullDriverProxy);
};

given.emptyResult = () => {
	result = undefined;
};


//-- When
//--------------------------------------------------------

when.accessingProperty = () => {
	when.attempting(() => {
		result = nullInstance.foo;
	});
};

when.accessingPropertyByDestructuring = () => {
	when.attempting(() => {
		({ foo: result } = nullInstance);
	});
};

when.accessingSubProperty = () => {
	when.attempting(() => {
		result = nullInstance.foo.bar;
	});
};

when.accessingSubPropertyByDestructuring = () => {
	when.attempting(() => {
		({ foo: { bar: result } } = nullInstance);
	});
};

when.assigningValueToProperty = () => {
	when.attempting(() => {
		nullInstance.foo = 'bar';
	});
};

when.callingMethod = () => {
	when.attempting(() => {
		result = nullInstance.foo();
	});
};

when.callingAsFunction = () => {
	when.attempting(() => {
		result = nullInstance();
	});
};

when.instantiating = () => {
	when.attempting(() => {
		result = new nullInstance(); // eslint-disable-line new-cap
	});
};

when.accessingNumericKey = () => {
	when.attempting(() => {
		result = nullInstance[0]; // eslint-disable-line prefer-destructuring
	});
};

when.accessingNumericKeyByDestructuring = () => {
	when.attempting(() => {
		[result] = nullInstance;
	});
};

when.deletingProperty = () => {
	when.attempting(() => {
		delete nullInstance.foo;
	});
};

when.accessingPrototype = () => {
	when.attempting(() => {
		result = nullInstance.prototype;
	});
};

when.callingObjectKeys = () => {
	when.attempting(() => {
		result = Object.keys(nullInstance);
	});
};

when.callingObjectGetPrototypeOf = () => {
	when.attempting(() => {
		result = Object.getPrototypeOf(nullInstance);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBeNullInstance = () => {
	then.shouldNotHaveThrown();
	expect(result).toBeTruthy();
	expect(result).toBeInstanceOf(Function);
	expect(result).not.toBe(nullInstance);
};

then.resultShouldBeEmptyArray = () => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual([]);
};

then.resultShouldBeArrayWithContainerDynamicProperties = () => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(['__instance', 'init']);
};

then.resultShouldBePlainFunction = () => {
	then.shouldNotHaveThrown();
	expect(result.constructor).toBe(Function);
};

then.resultShouldBeEmptyObject = () => {
	then.shouldNotHaveThrown();
	expect(result).toMatchObject({});
	expect(result).not.toBeInstanceOf(Function);
	expect(result).not.toBe(nullInstance);
};

then.resultShouldBeUndefined = () => {
	then.shouldNotHaveThrown();
	expect(result).toBe(undefined);
};


module.exports = build({ given, when, then });
