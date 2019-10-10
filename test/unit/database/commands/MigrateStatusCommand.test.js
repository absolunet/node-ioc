//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Status Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./MigrateStatusCommand.gwt');


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
	given.migrateStatusCommand();
});


test('Can show migration status from connection driver', async () => {
	given.twoMigrationsInFirstBatch();
	given.twoMigrationsToRun();
	await when.runningCommand();
	then.shouldHavePrintedTwoRanMigrationsAndTwoPendingMigrations();
});

test('Uses database prefix', () => {
	given.databasePrefix('database');
	when.gettingCommandName();
	then.resultShouldStartBy('database:');
});
