//--------------------------------------------------------
//-- Tests - Unit - Database - Database Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./DatabaseServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.emptyResult();
});


test('Connection builder is resolvable', () => {
	when.bootingContainer();
	then.connectionBuilderIsResolvable();
});

test('Connection builder is a singleton', () => {
	when.bootingContainer();
	then.connectionBuilderIsSingleton();
});

test('Connector service is resolvable', () => {
	when.bootingContainer();
	then.connectorServiceIsResolvable();
});

test('Connector service is a singleton', () => {
	when.bootingContainer();
	then.connectorServiceIsSingleton();
});

test('Model factory is resolvable', () => {
	when.bootingContainer();
	then.modelFactoryIsResolvable();
});

test('Model factory is a singleton', () => {
	when.bootingContainer();
	then.modelFactoryIsSingleton();
});

test('Model repository is resolvable', () => {
	when.bootingContainer();
	then.modelRepositoryIsResolvable();
});

test('Model repository is a singleton', () => {
	when.bootingContainer();
	then.modelRepositoryIsSingleton();
});

test('ORM is resolvable', () => {
	when.bootingContainer();
	then.ormIsResolvable();
});

test('ORM is a singleton', () => {
	when.bootingContainer();
	then.ormIsSingleton();
});

test('Database path resolver service is resolvable', () => {
	when.bootingContainer();
	then.databasePathResolverIsResolvable();
});

test('Database path resolver service is a singleton', () => {
	when.bootingContainer();
	then.databasePathResolverIsSingleton();
});

test('Model repository has a short alias', () => {
	when.bootingContainer();
	then.modelRepositoryHasShortAlias();
});

test('"db" policy passes if the database is enabled in the configuration and the command namespace is truthy', () => {
	given.fakeConfigRepository();
	given.bootedContainer();
	given.databaseEnabledInConfiguration();
	given.commandNamespace('db');
	when.checkingIfDatabasePolicyPasses();
	then.resultShouldBe(true);
});

test('"db" policy fails if the database is disabled in the configuration and the command namespace is truthy', () => {
	given.fakeConfigRepository();
	given.bootedContainer();
	given.databaseDisabledInConfiguration();
	given.commandNamespace('db');
	when.checkingIfDatabasePolicyPasses();
	then.resultShouldBe(false);
});

test('"db" policy fails if the database is enabled in the configuration and the command namespace is falsy', () => {
	given.fakeConfigRepository();
	given.bootedContainer();
	given.databaseEnabledInConfiguration();
	given.commandNamespace('');
	when.checkingIfDatabasePolicyPasses();
	then.resultShouldBe(false);
});

test('"db" policy fails if the database is disabled in the configuration and the command namespace is falsy', () => {
	given.fakeConfigRepository();
	given.bootedContainer();
	given.databaseDisabledInConfiguration();
	given.commandNamespace('');
	when.checkingIfDatabasePolicyPasses();
	then.resultShouldBe(false);
});

test('The application models are loaded dynamically into model factory', () => {
	given.fakeModelFactory();
	given.fakeConfigRepository();
	given.fakeFileManager();
	given.fakeModelsFolderPathInConfiguration();
	given.fakeDatabasePath();
	when.bootingContainer();
	then.shouldHaveRegisteredModelFactoriesInFactory();
});

test('Does not throw if no models are present in the application', () => {
	given.fakeModelFactory();
	given.fakeConfigRepository();
	given.fakeFileManager();
	given.emptyModelsFolderPathInConfiguration();
	when.bootingContainer();
	then.shouldNotHaveRegisteredModelFactoriesInFactory();
});
