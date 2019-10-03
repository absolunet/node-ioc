//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Not Implemented Error
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./NotImplementedError.gwt');


beforeEach(() => {
	given.freshValues();
});


test('Can throw with an instance and a method name', () => {
	given.instance();
	given.method();
	when.throwing();
	then.messageShouldContainClassNameAndMethod();
});

test('Can throw with a class and a method name', () => {
	given.class();
	given.method();
	when.throwing();
	then.messageShouldContainClassNameAndMethod();
});

test('Can throw with an instance, a method and an expected value', () => {
	given.instance();
	given.method();
	given.expectedValue();
	when.throwing();
	then.messageShouldContainClassNameMethodAndExpectedValue();
});

test('Can throw with an instance, an accessor and an expected value', () => {
	given.instance();
	given.accessor();
	given.expectedValue();
	when.throwing();
	then.messageShouldContainClassNameAccessorAndExpectedValue();
});

test('Can throw with an instance and a mutator', () => {
	given.instance();
	given.mutator();
	when.throwing();
	then.messageShouldContainClassNameAndMutator();
});
