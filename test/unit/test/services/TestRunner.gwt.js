//--------------------------------------------------------
//-- Tests - Unit - Test - Services - Tester - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container  = require('../../container');
const TestRunner = require('../../../../src/test/services/TestRunner');

let testRunner;


//-- Mocks
//--------------------------------------------------------

const fakeEngine = {
	engine:          {},
	path:            '',
	getPathArgument: jest.fn(() => { return ''; }),
	beforeAll:       jest.fn(),
	beforeEach:      jest.fn(),
	afterEach:       jest.fn(),
	afterAll:        jest.fn(),
	describe:        jest.fn(),
	test:            jest.fn()
};

const fakeTestCase = {
	instance: {
		setApp:     jest.fn(() => { return fakeTestCase.instance; }),
		setEngine:  jest.fn(() => { return fakeTestCase.instance; }),
		beforeAll:  jest.fn(),
		beforeEach: jest.fn(),
		afterEach:  jest.fn(),
		afterAll:   jest.fn(),
		testFooBar: jest.fn(),
		testBazQux: jest.fn(),
		givenFoo:   jest.fn()
	},
	name: 'Fake test case',
	namespace: 'Test namespace',
	tests: [
		{
			method: 'testFooBar',
			description: 'Foo bar'
		},
		{
			method: 'testBazQux',
			description: 'Baz qux'
		}
	]
};
const otherTestCase = {
	instance: {
		setApp:     jest.fn(() => { return otherTestCase.instance; }),
		setEngine:  jest.fn(() => { return otherTestCase.instance; }),
		beforeAll:  jest.fn(),
		beforeEach: jest.fn(),
		afterEach:  jest.fn(),
		afterAll:   jest.fn(),
		testFoo:    jest.fn(),
		testBar:    jest.fn(),
		testBaz:    jest.fn(),
		testQux:    jest.fn(),
		givenFoo:   jest.fn()
	},
	name: 'Other test case',
	namespace: 'Test namespace',
	tests: [
		{
			method: 'testFoo',
			description: 'Foo'
		},
		{
			method: 'testBar',
			description: 'Bar'
		},
		{
			method: 'testBaz',
			description: 'Baz'
		},
		{
			method: 'testQux',
			description: 'Qux'
		}
	]
};

const fakeTestCaseCollection = [fakeTestCase, otherTestCase];


//-- Given
//--------------------------------------------------------

given.testRunner = () => {
	testRunner = container.make(TestRunner);
};

given.fakeEngine = () => {
	testRunner.setEngine(fakeEngine);
};


//-- When
//--------------------------------------------------------

when.runningTestCaseWithoutRunningEngine = () => {
	when.attempting(() => {
		testRunner.runTest(fakeTestCase);
	});
};

when.runningTestCaseCollection = () => {
	when.attempting(() => {
		testRunner.run(fakeTestCaseCollection);
		when.runningFakeEngine();
	});
};

when.runningTestCase = () => {
	when.runningTestCaseWithoutRunningEngine();
	when.runningFakeEngine();
};

when.runningFakeEngine = () => {
	when.attempting(() => {
		['describe', 'beforeAll', 'beforeEach', 'afterEach', 'afterAll', 'test'].forEach((method) => {
			for (let i = 0; i < fakeEngine[method].mock.calls.length; i++) {
				const parameters = fakeEngine[method].mock.calls[i];
				parameters.forEach((parameter) => {
					if (typeof parameter !== 'string') {
						parameter();
					}
				});
			}
		});
	});
};


//-- Then
//--------------------------------------------------------

then.testsSetupsAndTeasDownsShouldHaveRun = (testCase) => {
	then.shouldNotHaveThrown();
	expect(testCase.instance.beforeAll).toHaveBeenCalledTimes(1);
	expect(testCase.instance.beforeEach).toHaveBeenCalledTimes(1);
	expect(testCase.instance.afterEach).toHaveBeenCalledTimes(1);
	expect(testCase.instance.afterAll).toHaveBeenCalledTimes(1);
	testCase.tests.forEach(({ method }) => {
		expect(testCase.instance[method]).toHaveBeenCalledTimes(1);
	});
	expect(testCase.instance.givenFoo).not.toHaveBeenCalled();
};

then.testCaseTestsSetupsAndTearDownsShouldHaveRun = () => {
	then.testsSetupsAndTeasDownsShouldHaveRun(fakeTestCase);
};

then.testCaseTestsSetupsAndTearDownsShouldNotHaveRun = () => {
	then.shouldNotHaveThrown();
	expect(fakeTestCase.instance.beforeAll).not.toHaveBeenCalled();
	expect(fakeTestCase.instance.beforeEach).not.toHaveBeenCalled();
	expect(fakeTestCase.instance.afterEach).not.toHaveBeenCalled();
	expect(fakeTestCase.instance.afterAll).not.toHaveBeenCalled();
	fakeTestCase.tests.forEach(({ method }) => {
		expect(fakeTestCase.instance[method]).not.toHaveBeenCalled();
	});
	expect(fakeTestCase.instance.givenFoo).not.toHaveBeenCalled();
};

then.allTestCaseTestsSetupsAndTearDownsShouldHaveRun = () => {
	fakeTestCaseCollection.forEach(then.testsSetupsAndTeasDownsShouldHaveRun);
};



module.exports = build({ given, when, then });
