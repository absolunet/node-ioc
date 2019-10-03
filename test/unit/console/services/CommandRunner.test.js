//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Command Runner
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./CommandRunner.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeExceptionHandler();
	given.commandRunner();
});


test('Can run a command', async () => {
	given.command();
	await when.runningCommand();
	then.commandShouldHavePreprocessed();
	then.commandShouldHaveHandled();
	then.commandShouldHavePostprocessed();
});

test('Can run a command with arguments', async () => {
	given.command();
	await when.runningCommandWithArgv();
	then.commandShouldHavePreprocessedWithArgv();
	then.commandShouldHaveReceivedPreprocessedArgv();
	then.commandShouldHaveHandled();
	then.commandShouldHavePostprocessed();
});

test('Can run a command with custom yargs instance', async () => {
	given.command();
	await when.runningCommandWithYargs();
	then.commandShouldHaveReceivedYargs();
	then.commandShouldHavePreprocessed();
	then.commandShouldHaveHandled();
	then.commandShouldHavePostprocessed();
});

test('Can run a command that throws and forward the error handling to the exception handler', async () => {
	given.brokenCommand();
	await when.runningCommand();
	then.shouldHaveCaughtException();
});

test('Can run a command unsafely', async () => {
	given.command();
	await when.runningCommandUnsafely();
	then.commandShouldHavePreprocessed();
	then.commandShouldHaveHandled();
	then.commandShouldHavePostprocessed();
});

test('Can run a command that throws unsafely and throws the error', async () => {
	given.brokenCommand();
	await when.runningCommandUnsafely();
	then.shouldHaveThrown();
});

test('Can run a command preprocess method', async () => {
	given.command();
	await when.preprocessingCommand();
	then.commandShouldHavePreprocessed();
	then.commandShouldHaveReceivedPreprocessedArgv();
});

test('Can run a command handle method', async () => {
	given.command();
	await when.handlingCommand();
	then.commandShouldHaveHandled();
});

test('Can forward the call if forward is given in the command', async () => {
	given.forwardingCommand();
	await when.runningCommand();
	then.commandShouldHaveBeenForwarded();
});

test('Can run a command postprocess method', async () => {
	given.command();
	await when.postprocessingCommand();
	then.commandShouldHavePostprocessed();
});
