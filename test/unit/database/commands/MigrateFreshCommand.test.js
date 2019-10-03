//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Fresh Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./MigrateFreshCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can drop all tables and call migrate command afterwards', () => {

});

test('Send seed flag to migrate command if given', () => {

});

test('Uses database prefix', () => {

});
