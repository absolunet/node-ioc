//--------------------------------------------------------
//-- Tests - Unit - Database - Migration
//--------------------------------------------------------

import gwt from './Migration.gwt';
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

test('Can call up method from class to the singleton with the given connection', () => {
	given.fakeInstance();
	when.callingOnClassWithConnection('up');
	then.shouldHaveCalledOnFakeInstanceWithConnection('up');
});

test('Static call to the up method results by an async call by default', () => {
	given.fakeInstance();
	when.callingOnClassWithConnection('up');
	then.resultShouldBePromise();
});

test('Can call down method from class to the singleton with the given connection', () => {
	given.fakeInstance();
	when.callingOnClassWithConnection('down');
	then.shouldHaveCalledOnFakeInstanceWithConnection('down');
});

test('Static call to the down method results by an async call by default', () => {
	given.fakeInstance();
	when.callingOnClassWithConnection('down');
	then.resultShouldBePromise();
});
