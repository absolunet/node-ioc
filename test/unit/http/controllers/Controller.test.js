//--------------------------------------------------------
//-- Tests - Unit - HTTP - Controllers - Controller
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Controller.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.emptyViewModel();
	given.emptyInterceptorHandler();
	given.emptyStreamHandler();
	given.bootedContainer();
	given.fakeViewFactory();
	given.fakeCommandRegistrar();
	given.fakeInterceptor();
	given.controller();
});


test('Can prepare handling', () => {
	when.preparingHandling();
	then.appShouldBeAccessible();
	then.requestShouldBeAccessible();
	then.responseShouldBeAccessible();
	then.shouldNotBeStreaming();
});

describe('With prepared handling', () => {

	beforeEach(() => {
		given.preparedHandling();
	});


	test('Can send view response', () => {
		when.sendingViewResponse();
		then.shouldHaveSentHtmlResponse();
		then.shouldHaveMadeViewFromFactory();
		then.shouldHaveSentViewResult();
	});

	test('Can send view response with view-model', () => {
		given.viewModel();
		when.sendingViewResponse();
		then.shouldHaveSentHtmlResponse();
		then.shouldHaveMadeViewFromFactory();
		then.shouldHaveMadeViewWithViewModel();
		then.shouldHaveSentViewResult();
	});

	test('Can send JSON response', () => {
		when.sendingJsonResponse();
		then.shouldHaveSentJsonResponse();
	});

	test('Can stream with a given handler', async () => {
		given.streamHandler();
		await when.streaming();
		then.shouldBeStreaming();
		then.shouldHaveSentTextPlainResponse();
		then.shouldHaveSentChunkedTransferEncodingHeader();
		then.responseShouldHaveEndedManually();
	});

	test('Can write line in current stream', async () => {
		given.writingLineStreamHandler();
		await when.streaming();
		then.shouldBeStreaming();
		then.shouldHaveSentTextPlainResponse();
		then.shouldHaveSentChunkedTransferEncodingHeader();
		then.shouldHaveWrittenContentInResponse();
		then.responseShouldHaveEndedManually();
	});

	test('Writing line while not in a stream does not impact response', () => {
		when.writingStreamLine();
		then.shouldNotHaveWrittenContentInResponse();
		then.shouldNotBeStreaming();
	});

	test('Can run command', async () => {
		await when.runningCommand();
		then.commandShouldHaveRun();
	});

	test('Can run command with an output handler', async () => {
		given.interceptorHandler();
		await when.runningCommand();
		then.commandShouldHaveRun();
		then.interceptorShouldHaveMutedAndUnmutedBetweenCommand();
		then.interceptorHandlerShouldHaveInterceptedAndBeenRemovedBetweenCommand();
	});

	test('Can stream command output while running it in background', async () => {
		await when.streamingCommandAndUsingTerminal();
		then.commandShouldHaveRun();
		then.shouldHaveSentTextPlainResponse();
		then.shouldHaveSentChunkedTransferEncodingHeader();
		then.shouldHaveWrittenContentInResponse();
		then.interceptorShouldHaveMutedAndUnmutedBetweenCommand();
		then.controllerInterceptorHandlerShouldHaveInterceptedAndBeenRemovedBetweenCommand();
	});

	test('Can send temporary redirect response', () => {
		when.sendingTemporaryRedirection();
		then.shouldHaveRedirectedWithCode(302);
	});

	test('Can send permanent redirect response', () => {
		when.sendingPermanentRedirection();
		then.shouldHaveRedirectedWithCode(301);
	});

	test('Can set HTTP response status', () => {
		when.sendingStatus(201);
		then.shouldHaveReceivedStatus(201);
	});

	test('Can send OK status', () => {
		when.sendingOkStatus();
		then.shouldHaveReceivedStatus(200);
	});

	test('Can send Created status', () => {
		when.sendingCreatedStatus();
		then.shouldHaveReceivedStatus(201);
	});

	test('Can send Accepted status', () => {
		when.sendingAcceptedStatus();
		then.shouldHaveReceivedStatus(202);
	});

	test('Can send no Content status', () => {
		when.sendingNoContentStatus();
		then.shouldHaveReceivedStatus(204);
	});

	test('Can send Bad Request status', () => {
		when.sendingBadRequestStatus();
		then.shouldHaveReceivedStatus(400);
	});

	test('Can send Unauthorized status', () => {
		when.sendingUnauthorizedStatus();
		then.shouldHaveReceivedStatus(401);
	});

	test('Can send Forbidden status', () => {
		when.sendingForbiddenStatus();
		then.shouldHaveReceivedStatus(403);
	});

	test('Can send Not Found status', () => {
		when.sendingNotFoundStatus();
		then.shouldHaveReceivedStatus(404);
	});

	test('Can send Method Not Allowed status', () => {
		when.sendingMethodNotAllowedStatus();
		then.shouldHaveReceivedStatus(405);
	});

	test('Can send Timeout status', () => {
		when.sendingTimeoutStatus();
		then.shouldHaveReceivedStatus(408);
	});

	test('Can send I\'m A Teapot status', () => {
		when.sendingImATeapotStatus();
		then.shouldHaveReceivedStatus(418);
	});

});
