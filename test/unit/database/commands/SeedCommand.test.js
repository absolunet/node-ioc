//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Seed Command
//--------------------------------------------------------

import gwt from './SeedCommand.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeConnectionBuilder();
	given.commandRunner();
	given.fakeTerminal();
	given.fakeInterceptor();
	given.fakeConfigRepository();
	given.fakeCommandRegistrar();
	given.databasePrefix('db');
	given.seedCommand();
});


test('Can seed database', async () => {
	given.twoSeeders();
	await when.runningCommand();
	then.shouldHaveSeeded();
	then.shouldHavePrintedTwoSeededClasses();
});

test('Uses database prefix', () => {
	given.databasePrefix('database');
	when.gettingCommandName();
	then.resultShouldStartBy('database:');
});
