//--------------------------------------------------------
//-- Tests - Unit - Test - Test Case - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const container = require('../container');
const TestCase  = require('../../../dist/node/test/TestCase');

let testCase;
let result;


//-- Mocks
//--------------------------------------------------------

const fakeEngine = {
	engine: {},
	path: '',
	getPathArgument: jest.fn(() => { return ''; }),
	describe: jest.fn(),
	test: jest.fn(),
	beforeAll: jest.fn(),
	beforeEach: jest.fn(),
	afterEach: jest.fn(),
	afterAll: jest.fn(),
	expect: jest.fn((...parameters) => { return expect(...parameters); }),
	assert: {}
};

const fakeApp = {
	make(...parameters) {
		return container.make(...parameters);
	},
	isBound(...parameters) {
		return container.isBound(...parameters);
	}
};



//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.testCase = () => {
	testCase = container.make(TestCase, { app: fakeApp, engine: fakeEngine });
};

given.fakeEngine = () => {
	testCase.setEngine(fakeEngine);
};


//-- When
//--------------------------------------------------------

when.resolving = (abstract) => {
	when.attempting(() => {
		result = testCase.make(abstract);
	});
};

when.expectingBound = (abstract) => {
	when.attempting(() => {
		testCase.expectBound(abstract);
	});
};

when.settingFakeApplicationInstance = () => {
	when.attempting(() => {
		testCase.setApp(fakeApp);
	});
};

when.settingFakeEngine = () => {
	when.attempting(() => {
		testCase.setEngine(fakeEngine);
	});
};

when.calling = (method) => {
	when.attempting(() => {
		result = testCase[method]();
	});
};

when.getting = (property) => {
	when.attempting(() => {
		result = testCase[property];
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveReceivedConfigRepositoryInstance = () => {
	then.resultShouldBe(container.make('config'));
};

then.testShouldPass = () => {
	then.shouldNotHaveThrown();
};

then.shouldHaveReceivedFakeApplicationInstance = () => {
	then.shouldNotHaveThrown();
	expect(testCase.app).toBe(fakeApp);
};

then.shouldHaveReceivedFakeEngine = () => {
	then.shouldNotHaveThrown();
	expect(testCase.engine).toBe(fakeEngine);
};

then.shouldHaveCalledExpect = () => {
	then.shouldNotHaveThrown();
	expect(fakeEngine.expect).toHaveBeenCalled();
};

then.resultShouldBeEngineAsserts = () => {
	then.resultShouldBe(fakeEngine.assert);
};


module.exports = build({ given, when, then });
