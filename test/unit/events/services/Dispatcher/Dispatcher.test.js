//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher
//--------------------------------------------------------

import gwt from './Dispatcher.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.dispatcher();
});


test('Forward calls to driver', () => {
	given.fakeDriver();
	when.callingOn();
	then.shouldHaveCalledOnOnFakeDriver();
});

test('Should have event dispatcher driver', () => {
	when.checkingIfEventDispatcherDriverExists();
	then.resultShouldBe(true);
});

test('Should have PubSubJS driver', () => {
	when.checkingIfPubSubJsDriverExists();
	then.resultShouldBe(true);
});

test('Should not have fake driver', () => {
	when.checkingIfFakeDriverExists();
	then.resultShouldBe(false);
});
