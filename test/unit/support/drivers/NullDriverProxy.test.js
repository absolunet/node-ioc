//--------------------------------------------------------
//-- Tests - Unit - Support - Drivers - Null Driver Proxy
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./NullDriverProxy.gwt');


beforeEach(() => {
	given.nullInstance();
});

test('Can access property', () => {
	when.accessingProperty();
	then.resultShouldBeNullInstance();
});

test('Can access sub-property', () => {
	when.accessingSubProperty();
	then.resultShouldBeNullInstance();
});

test('Can access sub-property by destructuring', () => {
	when.accessingSubPropertyByDestructuring();
	then.resultShouldBeNullInstance();
});

test('Can assign value to property', () => {
	when.assigningValueToProperty();
	then.shouldNotHaveThrown();
});

test('Can call method', () => {
	when.callingMethod();
	then.resultShouldBeNullInstance();
});

test('Can be called as function', () => {
	when.callingAsFunction();
	then.resultShouldBeNullInstance();
});

test('Can be instantiate', () => {
	when.instantiating();
	then.resultShouldBeNullInstance();
});

test('Can access numeric key', () => {
	when.accessingNumericKey();
	then.resultShouldBeNullInstance();
});

test('Can access prototype', () => {
	when.accessingPrototype();
	then.resultShouldBeEmptyObject();
});

test('Can delete property', () => {
	when.deletingProperty();
	then.shouldNotHaveThrown();
});

test('Can call Object.keys() on it', () => {
	when.callingObjectKeys();
	then.resultShouldBeArrayWithContainerDynamicProperties();
});

test('Can call Object.getPrototypeOf() on it', () => {
	when.callingObjectGetPrototypeOf();
	then.resultShouldBePlainFunction();
});

test('Can access numeric key by destructuring and returns undefined instead of assuming required keys', () => {
	when.accessingNumericKeyByDestructuring();
	then.resultShouldBeUndefined();
});

test('Can access property by destructuring and returns undefined instead of assuming required keys', () => {
	when.accessingPropertyByDestructuring();
	then.resultShouldBeNullInstance();
});

