//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - Environment Command
//--------------------------------------------------------

import gwt from './EnvironmentCommand.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.commandRunner();
	given.fakeTerminal();
	given.fakeTranslator();
	given.environmentCommand();
});


test('Can output environment from container value', async () => {
	given.fakeEnvironmentInContainer();
	await when.runningCommand();
	then.shouldHaveReceivedFakeEnvironment();
});
