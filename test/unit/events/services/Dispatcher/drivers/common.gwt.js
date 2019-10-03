//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - Drivers - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../../../common.gwt');


const container = require('../../../../container');

let driver;
let lastEvent;
let payload;
let engineDispatchingMethod;
let cleanCallback;


//-- Mocks
//--------------------------------------------------------

const firstListener  = jest.fn();
const secondListener = jest.fn();


//-- Given
//--------------------------------------------------------

given.cleanCallback = (callback) => {
	cleanCallback = callback;
};

given.cleanedEvents = () => {
	lastEvent = undefined;
	if (cleanCallback) {
		cleanCallback(driver);
	}
};

given.driver = (Driver) => {
	driver = container.make(Driver);
};

given.engineDispatchingMethod = (method) => {
	engineDispatchingMethod = method;
};

given.listener = (event, listener) => {
	when.attempting(() => {
		driver.on(event, listener);
	});
};

given.listenerOnce = (event, listener) => {
	when.attempting(() => {
		driver.once(event, listener);
	});
};

given.firstListener = (event) => {
	given.listener(event, firstListener);
};

given.secondListener = (event) => {
	given.listener(event, secondListener);
};

given.secondListenerOnce = (event) => {
	given.listenerOnce(event, secondListener);
};

given.emptyPayload = () => {
	payload = undefined;
};

given.payload = () => {
	payload = { foo: 'bar' };
};


//-- When
//--------------------------------------------------------

when.dispatchingFromEngineForDriver = (driverInstance, event, parameters) => {
	driverInstance.engine[engineDispatchingMethod](event, parameters);
};

when.dispatchingFromEngine = (event) => {
	when.attempting(() => {
		when.dispatchingFromEngineForDriver(driver, event, payload);
		lastEvent = event;
	});
};

when.dispatching = (event) => {
	when.attempting(() => {
		driver.emit(event, payload);
		lastEvent = event;
	});
};

when.removingListener = (event, listener) => {
	when.attempting(() => {
		driver.off(event, listener);
	});
};

when.removingFirstListener = (event) => {
	when.removingListener(event, firstListener);
};

when.removingListeners = (event) => {
	when.attempting(() => {
		driver.removeListeners(event);
	});
};

when.removingAllListeners = () => {
	when.attempting(() => {
		driver.removeAllListeners();
	});
};


//-- Then
//--------------------------------------------------------

then.listenerShouldHaveBeenCalledWith = (listener, parameters) => {
	then.shouldNotHaveThrown();
	expect(listener).toHaveBeenCalledWith(...parameters);
};

then.listenerShouldHaveBeenCalledTimes = (listener, times) => {
	then.shouldNotHaveThrown();
	expect(listener).toHaveBeenCalledTimes(times);
};

then.listenerShouldHaveReceivedPayload = (listener) => {
	then.listenerShouldHaveBeenCalledWith(listener, [lastEvent, payload]);
};

then.firstListenerShouldHaveBeenCalledTimes = (times) => {
	then.listenerShouldHaveBeenCalledTimes(firstListener, times);
};

then.secondListenerShouldHaveBeenCalledTimes = (times) => {
	then.listenerShouldHaveBeenCalledTimes(secondListener, times);
};

then.firstListenerShouldNotHaveBeenCalled = () => {
	then.firstListenerShouldHaveBeenCalledTimes(0);
};

then.secondListenerShouldNotHaveBeenCalled = () => {
	then.secondListenerShouldHaveBeenCalledTimes(0);
};

then.firstListenerShouldHaveBeenCalledOnce = () => {
	then.firstListenerShouldHaveBeenCalledTimes(1);
};

then.secondListenerShouldHaveBeenCalledOnce = () => {
	then.secondListenerShouldHaveBeenCalledTimes(1);
};

then.firstListenerShouldHaveBeenCalledTwice = () => {
	then.firstListenerShouldHaveBeenCalledTimes(2);
};

then.secondListenerShouldHaveBeenCalledTwice = () => {
	then.secondListenerShouldHaveBeenCalledTimes(2);
};

then.firstListenerShouldHaveReceivedPayload = () => {
	then.listenerShouldHaveReceivedPayload(firstListener);
};


module.exports = build({ given, when, then });
