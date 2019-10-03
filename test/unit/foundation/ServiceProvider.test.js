//--------------------------------------------------------
//-- Tests - Unit - Foundation - Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ServiceProvider.gwt');


test('Can load commands into the command repository', () => {
	given.fakeCommandRepository();
	given.provider();
	given.fakeCommands();
	when.loadingCommands();
	then.commandShouldHaveBeenLoaded();
});

