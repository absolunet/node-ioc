//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../../common.gwt');

const container = require('../../../container');
const Dispatcher = require('../../../../../dist/node/events/services/Dispatcher');

let dispatcher;
let result;

const fakeDriver = {
	on: jest.fn(() => {
		return fakeDriver;
	})
};

const fakeCallback = jest.fn();


//-- Given
//--------------------------------------------------------

given.dispatcher = () => {
	dispatcher = container.make(Dispatcher);
};

given.fakeDriver = () => {
	dispatcher.addDriver('fake', fakeDriver);
	dispatcher.setDefaultDriver('fake');
};


//-- When
//--------------------------------------------------------

when.callingOn = () => {
	when.attempting(() => {
		dispatcher.on('foo', fakeCallback);
	});
};

when.checkingIfDriverExists = (driver) => {
	when.attempting(() => {
		result = dispatcher.hasDriver(driver);
	});
};

when.checkingIfEventDispatcherDriverExists = () => {
	when.checkingIfDriverExists('emitter');
};

when.checkingIfPubSubJsDriverExists = () => {
	when.checkingIfDriverExists('pubsubjs');
};

when.checkingIfFakeDriverExists = () => {
	when.checkingIfDriverExists('fake');
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveCalledOnOnFakeDriver = () => {
	then.shouldNotHaveThrown();
	expect(fakeDriver.on).toHaveBeenCalledTimes(1);
	expect(fakeDriver.on).toHaveBeenCalledWith('foo', fakeCallback);
};


module.exports = build({ given, when, then });
