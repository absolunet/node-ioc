//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Server
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Server.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.server();
});


test('Can make an Express HTTP server instance', () => {
	when.making();
	then.shouldHaveInstance();
});

test('Can get an instance if no instance were made yet', () => {
	when.gettingInstance();
	then.shouldHaveInstance();
});

test('Can get the already made instance if already made', () => {
	given.instance();
	when.gettingInstance();
	then.shouldHaveSameInstance();
});

test('Can check if an instance was not created so far', () => {
	when.checkingIfHasInstance();
	then.resultShouldBe(false);
});

test('Can check if an instance was created so far', () => {
	given.instance();
	when.checkingIfHasInstance();
	then.resultShouldBe(true);
});

test('Can access Express module', () => {
	when.gettingExpress();
	then.shouldHaveExpressModule();
});

test('Can get router instance from Express', () => {
	given.mockedExpress();
	when.gettingRouter();
	then.shouldHaveReceivedExpressRouter();
});
