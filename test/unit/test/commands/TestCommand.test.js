//--------------------------------------------------------
//-- Tests - Unit - Test - Commands - Serve Command
//--------------------------------------------------------

import gwt from './TestCommand.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeProcessArgv();
	given.fakeProcessEnv();
	given.fakeJestTestEngine();
	given.fakeTerminal();
	given.commandRunner();
	given.testCommand();
});

afterEach(() => {
	then.resetProcessArgv();
	then.resetProcessEnv();
});


test('Can run test with Jest on all files', async () => {
	await when.runningCommand();
	then.shouldRunAllTests();
});

test('Can run test with Jest on all files when specified', async () => {
	given.allFlag();
	await when.runningCommand();
	then.shouldRunAllTests();
});

test('Can run test with Jest on unit test files when specified as option', async () => {
	given.unitOption();
	await when.runningCommand();
	then.shouldRunUnitTests();
});

test('Can run test with Jest on feature test files when specified as option', async () => {
	given.featureOption();
	await when.runningCommand();
	then.shouldRunFeatureTests();
});

test('Can run test with Jest on end-to-end test files when specified as option', async () => {
	given.endToEndOption();
	await when.runningCommand();
	then.shouldRunEndToEndTests();
});

test('Can run test with Jest on integration test files when specified as option', async () => {
	given.integrationOption();
	await when.runningCommand();
	then.shouldRunIntegrationTests();
});

test('Can run test with Jest on unit test files when specified as flag', async () => {
	given.unitFlag();
	await when.runningCommand();
	then.shouldRunUnitTests();
});

test('Can run test with Jest on feature test files when specified as flag', async () => {
	given.featureFlag();
	await when.runningCommand();
	then.shouldRunFeatureTests();
});

test('Can run test with Jest on end-to-end test files when specified as flag', async () => {
	given.endToEndFlag();
	await when.runningCommand();
	then.shouldRunEndToEndTests();
});

test('Can run test with Jest on integration test files when specified as flag', async () => {
	given.integrationFlag();
	await when.runningCommand();
	then.shouldRunIntegrationTests();
});

test('Cannot run test with more than one repository', async () => {
	given.unitFlag();
	given.featureFlag();
	await when.runningCommand();
	then.shouldRunUnitTests();
});
