//--------------------------------------------------------
//-- Tests - Unit - HTTP - Repositories - Controller Repository
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ControllerRepository.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.action(undefined);
	given.controllerRepository();
});


test('Can add controller with given name', () => {
	when.addingController();
	then.controllerShouldBeBindToApplication();
});

test('Can get controller from name', () => {
	given.controller();
	when.gettingControllerByName();
	then.shouldHaveReceivedController();
});

test('Can get controller from name based on application controller path', () => {
	given.fakeAppPath();
	when.gettingControllerByName();
	then.shouldHaveReceivedStubController();
});

test('Can get controller from name with namespace based on application controller path', () => {
	given.fakeAppPath();
	when.gettingControllerWithNamespaceByName();
	then.shouldHaveReceivedNamespaceStubController();
});

test('Can get controller from absolute path', () => {
	when.gettingControllerByPath();
	then.shouldHaveReceivedStubController();
});

test('Can check if controller exists in registered ones', () => {
	given.controller();
	when.checkingIfControllerExists();
	then.resultShouldBe(true);
});

test('Can check if controller does not exist in registered ones', () => {
	when.checkingIfControllerExists();
	then.resultShouldBe(false);
});

test('Can create controller group', () => {
	when.creatingGroupWithController();
	then.controllerShouldBeBindToApplicationWithPrefix();
});

test('Can resolve controller action name based on given action string', () => {
	given.action('FooController@bar');
	when.resolvingControllerActionName();
	then.resultShouldBe('bar');
});

test('Can resolve controller name based on given action string', () => {
	given.action('FooController@bar');
	when.resolvingControllerName();
	then.resultShouldBe('FooController');
});
