//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Refresh Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./MigrateRefreshCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can reverse all ran migrations and call migrate command afterwards', () => {

});

test('Send seed flag to migrate command if given', () => {

});

test('Uses database prefix', () => {

});
