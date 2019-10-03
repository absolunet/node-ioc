//--------------------------------------------------------
//-- Tests - Unit - Test - Commands - Serve Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./TestCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.mockedChildProcess();
	given.fakeProcessArgv();
	given.fakeProcessEnv();
	given.fakeJestTestEngine();
	given.fakeTerminal();
	given.commandRunner();
	given.testCommand();
});

afterEach(() => {
	then.resetFakeSpawnProcess();
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

test('Can run test with Jest on standards test files when specified as option', async () => {
	given.standardsOption();
	await when.runningCommand();
	then.shouldRunStandardsTests();
});

test('Can run test with Jest on end-to-end test files when specified as option', async () => {
	given.endToEndOption();
	await when.runningCommand();
	then.shouldRunEndToEndTests();
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

test('Can run test with Jest on standards test files when specified as flag', async () => {
	given.standardsFlag();
	await when.runningCommand();
	then.shouldRunStandardsTests();
});

test('Can run test with Jest on end-to-end test files when specified as flag', async () => {
	given.endToEndFlag();
	await when.runningCommand();
	then.shouldRunEndToEndTests();
});

test('Cannot run test with more than one repository', async () => {
	given.unitFlag();
	given.featureFlag();
	await when.runningCommand();
	then.shouldRunUnitTests();
});
