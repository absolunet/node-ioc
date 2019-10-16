//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Command Runner - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container     = require('../../container');
const CommandRunner = require('../../../../dist/node/console/services/CommandRunner');

const fakeArgv = { option: 'value', flag: true };

let commandRunner;
let command;


//-- Mocks
//--------------------------------------------------------

const fakeYargs = {};
const fakeExceptionHandler = {
	handle: jest.fn()
};
const handle      = jest.fn();
const preprocess  = jest.fn();
const postprocess = jest.fn();
const forwardCall = jest.fn();
const setArgv     = jest.fn();
const setYargs    = jest.fn();

const baseCommand = { handle, preprocess, postprocess, forwardCall, setArgv, setYargs };

const fakeCommand = {
	...baseCommand,
	get name() { return 'foo'; }
};

const fakeBrokenCommand = {
	...baseCommand,
	get name() { return 'bar'; },
	handle: jest.fn(() => { throw new TypeError('an error occurred...'); })
};

const fakeForwardingCommand = {
	...baseCommand,
	get name() { return 'baz'; },
	get forward() { return 'foo'; }
};


//-- Given
//--------------------------------------------------------

given.fakeExceptionHandler = () => {
	container.singleton('exception.handler', fakeExceptionHandler);
};

given.commandRunner = () => {
	commandRunner = container.make(CommandRunner);
};

given.command = () => {
	command = fakeCommand;
};

given.brokenCommand = () => {
	command = fakeBrokenCommand;
};

given.forwardingCommand = () => {
	command = fakeForwardingCommand;
};


//-- When
//--------------------------------------------------------

when.callingMethodOnCommandRunnerWith = async (method, parameters) => {
	await when.attemptingAsync(async () => {
		await commandRunner[method](...parameters);
	});
};

when.runningCommandWith = async (...parameters) => {
	await when.callingMethodOnCommandRunnerWith('run', [command, ...parameters]);
};

when.runningCommand = async () => {
	await when.runningCommandWith();
};

when.runningCommandWithArgv = async () => {
	await when.runningCommandWith(fakeArgv);
};

when.runningCommandWithYargs = async () => {
	await when.runningCommandWith(undefined, fakeYargs);
};

when.runningCommandUnsafely = async () => {
	await when.callingMethodOnCommandRunnerWith('unsafeRun', [command]);
};

when.preprocessingCommand = async () => {
	await when.callingMethodOnCommandRunnerWith('runPreprocess', [command]);
};

when.handlingCommand = async () => {
	await when.callingMethodOnCommandRunnerWith('runHandle', [command]);
};

when.postprocessingCommand = async () => {
	await when.callingMethodOnCommandRunnerWith('runPostprocess', [command]);
};


//-- Then
//--------------------------------------------------------

then.shouldHaveCaughtException = () => {
	then.shouldNotHaveThrown();
	expect(fakeExceptionHandler.handle).toHaveBeenCalled();
};

then.commandShouldHavePreprocessed = () => {
	then.shouldNotHaveThrown();
	expect(command.preprocess).toHaveBeenCalled();
};

then.commandShouldHaveHandled = () => {
	then.shouldNotHaveThrown();
	expect(command.handle).toHaveBeenCalled();
};

then.commandShouldHavePostprocessed = () => {
	then.shouldNotHaveThrown();
	expect(command.postprocess).toHaveBeenCalled();
};

then.commandShouldHavePreprocessedWithArgv = () => {
	then.commandShouldHavePreprocessed();
	expect(command.preprocess).toHaveBeenCalledWith(fakeArgv);
};

then.commandShouldHaveReceivedPreprocessedArgv = () => {
	then.shouldNotHaveThrown();
	expect(command.setArgv).toHaveBeenCalledWith(command.preprocess.mock.results[0].value);
};

then.commandShouldHaveReceivedYargs = () => {
	then.shouldNotHaveThrown();
	expect(command.setYargs).toHaveBeenCalledWith(fakeYargs);
};

then.commandShouldHaveBeenForwarded = () => {
	then.shouldNotHaveThrown();
	expect(command.forwardCall).toHaveBeenCalledWith(command.forward);
};


module.exports = build({ given, when, then });
