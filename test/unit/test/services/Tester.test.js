//--------------------------------------------------------
//-- Tests - Unit - Test - Services - Tester
//--------------------------------------------------------

import gwt from './Tester.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeApplication();
	given.fakeConsoleKernel();
	given.fakeTestRepository();
	given.fakeUnitTestRepository();
	given.fakeJestTestEngine();
	given.fakeTestRunner();
	given.tester();
});


test('Can boot with a fresh application', () => {
	when.booting();
	then.shouldHaveRefreshedApplication();
});

test('Throws if running without engine', () => {
	when.runningWithoutScope();
	then.shouldHaveThrown();
});

test('Can run with a fresh application before each test', () => {
	given.jestEngineForTester();
	when.runningWithoutScope();
	then.shouldSetUpWithFreshApplication();
});

test('Can run the tests in the given repository by binding name through the test runner', () => {
	given.jestEngineForTester();
	when.runningWithUnitTestRepository();
	then.runnerShouldHaveRunUnitTests();
});

test('Can run the tests without scope from test repository through the test runner', () => {
	given.jestEngineForTester();
	when.runningWithoutScope();
	then.runnerShouldHaveRunAllTests();
});

test('Can set engine and delegate the engine to the runner at the same time', () => {
	when.settingEngine();
	then.engineShouldHaveChanged();
	then.runnerEngineShouldHaveChanged();
});

test('Can create a fresh application manually', () => {
	given.jestEngineForTester();
	when.creatingFreshApplication();
	then.shouldHaveRefreshedApplication();
});

test('Can get newly created runner', () => {
	when.gettingRunner();
	then.shouldHaveReceivedRunner();
});

test('Can set runner instance', () => {
	when.settingRunner();
	then.runnerInstanceShouldHaveChanged();
});

test('Can get existing runner', () => {
	given.otherTestRunner();
	when.gettingRunner();
	then.shouldHaveReceivedOtherRunner();
});

test('Can set kernel', () => {
	when.settingKernel();
	then.kernelShouldHaveChanged();
});
