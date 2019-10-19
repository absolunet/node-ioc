//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - HTTP Error Mapper
//--------------------------------------------------------

import gwt from './HttpErrorMapper.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.emptyResult();
	given.status(undefined);
	given.httpErrorMapper();
});


test('Can get all basic HTTP error mapped with code', () => {
	when.gettingErrorMapping();
	then.shouldHaveReceivedErrorMapping();
});

test('Can get "Bad Request" error class based on 400 HTTP status code', () => {
	given.status(400);
	when.gettingErrorFromHttpStatus();
	then.resultShouldBeBadRequestHttpError();
});

test('Can get "Unauthorized" error class based on 401 HTTP status code', () => {
	given.status(401);
	when.gettingErrorFromHttpStatus();
	then.resultShouldBeUnauthorizedHttpError();
});

test('Can get "Forbidden" error class based on 403 HTTP status code', () => {
	given.status(403);
	when.gettingErrorFromHttpStatus();
	then.resultShouldBeForbiddenHttpError();
});

test('Can get "Not Found" error class based on 404 HTTP status code', () => {
	given.status(404);
	when.gettingErrorFromHttpStatus();
	then.resultShouldBeNotFoundHttpError();
});

test('Can get "Method Not Allowed" error class based on 405 HTTP status code', () => {
	given.status(405);
	when.gettingErrorFromHttpStatus();
	then.resultShouldBeMethodNotAllowedHttpError();
});

test('Can get "Timeout" error class based on 408 HTTP status code', () => {
	given.status(408);
	when.gettingErrorFromHttpStatus();
	then.resultShouldBeTimeoutHttpError();
});

test('Can get "Bad Request" error based on 400 HTTP status code', () => {
	given.status(400);
	when.gettingErrorInstanceFromHttpStatus();
	then.resultShouldBeInstanceOfBadRequestHttpError();
});

test('Can get "Unauthorized" error based on 401 HTTP status code', () => {
	given.status(401);
	when.gettingErrorInstanceFromHttpStatus();
	then.resultShouldBeInstanceOfUnauthorizedHttpError();
});

test('Can get "Forbidden" error based on 403 HTTP status code', () => {
	given.status(403);
	when.gettingErrorInstanceFromHttpStatus();
	then.resultShouldBeInstanceOfForbiddenHttpError();
});

test('Can get "Not Found" error based on 404 HTTP status code', () => {
	given.status(404);
	when.gettingErrorInstanceFromHttpStatus();
	then.resultShouldBeInstanceOfNotFoundHttpError();
});

test('Can get "Method Not Allowed" error based on 405 HTTP status code', () => {
	given.status(405);
	when.gettingErrorInstanceFromHttpStatus();
	then.resultShouldBeInstanceOfMethodNotAllowedHttpError();
});

test('Can get "Timeout" error based on 408 HTTP status code', () => {
	given.status(408);
	when.gettingErrorInstanceFromHttpStatus();
	then.resultShouldBeInstanceOfTimeoutHttpError();
});

test('Can get "Bad Request" default error message based on 400 HTTP status code', () => {
	given.status(400);
	when.gettingDefaultMessageFromHttpStatus();
	then.resultShouldBe('Bad Request.');
});

test('Can get "Unauthorized" default error message based on 401 HTTP status code', () => {
	given.status(401);
	when.gettingDefaultMessageFromHttpStatus();
	then.resultShouldBe('Unauthorized.');
});

test('Can get "Forbidden" default error message based on 403 HTTP status code', () => {
	given.status(403);
	when.gettingDefaultMessageFromHttpStatus();
	then.resultShouldBe('Forbidden.');
});

test('Can get "Not Found" default error message based on 404 HTTP status code', () => {
	given.status(404);
	when.gettingDefaultMessageFromHttpStatus();
	then.resultShouldBe('Not Found.');
});

test('Can get "Method Not Allowed" default error message based on 405 HTTP status code', () => {
	given.status(405);
	when.gettingDefaultMessageFromHttpStatus();
	then.resultShouldBe('Method Not Allowed.');
});

test('Can get "Timeout" default error message based on 408 HTTP status code', () => {
	given.status(408);
	when.gettingDefaultMessageFromHttpStatus();
	then.resultShouldBe('Timeout.');
});

