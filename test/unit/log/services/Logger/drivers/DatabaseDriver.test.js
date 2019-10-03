//--------------------------------------------------------
//-- Tests - Unit - Log - Services - Logger - Drivers - Database Driver
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./DatabaseDriver.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.freshValues();
	given.fakeDatabaseConnectionBuilder();
	given.fakeTerminal();
	given.databaseDriver();
	given.connectionConfig();
	given.message();
	given.context();
	given.queryTracker();
});

afterEach(() => {
	then.removeQueryTracker();
});

describe('Interface', () => {

	['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'].forEach((method, index) => {

		test(`Can log a ${method} message with level as string`, async () => {
			given.level(method);
			await when.logging();
			then.shouldHaveLoggedInConnectionWithLevel(index);
		});

		test(`Can log a ${method} message with level as number`, async () => {
			given.level(index);
			await when.logging();
			then.shouldHaveLoggedInConnectionWithLevel(index);
		});

	});

});


test('Can change configuration', async () => {
	given.level(0);
	await when.logging();
	when.changingForOtherConnectionInConfig();
	await when.loggingWithLevel(1);
	then.shouldHaveLoggedInConnectionWithLevel(0);
	then.shouldHaveLoggedInOtherConnectionWithLevel(1);
});

test('Deletes exceeding records when exceeding records limit based on configuration', async () => {
	given.limit(1);
	given.oneEntryInConnectionWithLevel(4);
	given.level(0);
	await when.logging();
	then.shouldHaveLoggedInConnectionWithLevel(0);
	then.shouldHaveOneEntryInConnection();
});

test('Does not delete records when not exceeding records limit based on configuration', async () => {
	given.limit(2);
	given.oneEntryInConnectionWithLevel(4);
	given.level(0);
	await when.logging();
	then.shouldHaveLoggedInConnectionWithLevel(0);
	then.shouldHaveTwoEntriesInConnection();
});

