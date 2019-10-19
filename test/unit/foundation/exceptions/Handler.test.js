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
	then.shouldHaveRenderedExceptionInResponseAsContent();
});

test('Can set 500 HTTP status code if generic error is thrown', async () => {
	given.exception();
	given.fakeRequest();
	given.fakeResponse();
	await when.renderingException();
	then.shouldHaveSetStatus(500);
});

test('Can set 404 HTTP status code if error contains "status" equals 404', async () => {
	given.exceptionWithStatus(404);
	given.fakeRequest();
	given.fakeResponse();
	await when.renderingException();
	then.shouldHaveSetStatus(404);
});

test('Can render the exception as an HTTP response if HTTP request and response objects are provided and request expects JSON response', async () => {
	given.exception();
	given.fakeRequest();
	given.fakeResponse();
	given.xRequestedWithHeader();
	await when.renderingException();
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

