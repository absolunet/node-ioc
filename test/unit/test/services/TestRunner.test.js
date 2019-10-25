//--------------------------------------------------------
//-- Tests - Unit - Test - Services - Test Runner
//--------------------------------------------------------

import gwt from './TestRunner.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.testRunner();
	given.fakeEngine();
});


test('Can run test collection', () => {
	when.runningTestCaseCollection();
	then.allTestCaseTestsSetupsAndTearDownsShouldHaveRun();
});

test('Can run single test from given model', () => {
	when.runningTestCase();
	then.testCaseTestsSetupsAndTearDownsShouldHaveRun();
});

test('Running single test without running engine does not call test case methods', () => {
	when.runningTestCaseWithoutRunningEngine();
	then.testCaseTestsSetupsAndTearDownsShouldNotHaveRun();
});
