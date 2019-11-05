//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler
//--------------------------------------------------------

import gwt from './Handler.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.emptyResult();
	given.emptyRequest();
	given.emptyResponse();
	given.stringHelper();
	given.fakeConfigRepository();
	given.fakeLogger();
	given.exceptionHandler();
	given.fakeDebugHttpDriver();
	given.fakeProductionHttpDriver();
	given.fakeConsoleDriver();
});


test('Can handle exception by reporting them and rendering them', async () => {
	given.exception();
	await when.handlingException();
	then.shouldHaveReportedException();
	then.shouldHaveRenderedExceptionInConsole();
});

test('Can render the exception in the console if no HTTP request and response object are provided', async () => {
	given.exception();
	await when.renderingException();
	then.shouldHaveRenderedExceptionInConsole();
});

test('Can render the exception as an HTTP response if HTTP request and response objects are provided', async () => {
	given.exception();
	given.fakeRequest();
	given.fakeResponse();
	await when.renderingException();
	then.shouldHaveRenderedExceptionInResponse();
});

test('Can render a specific Web page as an HTTP response if HTTP request and response object are provided in a non-debug environment', async () => {
	given.exception();
	given.fakeRequest();
	given.fakeResponse();
	given.noDebugInConfiguration();
	await when.renderingException();
	then.shouldHaveRenderedExceptionInResponseThroughCustomErrorPage();
});

test('Can report an exception', async () => {
	given.exception();
	await when.reportingException();
	then.shouldHaveReportedException();
});

test('Can handle report exception in console', async () => {
	given.brokenLogger();
	await when.reportingException();
	then.shouldHaveHandledReportExceptionInConsole();
});

test('Can handle report exception in console even if requesting an HTTP response', async () => {
	given.fakeRequest();
	given.fakeResponse();
	given.brokenLogger();
	await when.reportingException();
	then.shouldHaveHandledReportExceptionInConsole();
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

