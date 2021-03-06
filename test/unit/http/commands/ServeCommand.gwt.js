//--------------------------------------------------------
//-- Tests - Unit - HTTP - Commands - Serve Command - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import EventEmitter  from 'events';
import container     from '../../container';
import ServeCommand  from '../../../../dist/node/http/commands/ServeCommand';
import CommandRunner from '../../../../dist/node/console/services/CommandRunner';

let command;
let commandArguments;
let commandRunner;
let mockedNodemon;
let fakeMiddlewares;
let mockedNodemonProcess;


//-- Mocks
//--------------------------------------------------------

const fakeTerminal = {
	echo:       jest.fn(),
	print:      jest.fn((...parameters) => { return fakeTerminal.echo(...parameters); }),
	echoIndent: jest.fn((...parameters) => { return fakeTerminal.echo(...parameters); }),
	spacer:     jest.fn((...parameters) => { return fakeTerminal.echo(...parameters); })
};

const fakeTranslator = {
	translate: jest.fn((key, replace = {}) => {
		return `${key} ${JSON.stringify(replace)}`;
	})
};

const fakeExpress = {
	use:    jest.fn((middleware) => { fakeMiddlewares.push(middleware); }),
	listen: jest.fn()
};

const fakeExpressRouter = jest.fn();

const fakeRouter = {
	generate: jest.fn(() => { return fakeExpressRouter; })
};

const fakeRequest = {
	get method() { return 'GET'; },
	get url()    { return '/foo/bar'; }
};
const fakeResponse = new EventEmitter();
fakeResponse.statusCode = 200;
const fakeNext     = jest.fn();

const fakeServer = {
	getInstance: jest.fn(() => { return fakeExpress; }),
	getRouter:   jest.fn(() => { return fakeExpressRouter; })
};
const fakeYargs = {
	get argv() { return { $0: 'ioc' }; }
};


//-- Given
//--------------------------------------------------------

given.mockedNodemon = () => {
	jest.mock('nodemon', () => {
		mockedNodemonProcess = {
			on: jest.fn((event, callback) => {
				if (event === 'quit') {
					setTimeout(callback);
				}
			})
		};
		mockedNodemon = jest.fn(() => { return mockedNodemonProcess; });

		return mockedNodemon;
	});
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.fakeTranslator = () => {
	container.singleton('translator', fakeTranslator);
};

given.fakeServer = () => {
	container.singleton('server', fakeServer);
	fakeMiddlewares = [];
};

given.fakeRouter = () => {
	container.singleton('router', fakeRouter);
};

given.commandRunner = () => {
	commandRunner = container.make(CommandRunner);
};

given.serveCommand = () => {
	command = container.make(ServeCommand, {
		app:      container,
		terminal: container.make('terminal')
	});
	command.wait = jest.fn(() => {
		return new Promise((resolve) => {
			setTimeout(resolve, 2);
		});
	});
	command.setYargs(fakeYargs);
};

given.noArgument = () => {
	commandArguments = {};
};

given.argument = (key, value) => {
	commandArguments[key] = value;
};

given.startSilentFlag = () => {
	given.argument('start-silent', true);
};

given.silentFlag = () => {
	given.argument('silent', true);
};

given.daemonFlag = () => {
	given.argument('daemon', true);
};

given.customPortOption = () => {
	given.argument('port', 1234);
};


//-- When
//--------------------------------------------------------

when.runningCommand = async () => {
	await when.attemptingAsync(async () => {
		const argv = Object.fromEntries([
			...command.parameters.map(([name,, defaultValue]) => {
				return [name, defaultValue];
			}),
			...command.options.map(([name, defaultValue]) => {
				return [name, defaultValue];
			})
		]);
		await commandRunner.unsafeRun(command, { ...argv, ...commandArguments });
	});
};

when.runningFakeRequest = async () => {
	await when.attemptingAsync(async () => {
		fakeMiddlewares.forEach((middleware) => { middleware(fakeRequest, fakeResponse, fakeNext); });
		fakeResponse.emit('finish');
		fakeResponse.removeAllListeners();
		await new Promise(setTimeout);
	});
};


//-- Then
//--------------------------------------------------------

then.serverShouldHaveStarted = () => {
	then.shouldNotHaveThrown();
	expect(fakeServer.getInstance).toHaveBeenCalled();
	expect(fakeExpress.use).toHaveBeenCalledWith(fakeExpressRouter);
	expect(fakeExpress.listen).toHaveBeenCalled();
};

then.serverShouldUseCustomPort = () => {
	then.serverShouldHaveStarted();
	expect(fakeExpress.listen).toHaveBeenCalledWith(1234);
};

then.shouldHaveTranslated = (key, replace) => {
	then.shouldNotHaveThrown();
	const hasTranslated = fakeTranslator.translate.mock.calls.some(([calledKey, calledReplace]) => {
		return calledKey === key && (!replace || Object.entries(replace).every(([replaceKey, replaceValue]) => {
			return calledReplace[replaceKey] === replaceValue;
		}));
	});
	expect(hasTranslated).toBe(true);
};

then.shouldHaveOutputPattern = (pattern) => {
	then.shouldNotHaveThrown();
	const hasOutputPatternAtLeastOnce = fakeTerminal.echo.mock.calls.some(([output]) => {
		return pattern.test(output);
	});
	expect(hasOutputPatternAtLeastOnce).toBe(true);
};

then.shouldHaveOutputPort = () => {
	then.shouldHaveTranslated('commands.serve.messages.starting', { port: 8080 });
	then.shouldHaveOutputPattern(/^commands\.serve\.messages\.starting \{"port":"?8080"?\}$/u);
};

then.shouldHaveOutputCustomPort = () => {
	then.shouldHaveTranslated('commands.serve.messages.starting', { port: 1234 });
	then.shouldHaveOutputPattern(/^commands\.serve\.messages\.starting \{"port":"?1234"?\}$/u);
};

then.shouldHaveOutputRouteResult = () => {
	then.shouldHaveOutputPattern(/^\[[\d/,:APM ]+\] \[200\] GET \/foo\/bar/u);
};

then.shouldNotHaveOutput = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.echo).not.toHaveBeenCalled();
};

then.nodemonShouldHaveStartedCommand = () => {
	then.shouldNotHaveThrown();
	expect(mockedNodemon).toHaveBeenCalledTimes(1);
};

then.nodemonShouldHaveStartedCommandWithStartSilentFlag = () => {
	then.nodemonShouldHaveStartedCommand();
	expect(mockedNodemon.mock.calls[0][0]).toMatch(/ --start-silent/u);
};

then.nodemonShouldHaveStartedCommandWithSilentFlag = () => {
	then.nodemonShouldHaveStartedCommand();
	expect(mockedNodemon.mock.calls[0][0]).toMatch(/ --silent/u);
};

then.nodemonShouldHaveStartedCommandWithCustomPort = () => {
	then.nodemonShouldHaveStartedCommand();
	expect(mockedNodemon.mock.calls[0][0]).toMatch(/ --port=1234/u);
};


export default build({ given, when, then });
