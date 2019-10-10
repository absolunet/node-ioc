//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Connector
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Connector.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.connector();
});


test('Exposes sqlite driver', () => {
	when.gettingDriver('sqlite');
	then.shouldHaveReceivedSqliteDriver();
});
