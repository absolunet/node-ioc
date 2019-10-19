//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container        from '../../container';
import ExceptionHandler from '../../../../dist/node/foundation/exceptions/Handler';
import StringHelper     from '../../../../dist/node/support/helpers/StringHelper';


let exceptionHandler;
let result;
let exception;
let request;
let response;
let fakeHeader;


//-- Mocks
//--------------------------------------------------------

const fakeLogger = {
	error: jest.fn()
};

const brokenLogger = {
	error: jest.fn(() => { throw new TypeError('An error has occurred...'); })
};

const fakeTerminal = {
	echo:   jest.fn(),
	spacer: jest.fn(),
	defaults: {
		get textColor() {
			return fakeTerminal.chalk.blue;
		},
		get indent() {
			return 2;
		}
	},
	get chalk() {
		return require('chalk'); // eslint-disable-line global-require
	}
};

const fakeException = new TypeError('An error has occurred...');

const fakeRequest = {
	get: jest.fn((key) => { return fakeHeader[key]; }),
	get headers()         { return { ...fakeHeader }; },
	get url()             { return '/'; },
	get method()          { return 'GET'; },
	get body()            { return {}; },
	connection: {
		encrypted: false,
		remoteAddress: '127.0.0.1',
		remotePort: 80
	}
};

const fakeResponse = {
	status:    jest.fn(),
	write:     jest.fn(),
	json:      jest.fn(),
	setHeader: jest.fn(),
	writeHead: jest.fn(),
	end:       jest.fn()
};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.emptyRequest = () => {
	request    = undefined;
	fakeHeader = undefined;
};

given.emptyResponse = () => {
	response = undefined;
};

given.stringHelper = () => {
	container.singleton('helper.string', StringHelper);
};

given.fakeLogger = () => {
	container.singleton('log', fakeLogger);
};

given.brokenLogger = () => {
	container.singleton('log', brokenLogger);
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.exceptionHandler = () => {
	exceptionHandler = container.make(ExceptionHandler);
};

given.exception = () => {
	exception = fakeException;
};

given.exceptionWithMessage = (message) => {
	exception = new TypeError(message);
};

given.exceptionWithStatus = (code) => {
	exception = new TypeError('An error has occurred...');
	exception.status = code;
};

given.fakeRequest = () => {
	request = fakeRequest;
	fakeHeader = {
		accept: 'text/html'
	};
};

given.fakeResponse = () => {
	response = fakeResponse;
};

given.handledException = async () => {
	await exceptionHandler.handle(fakeException);
};

given.xRequestedWithHeader = () => {
	fakeHeader['x-requested-with'] = 'XmlHttpRequest';
};


//-- When
//--------------------------------------------------------

when.handlingException = async () => {
	await when.attemptingAsync(async () => {
		await exceptionHandler.handle(exception, request, response);
	});
};

when.renderingException = async () => {
	await when.attemptingAsync(async () => {
		await exceptionHandler.render(exception, request, response);
	});
};

when.reportingException = async () => {
	await when.attemptingAsync(async () => {
		await exceptionHandler.report(exception);
	});
};

when.checkingIfExceptionWasHandled = () => {
	when.attempting(() => {
		result = exceptionHandler.hadException;
	});
};

when.gettingLastException = () => {
	when.attempting(() => {
		result = exceptionHandler.lastException;
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveReportedException = () => {
	then.shouldNotHaveThrown();
	expect(fakeLogger.error).toHaveBeenCalled();
};

then.shouldHaveRenderedExceptionInConsole = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.spacer).toHaveBeenCalled();
	expect(fakeTerminal.echo).toHaveBeenCalled();
};

then.shouldHaveSetStatus = (status) => {
	then.shouldNotHaveThrown();
	expect(response.status).toHaveBeenCalledWith(status);
};

then.shouldHaveRenderedExceptionInResponse = () => {
	then.shouldHaveSetStatus(500);
};

then.shouldHaveRenderedExceptionInResponseAsContent = () => {
	then.shouldHaveRenderedExceptionInResponse();
	expect(response.end).toHaveBeenCalled();
};

then.shouldHaveRenderedExceptionInResponseAsJson = () => {
	then.shouldHaveRenderedExceptionInResponse();
	expect(response.json).toHaveBeenCalled();
};

then.shouldHaveHandledReportException = () => {
	then.shouldHaveRenderedExceptionInConsole();
};

then.resultShouldBeFakeException = () => {
	then.resultShouldBe(fakeException);
};


export default build({ given, when, then });
