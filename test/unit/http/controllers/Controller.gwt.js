//--------------------------------------------------------
//-- Tests - Unit - HTTP - Controllers - Controller - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container  = require('../../container');
const Controller = require('../../../../dist/node/http/controllers/Controller');

let controller;
let viewModel;
let interceptorHandler;
let streamHandler;
let interceptors;
let spiedWriteStreamLineHandler;


//-- Mocks
//--------------------------------------------------------

const fakeViewFactory = {
	make: jest.fn(() => { return '<div>Some content</div>'; })
};
const fakeCommandRegistrar = {
	resolve: jest.fn(() => { return new Promise(setTimeout); })
};
const fakeInterceptor = {
	mute:   jest.fn(() => { return fakeInterceptor; }),
	unmute: jest.fn(() => { return fakeInterceptor; }),
	add:    jest.fn((interceptor) => {
		interceptors.push(interceptor);

		return fakeInterceptor;
	}),
	remove: jest.fn((interceptor) => {
		interceptors.splice(interceptors.indexOf(interceptor), 1);

		return fakeInterceptor;
	})
};
const fakeRequest = {};
const fakeResponse = {
	type:      jest.fn(() => { return fakeResponse; }),
	write:     jest.fn(() => { return fakeResponse; }),
	json:     jest.fn(() => { return fakeResponse; }),
	send:      jest.fn(() => { return fakeResponse; }),
	writeHead: jest.fn(() => { return fakeResponse; }),
	end:       jest.fn(() => { return fakeResponse; }),
	redirect:  jest.fn(() => { return fakeResponse; }),
	status:    jest.fn(() => { return fakeResponse; })
};


//-- Given
//--------------------------------------------------------

given.emptyViewModel = () => {
	viewModel = undefined;
};

given.emptyInterceptorHandler = () => {
	interceptorHandler = undefined;
};

given.emptyStreamHandler = () => {
	streamHandler = undefined;
};

given.fakeViewFactory = () => {
	container.singleton('view', fakeViewFactory);
};

given.fakeCommandRegistrar = () => {
	container.singleton('command.registrar', fakeCommandRegistrar);
};

given.fakeInterceptor = () => {
	container.singleton('terminal.interceptor', fakeInterceptor);
	interceptors = [];
};

given.controller = () => {
	controller = container.make(Controller);
	const { writeStreamLineHandler } = controller;
	spiedWriteStreamLineHandler = jest.fn((...parameters) => {
		return writeStreamLineHandler(...parameters);
	});
	controller.__defineGetter__('writeStreamLineHandler', () => {
		return spiedWriteStreamLineHandler;
	});
};

given.preparedHandling = () => {
	controller.prepareHandling(container, fakeRequest, fakeResponse);
};

given.viewModel = () => {
	viewModel = { foo: 'bar' };
};

given.streamHandler = () => {
	streamHandler = jest.fn();
};

given.writingLineStreamHandler = () => {
	streamHandler = jest.fn(() => {
		controller.writeStreamLine('Streamed content');
	});
};

given.interceptorHandler = () => {
	interceptorHandler = jest.fn();
};


//-- When
//--------------------------------------------------------

when.preparingHandling = () => {
	when.attempting(() => {
		controller.prepareHandling(container, fakeRequest, fakeResponse);
	});
};

when.sendingViewResponse = () => {
	when.attempting(() => {
		controller.view('foo.bar', viewModel);
	});
};

when.sendingJsonResponse = () => {
	when.attempting(() => {
		controller.json({ key: 'value' });
	});
};

when.streaming = async () => {
	await when.attemptingAsync(async () => {
		await controller.stream(streamHandler);
	});
};

when.writingStreamLine = () => {
	when.attempting(() => {
		controller.writeStreamLine('Some stream line');
	});
};

when.runningCommand = async () => {
	await when.attemptingAsync(async () => {
		await controller.runCommand('foo:bar', interceptorHandler);
	});
};

when.streamingCommandAndUsingTerminal = async () => {
	await when.attemptingAsync(async () => {
		const runCommandProcess = controller.streamCommand('foo:bar');
		interceptors.forEach((interceptor) => {
			interceptor('Printing something');
		});
		await runCommandProcess;
	});
};

when.sendingTemporaryRedirection = () => {
	when.attempting(() => {
		controller.redirect('/new/path');
	});
};

when.sendingPermanentRedirection = () => {
	when.attempting(() => {
		controller.permanentRedirect('/new/path');
	});
};

when.sendingStatus = (status) => {
	when.attempting(() => {
		controller.status(status);
	});
};

when.sendingOkStatus = () => {
	when.attempting(() => {
		controller.ok();
	});
};

when.sendingCreatedStatus = () => {
	when.attempting(() => {
		controller.created();
	});
};

when.sendingAcceptedStatus = () => {
	when.attempting(() => {
		controller.accepted();
	});
};

when.sendingNoContentStatus = () => {
	when.attempting(() => {
		controller.noContent();
	});
};

when.sendingBadRequestStatus = () => {
	when.attempting(() => {
		controller.badRequest();
	});
};

when.sendingUnauthorizedStatus = () => {
	when.attempting(() => {
		controller.unauthorized();
	});
};

when.sendingForbiddenStatus = () => {
	when.attempting(() => {
		controller.forbidden();
	});
};

when.sendingNotFoundStatus = () => {
	when.attempting(() => {
		controller.notFound();
	});
};

when.sendingMethodNotAllowedStatus = () => {
	when.attempting(() => {
		controller.methodNotAllowed();
	});
};

when.sendingTimeoutStatus = () => {
	when.attempting(() => {
		controller.timeout();
	});
};

when.sendingImATeapotStatus = () => {
	when.attempting(() => {
		controller.teapot();
	});
};


//-- Then
//--------------------------------------------------------

then.appShouldBeAccessible = () => {
	then.shouldNotHaveThrown();
	expect(controller.app).toBe(container);
};

then.requestShouldBeAccessible = () => {
	then.shouldNotHaveThrown();
	expect(controller.request).toBe(fakeRequest);
};

then.responseShouldBeAccessible = () => {
	then.shouldNotHaveThrown();
	expect(controller.response).toBe(fakeResponse);
};

then.shouldNotBeStreaming = () => {
	then.shouldNotHaveThrown();
	expect(controller.isStreaming).toBe(false);
};

then.shouldBeStreaming = () => {
	then.shouldNotHaveThrown();
	expect(controller.isStreaming).toBe(true);
};

then.commandShouldHaveRun = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRegistrar.resolve).toHaveBeenCalledWith('foo:bar', true);
};

then.shouldHaveSentHtmlResponse = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.type).toHaveBeenCalledWith('html');
	expect(fakeResponse.send).toHaveBeenCalled();
};

then.shouldHaveMadeViewFromFactory = () => {
	then.shouldNotHaveThrown();
	expect(fakeViewFactory.make).toHaveBeenCalled();
};

then.shouldHaveSentViewResult = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.send).toHaveBeenCalledWith(fakeViewFactory.make.mock.results[0].value);
};

then.shouldHaveMadeViewWithViewModel = () => {
	then.shouldHaveMadeViewFromFactory();
	expect(fakeViewFactory.make).toHaveBeenCalledWith('foo.bar', { foo: 'bar' });
};

then.shouldHaveSentJsonResponse = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.json).toHaveBeenCalledWith({ key: 'value' });
};

then.shouldHaveSentTextPlainResponse = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.writeHead).toHaveBeenCalled();
	expect(fakeResponse.writeHead.mock.calls[0][1]).toMatchObject({ 'Content-Type': 'text/plain' });
};

then.shouldHaveSentChunkedTransferEncodingHeader = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.writeHead.mock.calls[0][1]).toMatchObject({ 'Transfer-Encoding': 'chunked' });
};

then.responseShouldHaveEndedManually = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.end).toHaveBeenCalled();
};

then.shouldHaveWrittenContentInResponse = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.write).toHaveBeenCalled();
};

then.shouldNotHaveWrittenContentInResponse = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.write).not.toHaveBeenCalled();
};

then.interceptorShouldHaveMutedAndUnmutedBetweenCommand = () => {
	then.shouldNotHaveThrown();
	const [resolveCallOrder] = fakeCommandRegistrar.resolve.mock.invocationCallOrder;
	expect(fakeInterceptor.mute).toHaveBeenCalled();
	expect(fakeInterceptor.unmute).toHaveBeenCalled();
	expect(fakeInterceptor.mute.mock.invocationCallOrder[0]).toBeLessThan(resolveCallOrder);
	expect(fakeInterceptor.unmute.mock.invocationCallOrder[0]).toBeGreaterThan(resolveCallOrder);
};

then.interceptorShouldHaveAddedAndRemovedInterceptorBetweenCommand = () => {
	then.shouldNotHaveThrown();
	const [resolveCallOrder] = fakeCommandRegistrar.resolve.mock.invocationCallOrder;
	expect(fakeInterceptor.add).toHaveBeenCalled();
	expect(fakeInterceptor.remove).toHaveBeenCalled();
	expect(fakeInterceptor.add.mock.invocationCallOrder[0]).toBeLessThan(resolveCallOrder);
	expect(fakeInterceptor.remove.mock.invocationCallOrder[0]).toBeGreaterThan(resolveCallOrder);
};

then.interceptorHandlerShouldHaveInterceptedAndBeenRemovedBetweenCommand = () => {
	then.interceptorShouldHaveAddedAndRemovedInterceptorBetweenCommand();
	expect(fakeInterceptor.add).toHaveBeenCalledWith(interceptorHandler);
	expect(fakeInterceptor.remove).toHaveBeenCalledWith(interceptorHandler);
};

then.controllerInterceptorHandlerShouldHaveInterceptedAndBeenRemovedBetweenCommand = () => {
	then.interceptorShouldHaveAddedAndRemovedInterceptorBetweenCommand();
	expect(fakeInterceptor.add).toHaveBeenCalledWith(spiedWriteStreamLineHandler);
	expect(fakeInterceptor.remove).toHaveBeenCalledWith(spiedWriteStreamLineHandler);
};

then.shouldHaveRedirectedWithCode = (code) => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.redirect).toHaveBeenCalledWith(code, '/new/path');
};

then.shouldHaveReceivedStatus = (code) => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.status).toHaveBeenCalledWith(code);
};


module.exports = build({ given, when, then });
