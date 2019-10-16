//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Resolver
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Resolver.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeDatabasePath();
	given.fakeConfigRepository();
	given.fakeConfigGrammar();
});

test('Bind paths from configuration on first instantiation', () => {
	given.fakePathsInConfig();
	when.makingResolver();
	then.fakePathsShouldBeBoundIntoApplication();
});

test('Paths have default values if not provided by configuration', () => {
	given.emptyPathsInConfig();
	when.makingResolver();
	then.defaultPathsShouldBeBoundIntoApplication();
});

test('Can have some paths not in config and have default values for them', () => {
	given.fakeMigrationPathInConfig();
	when.makingResolver();
	then.fakeMigrationPathShouldBeBoundIntoApplication();
	then.defaultPathsExceptMigrationShouldBeBoundIntoApplication();
});

test('Can resolve all database paths', () => {
	given.resolver();
	when.resolvingPaths();
	then.shouldHaveSamePathsAsBoundInApplication();
});

test('Can resolve a single path by type', () => {
	given.resolver();
	when.resolvingMigrationPath();
	then.shouldHaveSameMigrationPathAsBoundInApplication();
});

test('Paths are properly formatted by using the config grammar', () => {
	when.makingResolver();
	then.configGrammarShouldHaveBeenUsedForEveryPathsAsDefaultPaths();
});
