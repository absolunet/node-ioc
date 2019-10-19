//--------------------------------------------------------
//-- Tests - Unit - Foundation - Service Provider
//--------------------------------------------------------

import gwt from './ServiceProvider.gwt';
const { given, when, then } = gwt;


test('Can load commands into the command repository', () => {
	given.fakeCommandRepository();
	given.provider();
	given.fakeCommands();
	when.loadingCommands();
	then.commandShouldHaveBeenLoaded();
});

