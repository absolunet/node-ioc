//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - Environment Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./EnvironmentCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.commandRunner();
	given.fakeTerminal();
	given.fakeInterceptorAndConsole();
	given.environmentCommand();
});

afterEach(() => {
	then.restoreConsole();
});


test('Can output environment from container value', async () => {
	given.fakeEnvironmentInContainer();
	await when.runningCommand();
	then.shouldHaveReceivedFakeEnvironment();
});
