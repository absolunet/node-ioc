//--------------------------------------------------------
//-- Tests - Unit - Log - Services - Logger - Drivers - Stack Driver
//--------------------------------------------------------

import gwt from './StackDriver.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeLogger();
	given.stackDriver();
});


test('Calls configured channels', async () => {
	given.channels(['single', 'other']);
	await when.logging();
	then.fakeDriverShouldHaveLoggedTwice();
	then.brokenDriverShouldNotHaveLogged();
});

test('Prevent and log error if configured accordingly', async () => {
	given.channels(['single', 'other', 'broken']);
	given.ignoreException();
	await when.logging();
	then.shouldHaveOneCaughtError();
	then.fakeDriverShouldHaveLoggedTwice();
	then.brokenDriverShouldHaveLogged();
});

test('Prevent error without logging it if configured accordingly', async () => {
	given.channels(['single', 'broken']);
	given.noIgnoreException();
	await when.logging();
	then.shouldNotHaveCaughtError();
	then.fakeDriverShouldHaveLogged();
	then.brokenDriverShouldHaveLogged();
});

test('Prevent error without logging it if not configured', async () => {
	given.channels(['single', 'broken']);
	await when.logging();
	then.shouldNotHaveCaughtError();
	then.fakeDriverShouldHaveLogged();
	then.brokenDriverShouldHaveLogged();
});
