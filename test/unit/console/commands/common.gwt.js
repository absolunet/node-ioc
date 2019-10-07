//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - GWT
//--------------------------------------------------------
'use strict';

/* eslint-disable no-console */
const { given, when, then, build } = require('../common.gwt');

const container     = require('../../container');
const CommandRunner = require('../../../../lib/console/services/CommandRunner');
const { log: consoleLog, error: consoleError } = console;

const fakeCapture = [];

let command;
let commandRunner;
let output;


//-- Mocks
//--------------------------------------------------------

const fakeTerminal = {
	echo: jest.fn((...parameters) => {
		output.push(...parameters);
	}),
	print: jest.fn((...parameters) => {
		fakeTerminal.echo(...parameters);
	}),
	spacer: jest.fn()
};

const fakeCaptureInterceptor = {
	handler: jest.fn((...parameters) => {
		parameters.forEach((parameter) => {
			parameter.split('\n').forEach((line) => {
				fakeCapture.push(line);
				fakeTerminal.echo(line);
			});
		});
	}),
	capture: fakeCapture
};


//-- Given
//--------------------------------------------------------

given.commandRunner = () => {
	commandRunner = container.make(CommandRunner);
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
	output = [];
};

given.command = (Command) => {
	command = container.make(Command, {
		app:      container,
		terminal: container.make('terminal')
	});
};

given.fakeInterceptorAndConsole = () => {
	container.singleton('terminal.interceptor.capture', fakeCaptureInterceptor);
	fakeCapture.splice(0);
	const capture = fakeCaptureInterceptor.handler;
	console.log   = capture;
	console.error = capture;
};


//-- When
//--------------------------------------------------------

when.runningCommand = async () => {
	await when.attemptingAsync(async () => {
		await commandRunner.unsafeRun(command);
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveOutput = (expected) => {
	then.shouldNotHaveThrown();
	const hasOutput = output.some((line) => {
		return expected.constructor === RegExp ? expected.test(line) : expected === line;
	});
	expect(hasOutput).toBe(true);
};

then.restoreConsole = () => {
	console.log   = consoleLog;
	console.error = consoleError;
};


module.exports = build({ given, when, then });
/* eslint-enable no-console */
