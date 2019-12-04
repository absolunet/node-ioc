//--------------------------------------------------------
//-- Tests - Unit - Test - Services - Tester - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container from '../../container';
import Tester    from '../../../../dist/node/test/services/Tester';

let result;
let tester;


//-- Mocks
//--------------------------------------------------------

const fakeApplication = {
	make:            jest.fn((...parameters) => { return container.make(...parameters); }),
	flush:           jest.fn(),
	setEnvironment:  jest.fn(),
	environment:     'test',
	setContext:      jest.fn(),
	bootIfNotBooted: jest.fn(() => { fakeApplication.boot(); }),
	boot:            jest.fn(),
	singleton:       jest.fn(),
	getContext:      jest.fn()
};

const fakeApplicationMakeSpy = jest.fn();

const FakeApplication = class {

	static make() {
		fakeApplicationMakeSpy();

		return fakeApplication;
	}

	static setDefaultInstance() {
		//
	}

	constructor() {
		Object.keys(fakeApplication).forEach((key) => {
			this[key] = fakeApplication[key];
		});
	}

};

const fakeUnitTests = [{}, {}];
const fakeTests     = [...fakeUnitTests, {}, {}];

const FakeConsoleKernel = class {};
const OtherKernel       = class {};

const fakeTestRepository     = { all: jest.fn(() => { return fakeTests; }) };
const fakeUnitTestRepository = { all: jest.fn(() => { return fakeUnitTests; }) };

const fakeJestTestEngine = {
	beforeAll:  jest.fn(),
	beforeEach: jest.fn(),
	afterEach:  jest.fn(),
	afterAll:   jest.fn(),
	describe:   jest.fn(),
	test:       jest.fn()
};

const otherTestEngine = {
	beforeAll:  jest.fn(),
	beforeEach: jest.fn(),
	afterEach:  jest.fn(),
	afterAll:   jest.fn(),
	describe:   jest.fn(),
	test:       jest.fn()
};

const fakeTestRunner  = { run: jest.fn(), setEngine: jest.fn() };
const otherTestRunner = { run: jest.fn(), setEngine: jest.fn() };


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeApplication = () => {
	container.singleton('app', FakeApplication);
};

given.fakeConsoleKernel = () =>  {
	container.singleton('kernel', FakeConsoleKernel);
};

given.fakeTestRepository = () => {
	container.singleton('test', fakeTestRepository);
};

given.fakeUnitTestRepository = () => {
	container.singleton('test.unit', fakeUnitTestRepository);
};

given.fakeJestTestEngine = () => {
	container.singleton('test.engine.jest', fakeJestTestEngine);
};

given.fakeTestRunner = () => {
	container.singleton('test.runner', fakeTestRunner);
};

given.tester = () => {
	tester = container.make(Tester);
};

given.jestEngineForTester = () => {
	tester.setEngine(fakeJestTestEngine);
};

given.otherTestRunner = () => {
	tester.setRunner(otherTestRunner);
};


//-- When
//--------------------------------------------------------

when.booting = () => {
	when.attempting(() => {
		tester.boot();
	});
};

when.runningWithoutScope = () => {
	when.attempting(() => {
		tester.run();
	});
};

when.runningWithUnitTestRepository = () => {
	when.attempting(() => {
		tester.run('test.unit');
	});
};

when.settingEngine = () => {
	when.attempting(() => {
		tester.setEngine(otherTestEngine);
	});
};

when.creatingFreshApplication = () => {
	when.attempting(() => {
		tester.createFreshApplication();
	});
};

when.gettingRunner = () => {
	when.attempting(() => {
		result = tester.runner;
	});
};

when.settingRunner = () => {
	when.attempting(() => {
		tester.setRunner(otherTestRunner);
	});
};

when.settingKernel = () => {
	when.attempting(() => {
		tester.setKernel(container.make(OtherKernel));
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveRefreshedApplication = () => {
	then.shouldNotHaveThrown();
	expect(fakeApplicationMakeSpy).toHaveBeenCalled();
	expect(fakeApplication.setContext).toHaveBeenCalled();
	expect(fakeApplication.setEnvironment).toHaveBeenCalledWith('test');
};

then.shouldSetUpWithFreshApplication = () => {
	then.shouldNotHaveThrown();
	expect(fakeJestTestEngine.beforeEach).toHaveBeenCalled();
	fakeJestTestEngine.beforeEach.mock.calls[0][0]();
	then.shouldHaveRefreshedApplication();
};

then.shouldHaveRunTests = (tests) => {
	then.shouldNotHaveThrown();
	expect(fakeTestRunner.run).toHaveBeenCalledWith(tests);
};

then.runnerShouldHaveRunUnitTests = () => {
	then.shouldHaveRunTests(fakeUnitTests);
};

then.runnerShouldHaveRunAllTests = () => {
	then.shouldHaveRunTests(fakeTests);
};

then.engineShouldHaveChanged = () => {
	then.shouldNotHaveThrown();
	expect(tester.engine).toBe(otherTestEngine);
};

then.runnerEngineShouldHaveChanged = () => {
	then.shouldNotHaveThrown();
	expect(fakeTestRunner.setEngine).toHaveBeenCalledWith(otherTestEngine);
};

then.shouldHaveReceivedRunner = () => {
	then.shouldNotHaveThrown();
	expect(result).toBe(fakeTestRunner);
};

then.runnerInstanceShouldHaveChanged = () => {
	then.shouldNotHaveThrown();
	expect(tester.runner).toBe(otherTestRunner);
};

then.shouldHaveReceivedOtherRunner = () => {
	then.shouldNotHaveThrown();
	expect(result).toBe(otherTestRunner);
};

then.kernelShouldHaveChanged = () => {
	then.shouldNotHaveThrown();
	expect(tester.kernel).toBe(OtherKernel);
};


export default build({ given, when, then });
