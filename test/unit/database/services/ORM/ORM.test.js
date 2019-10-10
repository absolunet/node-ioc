//--------------------------------------------------------
//-- Tests - Unit - Database - Services - ORM
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ORM.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeBuilder();
	given.orm();
	given.fakeDriverAsDefaultDriver();
});


test('Can register model with Model class', () => {
	when.registeringFooModel();
	then.fakeDriverShouldHaveReceivedFooModelWithName('foo');
});

test('Can register model with given name regardless of the specified model class name', () => {
	when.registeringFooModelAs('bar');
	then.fakeDriverShouldHaveReceivedFooModelWithName('bar');
});

test('Can retrieve a model instance by name', () => {
	given.fooModelIntoFakeDriver();
	when.gettingModel('foo');
	then.shouldHaveReceivedFooModel();
});

test('Exposes the default driver\'s engine', () => {
	when.gettingEngine();
	then.shouldHaveReceivedFakeDriverEngine();
});

test('Can add driver that receive the current connection', () => {
	given.otherDriver();
	when.gettingOtherDriver();
	then.otherDriverShouldHaveReceivedCurrentConnection();
});

test('Exposes the engine of the specified driver', () => {
	given.otherDriver();
	when.gettingEngineOfOtherDriver();
	then.shouldHaveReceivedOtherDriverEngine();
});
