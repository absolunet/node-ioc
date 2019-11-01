//--------------------------------------------------------
//-- Tests - Unit - Database - Seeder
//--------------------------------------------------------

import gwt from './Seeder.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
});


test('Can get singleton instance from class', () => {
	given.fakeInstance();
	when.gettingInstance();
	then.resultShouldBeFakeInstance();
});

test('Can call seed method from class to the singleton with the given connection', async () => {
	given.fakeInstance();
	await when.callingOnClassWithConnection('seed');
	then.shouldHaveCalledOnFakeInstanceWithConnection('seed');
});

test('Static call to the seed method results by an async call by default', async () => {
	given.fakeInstance();
	await when.callingSyncOnClassWithConnection('seed');
	then.resultShouldBePromise();
});

test('Can run other database seeders by file name', async () => {
	given.fakeInstance();
	given.fakeSeederPath();
	given.otherSeederInSeederPath();
	await when.runningOtherSeederByName();
	then.shouldHaveRunOtherSeeder();
});

test('Can run other database seeders by class', async () => {
	given.fakeInstance();
	await when.runningOtherSeederByReference();
	then.shouldHaveRunOtherSeeder();
});
