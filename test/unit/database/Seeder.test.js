//--------------------------------------------------------
//-- Tests - Unit - Database - Seeder
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Seeder.gwt');


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

test('Can call seed method from class to the singleton with the given connection', () => {
	given.fakeInstance();
	when.callingOnClassWithConnection('seed');
	then.shouldHaveCalledOnFakeInstanceWithConnection('seed');
});

test('Static call to the seed method results by an async call by default', () => {
	given.fakeInstance();
	when.callingOnClassWithConnection('seed');
	then.resultShouldBePromise();
});
