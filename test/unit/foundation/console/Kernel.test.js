//--------------------------------------------------------
//-- Tests - Unit - Foundation - Console - Kernel
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Kernel.gwt');


beforeEach(() => {
	given.emptyConsoleKernel();
	given.noException();
	given.fakeProcessExit();
});

afterEach(() => {
	then.resetProcessExit();
});


test('The console service provider is registered when initializing', () => {
	given.emptyConsoleKernel();
	when.makingConsoleKernel();
	then.consoleServiceProviderShouldHaveBeenRegistered();
});

test('Handles the console command through the command registrar', async () => {
	given.fakeCommandRegistrar();
	given.fakeTerminal();
	given.consoleKernel();
	await when.handling();
	then.commandRegistrarShouldHaveResolvedCommand();
});

test('Exit process on termination if asked to with 0 if no exception were reported', () => {
	given.fakeExceptionHandler();
	given.noException();
	given.consoleKernel();
	given.exitFlag();
	when.terminating();
	then.shouldHaveExitedWith(0);
});

test('Exit process on termination if asked to with 1 if at least one exception was reported', () => {
	given.fakeExceptionHandler();
	given.exception();
	given.consoleKernel();
	given.exitFlag();
	when.terminating();
	then.shouldHaveExitedWith(1);
});

test('Does not exit process on termination if asked to', () => {
	given.consoleKernel();
	given.noExitFlag();
	when.terminating();
	then.shouldNotHaveExited();
});
