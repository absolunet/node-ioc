//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Handler - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import EventEmitter from 'events';
import container    from '../../container';
import Handler      from '../../../../dist/node/http/services/Handler';
import Route        from '../../../../dist/node/http/Route';

let handler;
let result;
let fakeConfig;
let fakeControllers;
let route;


//-- Mocks
//--------------------------------------------------------

const fakeConfigRepository = {
	get: jest.fn((key, defaultValue) => {
		return fakeConfig[key] || defaultValue;
	})
};

const fakeControllerRepository = {
	get: jest.fn((action) => {
		return fakeControllers[fakeControllerRepository.resolveName(action)];
	}),
	resolveAction: jest.fn((action) => {
		return action.split('@')[1];
	}),
	resolveName: jest.fn((action) => {
		return action.split('@')[0];
	})
};

const fakeExceptionHandler = {
	handle: jest.fn(() => { return Promise.resolve(); })
};

const fakeRequest  = {};
const fakeResponse = new EventEmitter();
fakeResponse.status      = jest.fn((status) => {
	fakeResponse.statusCode = status;

	return fakeResponse;
});
fakeResponse.headersSent = true;
fakeResponse.end         = jest.fn();
fakeResponse.sendFile    = jest.fn(() => {
	setTimeout(() => {
		fakeResponse.emit('finish');
	});
});


const fakeAction   = jest.fn();
const brokenAction = jest.fn(() => {
	throw new TypeError('An error has occurred...');
});
const longAction   = jest.fn(() => {
	return new Promise((resolve) => {
		setTimeout(resolve, 10);
	});
});

const fakeController = {
	prepareHandling: jest.fn(),
	action:          (...parameters) => { return fakeAction(...parameters); },
	brokenAction:    (...parameters) => { return brokenAction(...parameters); },
	longAction:      (...parameters) => { return longAction(...parameters); }
};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeConfigRepository = () => {
	container.singleton('config', fakeConfigRepository);
	fakeConfig = {};
};

given.fakeControllerRepository = () => {
	container.singleton('router.controller', fakeControllerRepository);
	fakeControllers = { FakeController: fakeController };
};

given.fakeExceptionHandler = () => {
	container.singleton('exception.handler', fakeExceptionHandler);
};

given.handler = () => {
	handler = container.make(Handler);
};

given.timeoutConfiguration = (timeout) => {
	fakeConfig['http.timeout'] = timeout;
};

given.action = (action) => {
	route = new Route({
		action: typeof action === 'string' ? action : (...parameters) => { return action(...parameters); },
		path: '/foo/bar'
	});
};

given.closureAction = () => {
	given.action(fakeAction);
};

given.brokenClosureAction = () => {
	given.action(brokenAction);
};

given.longClosureAction = () => {
	given.action(longAction);
};

given.controllerAction = () => {
	given.action('FakeController@action');
};

given.brokenControllerAction = () => {
	given.action('FakeController@brokenAction');
};

given.longControllerAction = () => {
	given.action('FakeController@longAction');
};

given.unexistingControllerAction = () => {
	given.action('FakeController@unexistingAction');
};


//-- When
//--------------------------------------------------------

when.handlingRequest = async () => {
	delete fakeResponse.statusCode;
	await when.attemptingAsync(async () => {
		result = await handler.handleRequest(route, fakeRequest, fakeResponse);
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveReceivedResponse = (code) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(fakeResponse);
	expect(fakeResponse.status).toHaveBeenCalledWith(code);
};

then.exceptionShouldHaveBeenHandled = () => {
	then.shouldNotHaveThrown();
	expect(fakeExceptionHandler.handle).toHaveBeenCalled();
};

then.controllerShouldHaveBeenPrepared = () => {
	then.shouldNotHaveThrown();
	expect(fakeController.prepareHandling).toHaveBeenCalledWith(container, fakeRequest, fakeResponse);
};

then.closureShouldHaveBeenCalled = () => {
	then.shouldNotHaveThrown();
	expect(fakeAction).toHaveBeenCalled();
};

then.controllerActionShouldHaveBeenCalled = () => {
	then.controllerShouldHaveBeenPrepared();
	then.closureShouldHaveBeenCalled();
};

then.brokenClosureShouldHaveBeenCalled = () => {
	then.shouldNotHaveThrown();
	expect(brokenAction).toHaveBeenCalled();
};

then.brokenControllerActionShouldHaveBeenCalled = () => {
	then.controllerShouldHaveBeenPrepared();
	then.brokenClosureShouldHaveBeenCalled();
};

then.longClosureActionShouldHaveBeenCalled = () => {
	then.shouldNotHaveThrown();
	expect(longAction).toHaveBeenCalled();
};

then.longControllerActionShouldHaveBeenCalled = () => {
	then.controllerShouldHaveBeenPrepared();
	then.longClosureActionShouldHaveBeenCalled();
};

then.controllerShouldNotHaveBeenPrepared = () => {
	then.shouldNotHaveThrown();
	expect(fakeController.prepareHandling).not.toHaveBeenCalled();
};


export default build({ given, when, then });
