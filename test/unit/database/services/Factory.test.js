//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Factory
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Factory.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeModelRepository();
	given.fakeFaker();
	given.factory();
});


test('Can register a model factory', () => {
	given.modelFactoryForFoo();
	when.gettingModelFactoryFor('foo');
	then.shouldHaveReceivedModelFactoryForFoo();
});

test('Can replace existing model factory', () => {
	given.modelFactoryForFoo();
	given.otherModelFactoryForFoo();
	when.gettingModelFactoryFor('foo');
	then.shouldHaveReceivedOtherModelFactoryForFoo();
});

test('Can register a model factory with specified model name regardless of the factory model name', () => {
	given.modelFactoryFor('bar');
	when.gettingModelFactoryFor('bar');
	then.shouldHaveReceivedModelFactoryForFoo();
});

test('Throws while getting model factory if it does not exists', () => {
	when.gettingModelFactoryFor('baz');
	then.shouldHaveThrown();
});

test('Can create model instance', () => {
	given.modelFactoryForFoo();
	when.making('foo');
	then.shouldHaveReceivedOneFactoriedModel();
});

test('Can create model instance with parameters', () => {
	given.modelFactoryForFoo();
	when.making('foo', { bar: 'baz' });
	then.shouldHaveReceivedOneFactoriedModel();
	then.modelAttributesShouldMatch({ bar: 'baz' });
});

test('Can create model collection instance', () => {
	given.modelFactoryForFoo();
	when.making('foo', 2);
	then.twoModelsShouldHaveDifferentAttributes();
});

test('Can create model collection instance with parameters', () => {
	given.modelFactoryForFoo();
	when.making('foo', { bar: 'baz' }, 2);
	then.twoModelsShouldHaveDifferentAttributes();
	then.modelsAttributesShouldMatch({ bar: 'baz' });
});

test('Throws while making model if the model factory does not exists', () => {
	when.making('foo');
	then.shouldHaveThrown();
});

test('Throw if requesting less than one model', () => {
	given.modelFactoryForFoo();
	when.making('foo', 0);
	then.shouldHaveThrown();
});
