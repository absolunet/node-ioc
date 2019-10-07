//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Factory
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Factory.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can register a model factory', () => {

});

test('Can replace existing model factory', () => {

});

test('Can register a model factory with specified model name regardless of the factory model name', () => {

});

test('Can create model instance', () => {

});

test('Can create model instance with parameters', () => {

});

test('Can create model collection instance', () => {

});

test('Can create model collection instance with parameters', () => {

});

test('Throws while making model if the model does not exists in the model repository', () => {

});

test('Throws while making model if the model factory does not exists', () => {

});

test('Does not throw if requesting less than one model', () => {

});
