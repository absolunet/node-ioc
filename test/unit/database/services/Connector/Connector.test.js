//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Connector
//--------------------------------------------------------

import gwt from './Connector.gwt';
const { given, when, then } = gwt;


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


test('Exposes mysql driver', () => {
	when.gettingDriver('mysql');
	then.shouldHaveReceivedMySQLDriver();
});
