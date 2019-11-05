//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler drivers - Ouch Driver - GWT
//--------------------------------------------------------

import gwt from '../../../common.gwt';
const { given, when, then, build } = gwt;

import container  from '../../../../container';
import OuchDriver from '../../../../../../dist/node/foundation/exceptions/Handler/drivers/OuchDriver';

let ouchDriver;
let exception;
let request;
let response;
let fakeHeaders;
let fakeConfig;


//-- Mocks
//--------------------------------------------------------

const fakeConfigRepository = {
	get: jest.fn((key, defaultValue = null) => {
		return fakeConfig[key] || defaultValue;
	})
};

const mockedPrettyPageHandler = {
	addEditor: jest.fn()
};

const mockedJsonResponseHandler = {};

const mockedOuch = {
	pushHandler:     jest.fn(),
	handleException: jest.fn((a, b, c, closure) => {
		closure([JSON.stringify({
			type:    'TypeError',
			message: 'An error has occurred...',
			file:    '/path/to/file.js',
			line:    12,
			trace: [
				{
					'file':     '/path/to/file.js',
					'line':     12,
					'function': '<#anonymous>',
					'class':    ''
				}
			]
		})]);
	}),
	clearHandlers:   jest.fn()
};

const mockedOuchConstructor = jest.fn(() => {
	return mockedOuch;
});

mockedOuchConstructor.handlers = {
	PrettyPageHandler: jest.fn(() => {
		return mockedPrettyPageHandler;
	}),
	JsonResponseHandler: jest.fn(() => {
		return mockedJsonResponseHandler;
	})
};

const fakeException = new TypeError('An error has occurred...');

const fakeRequest = {
	get: jest.fn((key) => {
		return fakeHeaders[key];
	})
};

const fakeResponse = {
	json: jest.fn()
};


//-- Given
//--------------------------------------------------------

given.bootedContainer = () => {
	container.bootIfNotBooted();
};

given.mockedOuch = () => {
	jest.mock('ouch', () => {
		return mockedOuchConstructor;
	});
};

given.fakeException = () => {
	exception = fakeException;
};

given.fakeRequest = () => {
	request = fakeRequest;
	fakeHeaders = {};
};

given.fakeResponse = () => {
	response = fakeResponse;
};

given.fakeConfigRepository = () => {
	container.singleton('config', fakeConfigRepository);
	fakeConfig = {
		'app.debug': true,
		'app': {
			debug: true
		}
	};
};

given.ouchDriver = () => {
	ouchDriver = container.make(OuchDriver);
};

given.acceptApplicationJsonHeader = () => {
	fakeHeaders.accept = 'application/json';
};

given.xRequestedWitXmlHttpRequesthHeader = () => {
	fakeHeaders['x-requested-with'] = 'XmlHttpRequest';
};

given.noDebugInConfiguration = () => {
	fakeConfig['app.debug'] = false;
	fakeConfig.app.debug    = false;
};


//-- When
//--------------------------------------------------------

when.renderingException = async () => {
	await when.attemptingAsync(async () => {
		await ouchDriver.render(exception, request, response);
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveRenderedResponse = () => {
	then.shouldNotHaveThrown();
	expect(mockedOuch.pushHandler).toHaveBeenCalledTimes(1);
	expect(mockedOuch.handleException).toHaveBeenCalledTimes(1);
	expect(mockedOuch.handleException.mock.calls[0][0]).toBe(exception);
	expect(mockedOuch.handleException.mock.calls[0][1]).toBe(request);
	expect(mockedOuch.handleException.mock.calls[0][2]).toBe(response);
	expect(typeof mockedOuch.handleException.mock.calls[0][3]).toBe('function');
	expect(mockedOuch.clearHandlers).toHaveBeenCalledTimes(1);
};

then.shouldHaveRenderedHtmlException = () => {
	then.shouldHaveRenderedResponse();
	expect(mockedOuchConstructor.handlers.PrettyPageHandler).toHaveBeenCalledWith('blue', undefined, undefined);
	expect(mockedPrettyPageHandler.addEditor).toHaveBeenCalledTimes(9);
	expect(mockedOuch.pushHandler).toHaveBeenCalledWith(mockedPrettyPageHandler);
};

then.shouldHaveRenderedJsonException = () => {
	then.shouldHaveRenderedResponse();
	expect(mockedOuchConstructor.handlers.JsonResponseHandler).toHaveBeenCalledWith(undefined, true, false);
	expect(mockedOuch.pushHandler).toHaveBeenCalledWith(mockedJsonResponseHandler);
	expect(response.json).toHaveBeenCalledTimes(1);
	expect(response.json.mock.calls[0][0]).toMatchObject({
		type:    'TypeError',
		message: 'An error has occurred...'
	});
};

then.shouldHaveRenderedJsonExceptionWithStackTrace = () => {
	then.shouldHaveRenderedJsonException();
	expect(response.json.mock.calls[0][0]).toHaveProperty('trace');
};

then.shouldHaveRenderedJsonExceptionWithOnly = (expected) => {
	then.shouldHaveRenderedJsonException();
	expect(Object.keys(response.json.mock.calls[0][0])).toStrictEqual(expected);
};


export default build({ given, when, then });
