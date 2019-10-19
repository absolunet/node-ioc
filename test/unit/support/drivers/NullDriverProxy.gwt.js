//--------------------------------------------------------
//-- Tests - Unit - Support - Drivers - Null Driver Proxy - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container        from '../../container';
import NullDriverProxy from '../../../../dist/node/support/drivers/NullDriverProxy';

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

when.accessingSymbolProperty = () => {
	when.attempting(() => {
		result = nullInstance[Symbol('foo')];
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

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldEqual = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(expected);
};

then.resultShouldBeNullInstance = () => {
	then.shouldNotHaveThrown();
	expect(result).toBeTruthy();
	expect(result).toBeInstanceOf(Function);
	expect(result).not.toBe(nullInstance);
};

then.resultShouldBeEmptyArray = () => {
	then.resultShouldEqual([]);
};

then.resultShouldBeArrayWithContainerDynamicProperties = () => {
	then.resultShouldEqual(['__instance', 'init']);
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


export default build({ given, when, then });
