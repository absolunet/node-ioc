//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Rollback Command
//--------------------------------------------------------

import gwt from './MigrateRollbackCommand.gwt';
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
	given.migrateRollbackCommand();
});


test('Can rollback previous migrations', async () => {
	given.twoMigrationsInFirstBatch();
	given.oneMigrationInSecondBatch();
	await when.runningCommand();
	then.oneMigrationShouldHaveRunDown();
	then.shouldHaveTwoMigrationsInOneBatchRemaining();
});

test('Indicates that no migration can be rolled back', async () => {
	await when.runningCommand();
	then.noMigrationShouldHaveRunDown();
});

test('Uses database prefix', () => {
	given.databasePrefix('database');
	when.gettingCommandName();
	then.resultShouldStartBy('database:');
});
