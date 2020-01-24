//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - GWT
//--------------------------------------------------------

/* eslint-disable no-console */
import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container     from '../../container';
import CommandRunner from '../../../../dist/node/console/services/CommandRunner';
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

const fakeTranslator = {
	translate: jest.fn((key, replace = {}) => {
		return `${key} ${JSON.stringify(replace)}`;
	})
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

given.fakeTranslator = () => {
	container.singleton('translator', fakeTranslator);
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

then.shouldHaveTranslated = (...parameters) => {
	then.shouldNotHaveThrown();
	expect(fakeTranslator.translate).toHaveBeenCalledWith(...parameters);
};


export default build({ given, when, then });
/* eslint-enable no-console */
