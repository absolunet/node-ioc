//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Builder
//--------------------------------------------------------

import gwt from './Builder.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeConfigRepository();
	given.fakeConnectorService();
	given.builder();
	given.fakeConnectionAsDefaultInConfig();
	given.fakeConnectionInConfig();
	given.otherConnectionInConfig();
	given.noDriverConnectionInConfig();
	given.unexistingDriverConnectionInConfig();
});


test('Can get default connection', () => {
	when.gettingDefaultConnection();
	then.shouldHaveReceivedFakeConnection();
});

test('Can get connection by name', () => {
	when.gettingConnection('other');
	then.shouldHaveReceivedOtherConnection();
});

test('Can get connection without name and receive default connection', () => {
	when.gettingConnection(undefined);
	then.shouldHaveReceivedFakeConnection();
});

test('Throws if the connection does not exists in configuration', () => {
	when.gettingConnection('unexisting');
	then.shouldHaveThrown();
});

test('Throws if the driver was not specified in the connection configuration', () => {
	when.gettingConnection('no_driver');
	then.shouldHaveThrown();
});

test('Throws if the driver does not exists', () => {
	when.gettingConnection('unexisting_driver');
	then.shouldHaveThrown();
});

test('Can get driver for given connection', () => {
	when.gettingDriverFrom('other');
	then.shouldHaveReceivedFakeDriver();
});

test('Can get driver for default connection if name is not provided', () => {
	when.gettingDriverFrom(undefined);
	then.shouldHaveReceivedFakeDriver();
});
