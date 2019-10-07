//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Not Implemented Error - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const NotImplementedError = require('../../../../lib/foundation/exceptions/NotImplementedError');

let instance;
let expectedValue;
let method;
let type;


//-- Mocks
//--------------------------------------------------------

const FakeClass    = class FakeClass {};
const fakeInstance = new FakeClass();


//-- Given
//--------------------------------------------------------

given.freshValues = () => {
	instance      = undefined;
	expectedValue = undefined;
	method        = undefined;
	type          = undefined;
};

given.instance = () => {
	instance = fakeInstance;
};

given.class = () => {
	instance = FakeClass;
};

given.method = () => {
	method = 'method';
};

given.expectedValue = () => {
	expectedValue = 'string';
};

given.accessor = () => {
	method = 'property';
	type   = 'accessor';
};

given.mutator = () => {
	method = 'property';
	type   = 'mutator';
};


//-- When
//--------------------------------------------------------

when.throwing = () => {
	when.attempting(() => {
		throw new NotImplementedError(instance, method, expectedValue, type);
	});
};


//-- Then
//--------------------------------------------------------

then.messageShouldContainClassNameAndMethod = () => {
	then.exceptionShouldBe('The method [method] must be implemented in [FakeClass].');
};

then.messageShouldContainClassNameMethodAndExpectedValue = () => {
	then.exceptionShouldBe('The method [method] must be implemented in [FakeClass]. It should return [string].');
};

then.messageShouldContainClassNameAccessorAndExpectedValue = () => {
	then.exceptionShouldBe('The accessor [property] must be implemented in [FakeClass]. It should return [string].');
};

then.messageShouldContainClassNameAndMutator = () => {
	then.exceptionShouldBe('The mutator [property] must be implemented in [FakeClass].');
};


module.exports = build({ given, when, then });
