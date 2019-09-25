//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - Environment Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./EnvironmentCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can output environment from container value', () => {

});
