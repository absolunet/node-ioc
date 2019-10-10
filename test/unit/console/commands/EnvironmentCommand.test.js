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
	given.environmentCommand();
});


test('Can output environment from container value', async () => {
	given.fakeEnvironmentInContainer();
	await when.runningCommand();
	then.shouldHaveReceivedFakeEnvironment();
});
