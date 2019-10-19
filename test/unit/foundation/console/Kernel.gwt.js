//--------------------------------------------------------
//-- Tests - Unit - Foundation - Console - Kernel - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container              from '../../container';
import ConsoleKernel          from '../../../../dist/node/foundation/console/Kernel';
import ConsoleServiceProvider from '../../../../dist/node/console/ConsoleServiceProvider';

let consoleKernel;
let mockExit;
let fakeException;


//-- Mocks
//--------------------------------------------------------

const fakeTerminal = {
	get argv() { return 'foo:bar'; }
};

const fakeCommandRegistrar = {
	resolve:       jest.fn(),
	addFromFolder: jest.fn()
};

const fakeExceptionHandler = {
	handle: jest.fn(),
	get hadException() { return Boolean(fakeException); }
};



//-- Given
//--------------------------------------------------------

given.emptyConsoleKernel = () => {
	consoleKernel = undefined;
};

given.consoleKernel = () => {
	consoleKernel = container.make(ConsoleKernel);
};

given.fakeCommandRegistrar = () => {
	container.singleton('command.registrar', fakeCommandRegistrar);
};

given.fakeProcessExit = () => {
	mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {}); // eslint-disable-line no-empty-function
};

given.fakeExceptionHandler = () => {
	container.singleton('exception.handler', fakeExceptionHandler);
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.exitFlag = () => {
	consoleKernel.shouldExit(true);
};

given.noExitFlag = () => {
	consoleKernel.shouldExit(false);
};

given.noException = () => {
	fakeException = undefined;
};

given.exception = () => {
	fakeException = new TypeError('An error has occurred...');
};


//-- When
//--------------------------------------------------------

when.makingConsoleKernel = () => {
	when.attempting(() => {
		container.make(ConsoleKernel);
	});
};

when.handling = async () => {
	await when.attemptingAsync(async () => {
		await consoleKernel.handle();
	});
};

when.terminating = () => {
	when.attempting(() => {
		consoleKernel.terminate();
	});
};


//-- Then
//--------------------------------------------------------

then.resetProcessExit = () => {
	mockExit.mockRestore();
};

then.consoleServiceProviderShouldHaveBeenRegistered = () => {
	then.shouldNotHaveThrown();
	expect(container.isRegistered(ConsoleServiceProvider)).toBe(true);
};

then.commandRegistrarShouldHaveResolvedCommand = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRegistrar.resolve).toHaveBeenCalledWith(fakeTerminal.argv);
};

then.shouldHaveExitedWith = (code) => {
	then.shouldNotHaveThrown();
	expect(mockExit).toHaveBeenCalledTimes(1);
	expect(mockExit).toHaveBeenCalledWith(code);
};

then.shouldNotHaveExited = () => {
	then.shouldNotHaveThrown();
	expect(mockExit).not.toHaveBeenCalled();
};


export default build({ given, when, then });
