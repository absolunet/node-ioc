//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - List Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ListCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.commandRunner();
	given.fakeTerminal();
	given.fakeInterceptorAndConsole();
	given.listCommand();
});

afterEach(() => {
	then.restoreConsole();
});


test('Can list all available commands and global options', async () => {
	await when.runningCommand();
	then.shouldHaveListedAllCommands();
});

test('Can list new command', async () => {
	given.fakeCommand();
	await when.runningCommand();
	then.shouldHaveListedAllCommands();
	then.shouldHaveListedFakeCommand();
});
