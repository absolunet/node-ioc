//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Fresh Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./MigrateFreshCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeConnectionBuilder();
	given.commandRunner();
	given.fakeTerminal();
	given.fakeConfigRepository();
	given.fakeCommandRegistrar();
	given.databasePrefix('db');
	given.migrateFreshCommand();
});


test('Can drop all tables and call migrate command afterwards', async () => {
	await when.runningCommand();
	then.shouldHaveDroppedAllTables();
	then.shouldHaveCleanedDatabase();
	then.migrateCommandShouldHaveRun();
});

test('Send seed flag to migrate command if given', async () => {
	given.seedFlag();
	await when.runningCommand();
	then.shouldHaveDroppedAllTables();
	then.shouldHaveCleanedDatabase();
	then.migrateCommandShouldHaveRunWithSeedFlag();
});

test('Uses database prefix', () => {
	given.databasePrefix('database');
	when.gettingCommandName();
	then.resultShouldStartBy('database:');
});

test('Call migrate command with appropriate prefix', async () => {
	given.databasePrefix('database');
	await when.runningCommand();
	then.migrateCommandShouldHaveRunWithPrefix('database');
});

test('Send seed flag to migrate command if requested in command with appropriate prefix', async () => {
	given.databasePrefix('database');
	given.seedFlag();
	await when.runningCommand();
	then.migrateCommandShouldHaveRunWithSeedFlagAndPrefix('database');
});
