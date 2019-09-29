//--------------------------------------------------------
//-- Tests - Unit - Foundation - Console - Kernel - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container              = require('../../container');
const ConsoleKernel          = require('../../../../lib/foundation/console/Kernel');
const ConsoleServiceProvider = require('../../../../lib/console/ConsoleServiceProvider');

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

given.fakeCommandPath = () => {
	container.bind('path.command', '/fake/command/path');
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

then.shouldHaveLoadedCommandsFromApplication = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRegistrar.addFromFolder).toHaveBeenCalledWith(container.make('path.command'));
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


module.exports = build({ given, when, then });
