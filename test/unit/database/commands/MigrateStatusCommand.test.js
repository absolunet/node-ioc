//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Status Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./MigrateStatusCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can show migration status from connection driver', () => {

});

test('Uses database prefix', () => {

});
