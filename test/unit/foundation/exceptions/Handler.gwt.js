//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container = require('../../container');
const ExceptionHandler = require('../../../../dist/node/foundation/exceptions/Handler');

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
	warning: jest.fn(),
	error:   jest.fn()
};

const fakeException = new TypeError('An error has occurred...');

const fakeRequest = {
	get: jest.fn((key) => {
		return fakeHeader[key];
	})
};
const fakeResponse = {
	status: jest.fn(),
	send:   jest.fn(),
	json:   jest.fn()
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

given.acceptApplicationJsonHeader = () => {
	fakeHeader.accept = 'application/json';
};


//-- When
//--------------------------------------------------------

when.handlingException = async () => {
	await when.attemptingAsync(async () => {
		await exceptionHandler.handle(exception, request, response);
	});
};

when.renderingException = () => {
	when.attempting(() => {
		exceptionHandler.render(exception, request, response);
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
	expect(fakeTerminal.error).toHaveBeenCalled();
};

then.shouldHaveRenderedExceptionInResponse = () => {
	then.shouldNotHaveThrown();
	expect(response.status).toHaveBeenCalledWith(500);
};

then.shouldHaveRenderedExceptionInResponseAsContent = () => {
	then.shouldHaveRenderedExceptionInResponse();
	expect(response.send).toHaveBeenCalled();
};

then.shouldHaveRenderedExceptionInResponseAsJson = () => {
	then.shouldHaveRenderedExceptionInResponse();
	expect(response.json).toHaveBeenCalled();
};

then.shouldHaveHandledReportException = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.warning).toHaveBeenCalled();
};

then.resultShouldBeFakeException = () => {
	then.resultShouldBe(fakeException);
};


module.exports = build({ given, when, then });
