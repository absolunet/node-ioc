//--------------------------------------------------------
//-- Tests - Unit - Test - Test Case
//--------------------------------------------------------

import gwt from './TestCase.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.testCase();
});


test('Can resolve an abstract', () => {
	when.resolving('config');
	then.shouldHaveReceivedConfigRepositoryInstance();
});

test('Can expect that the given abstract is bound to the application', () => {
	when.expectingBound('config');
	then.testShouldPass();
});

test('Can set application instance', () => {
	when.settingFakeApplicationInstance();
	then.shouldHaveReceivedFakeApplicationInstance();
});

test('Can set engine', () => {
	when.settingFakeEngine();
	then.shouldHaveReceivedFakeEngine();
});

test('Can call initial setup method', () => {
	given.fakeEngine();
	when.calling('beforeAll');
	then.shouldNotHaveThrown();
});

test('Can call test setup method', () => {
	given.fakeEngine();
	when.calling('beforeEach');
	then.shouldNotHaveThrown();
});

test('Can call test tear down method', () => {
	given.fakeEngine();
	when.calling('afterEach');
	then.shouldNotHaveThrown();
});

test('Can call final tear down method', () => {
	given.fakeEngine();
	when.calling('afterAll');
	then.shouldNotHaveThrown();
});

test('Can do assertion through expect()', () => {
	given.fakeEngine();
	when.calling('expect');
	then.shouldHaveCalledExpect();
});

test('Can do assertion through asserts()', () => {
	given.fakeEngine();
	when.calling('assert');
	then.resultShouldBeEngineAsserts();
});

