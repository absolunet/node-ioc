//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Handler.gwt');


beforeEach(() => {
	given.emptyResult();
	given.emptyRequest();
	given.emptyResponse();
	given.fakeLogger();
	given.fakeTerminal();
	given.exceptionHandler();
});


test('Can handle exception by reporting them and rendering them', async () => {
	given.exception();
	await when.handlingException();
	then.shouldHaveReportedException();
	then.shouldHaveRenderedExceptionInConsole();
});

test('Can render the exception in the console if no HTTP request and response object are provided', () => {
	given.exception();
	when.renderingException();
	then.shouldHaveRenderedExceptionInConsole();
});

test('Can render the exception as an HTTP response if HTTP request and response objects are provided', () => {
	given.exception();
	given.fakeRequest();
	given.fakeResponse();
	when.renderingException();
	then.shouldHaveRenderedExceptionInResponseAsContent();
});

test('Can render the exception as an HTTP response if HTTP request and response objects are provided and request expects JSON response', () => {
	given.exception();
	given.fakeRequest();
	given.fakeResponse();
	given.acceptApplicationJsonHeader();
	when.renderingException();
	then.shouldHaveRenderedExceptionInResponseAsJson();
});

test('Can report an exception', async () => {
	given.exception();
	await when.reportingException();
	then.shouldHaveReportedException();
});

test('Can handle report exception', async () => {
	given.brokenLogger();
	await when.reportingException();
	then.shouldHaveHandledReportException();
});

test('Can check if there was any exception during the process', async () => {
	await given.handledException();
	when.checkingIfExceptionWasHandled();
	then.resultShouldBe(true);
});

test('Can check if there was no exception during the process', () => {
	when.checkingIfExceptionWasHandled();
	then.resultShouldBe(false);
});

test('Can get last thrown exception', async () => {
	await given.handledException();
	when.gettingLastException();
	then.resultShouldBeFakeException();
});

