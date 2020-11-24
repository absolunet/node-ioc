//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Connector - Drivers - MySQL Driver
//--------------------------------------------------------

import gwt from './MySQLDriver.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.mockedKnex();
	given.fakeConfigRepository();
	given.fakeResolver();
	given.fakeFileManager();
	given.mysqlDriver();
});


test('Specified a valid Knex client', () => {
	when.gettingClient();
	then.shouldBeValidKnexClient();
});

test('Can set connection by name', () => {
	when.settingFakeConnection('foo');
	then.shouldHaveConnection('foo');
});

test('Can set default connection', () => {
	when.settingDefaultFakeConnection();
	then.shouldHaveConnection('default');
});

test('Can check if connection exists by name', () => {
	given.fakeConnection('foo');
	when.checkingIfConnectionExists('foo');
	then.resultShouldBe(true);
});

test('Can check if connection does not exists by name', () => {
	when.checkingIfConnectionExists('foo');
	then.resultShouldBe(false);
});

test('Can get new connection with connection config', () => {
	given.connectionConfig();
	when.makingConnection();
	then.shouldNotHaveConnection('foo');
	then.resultShouldBeKnexInstanceWithConfig();
	then.resultShouldBeAwareOfCurrentDriver();
});

test('Can create connection with connection config and save it', () => {
	given.connectionConfig();
	when.creatingConnection('foo');
	then.shouldHaveConnection('foo');
	then.resultShouldBeKnexInstanceWithConfig();
	then.resultShouldBeAwareOfCurrentDriver();
});

test('Can get existing connection if exists', () => {
	given.connectionConfig();
	given.fakeConnection('foo');
	when.gettingOrCreatingConnection('foo');
	then.resultShouldBeFakeConnection();
});

test('Can get new connection if does not exists', () => {
	given.connectionConfig();
	when.gettingOrCreatingConnection('foo');
	then.resultShouldBeKnexInstanceWithConfig();
	then.resultShouldBeAwareOfCurrentDriver();
});

test('Can create Knex configuration based on given configuration, current client, resolver and configured migrations table', () => {
	given.connectionConfig();
	given.fakeMigrationTableNameInConfig();
	when.mappingConfig();
	then.shouldHaveReceivedProperKnexConfigWithFakeMigrationTableNameAndConnectionConfig();
});
