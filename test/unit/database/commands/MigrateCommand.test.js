//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Command
//--------------------------------------------------------

import gwt from './MigrateCommand.gwt';
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
	given.migrateCommand();
});


test('Can run latest migrations and display ran migrations', async () => {
	given.twoMigrationsToRun();
	await when.runningCommand();
	then.shouldHaveRunMigrations();
	then.shouldHavePrintedTwoMigrations();
});

test('Displays that no migration needs to run', async () => {
	given.noMigrationsToRun();
	await when.runningCommand();
	then.shouldHaveRunMigrations();
	then.shouldHavePrintedThatNoMigrationRan();
});

test('Calls seed command if requested in command', async () => {
	given.seedFlag();
	given.twoMigrationsToRun();
	await when.runningCommand();
	then.shouldHaveRunMigrations();
	then.shouldHavePrintedTwoMigrations();
	then.seedCommandShouldHaveRun();
});

test('Uses database prefix', () => {
	given.databasePrefix('database');
	when.gettingCommandName();
	then.resultShouldStartBy('database:');
});

test('Calls seed command if requested in command with appropriate prefix', async () => {
	given.databasePrefix('database');
	given.seedFlag();
	await when.runningCommand();
	then.seedCommandShouldHaveRunWithPrefix('database');
});
