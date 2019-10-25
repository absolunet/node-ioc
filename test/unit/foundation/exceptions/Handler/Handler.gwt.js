//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler - GWT
//--------------------------------------------------------

import gwt from '../../common.gwt';
const { given, when, then, build } = gwt;

import container        from '../../../container';
import ExceptionHandler from '../../../../../dist/node/foundation/exceptions/Handler';
import StringHelper     from '../../../../../dist/node/support/helpers/StringHelper';


let exceptionHandler;
let result;
let exception;
let request;
let response;


//-- Mocks
//--------------------------------------------------------

const fakeException   = new TypeError('An error has occurred...');
const loggerException = new TypeError('A logger error has occurred...');

const fakeLogger = {
	error: jest.fn()
};

const brokenLogger = {
	error: jest.fn(() => { throw loggerException; })
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


const fakeRequest = {};

const fakeResponse = {
	status:    jest.fn(),
	write:     jest.fn(),
	json:      jest.fn(),
	setHeader: jest.fn(),
	writeHead: jest.fn(),
	end:       jest.fn()
};

const fakeDebugHttpDriver = {
	render: jest.fn()
};

const fakeProductionHttpDriver = {
	render: jest.fn()
};

const fakeConsoleDriver = {
	render: jest.fn()
};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.emptyRequest = () => {
	request = undefined;
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

given.fakeDebugHttpDriver = () => {
	exceptionHandler.addDriver('http.debug', fakeDebugHttpDriver);
};

given.fakeProductionHttpDriver = () => {
	exceptionHandler.addDriver('http.production', fakeProductionHttpDriver);
};

given.fakeConsoleDriver = () => {
	exceptionHandler.addDriver('console', fakeConsoleDriver);
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
};

given.fakeResponse = () => {
	response = fakeResponse;
};

given.handledException = async () => {
	await exceptionHandler.handle(fakeException);
};

given.productionEnvironment = () => {
	container.setEnvironment('production');
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

then.resetEnvironment = () => {
	container.setEnvironment(process.env.NODE_ENV); // eslint-disable-line no-process-env
};

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveReportedException = () => {
	then.shouldNotHaveThrown();
	expect(fakeLogger.error).toHaveBeenCalled();
};

then.shouldHaveSetStatus = (status) => {
	then.shouldNotHaveThrown();
	expect(response.status).toHaveBeenCalledWith(status);
};

then.shouldHaveRenderedExceptionInConsole = () => {
	then.shouldNotHaveThrown();
	expect(fakeConsoleDriver.render).toHaveBeenCalledWith(exception);
};

then.shouldHaveRenderedExceptionInResponse = () => {
	then.shouldHaveSetStatus(500);
	expect(fakeDebugHttpDriver.render).toHaveBeenCalledWith(exception, fakeRequest, fakeResponse);
};

then.shouldHaveRenderedExceptionInResponseThroughCustomErrorPage = () => {
	then.shouldHaveSetStatus(500);
	expect(fakeProductionHttpDriver.render).toHaveBeenCalledWith(exception, fakeRequest, fakeResponse);
};

then.shouldHaveHandledReportExceptionInConsole = () => {
	then.shouldNotHaveThrown();
	expect(fakeConsoleDriver.render).toHaveBeenCalledWith(loggerException);
};

then.shouldHaveHandledReportException = () => {
	then.shouldNotHaveThrown();
	expect(fakeConsoleDriver.render).toHaveBeenCalledWith(loggerException);
};

then.resultShouldBeFakeException = () => {
	then.resultShouldBe(fakeException);
};


export default build({ given, when, then });
