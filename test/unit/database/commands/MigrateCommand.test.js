//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./MigrateCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can run latest migrations and display ran migrations', () => {

});

test('Displays that no migration needs to run', () => {

});

test('Calls seed command if requested in command', () => {

});

test('Uses database prefix', () => {

});
