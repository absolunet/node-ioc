//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Refresh Command
//--------------------------------------------------------

import gwt from './MigrateRefreshCommand.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeConnectionBuilder();
	given.commandRunner();
	given.fakeTerminal();
	given.fakeTranslator();
	given.fakeInterceptor();
	given.fakeConfigRepository();
	given.fakeCommandRegistrar();
	given.databasePrefix('db');
	given.migrateRefreshCommand();
});


test('Can reverse all ran migrations and call migrate command afterwards', async () => {
	given.twoMigrationsToRun();
	given.twoMigrationsInFirstBatch();
	given.oneMigrationInSecondBatch();
	await when.runningCommand();
	then.threeMigrationsShouldHaveRunDown();
	then.migrateCommandShouldHaveRun();
});

test('Send seed flag to migrate command if given', async () => {
	given.seedFlag();
	given.twoMigrationsToRun();
	given.twoMigrationsInFirstBatch();
	given.oneMigrationInSecondBatch();
	await when.runningCommand();
	then.threeMigrationsShouldHaveRunDown();
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
