//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - Drivers - Event Emitter Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const EventEmitterDriver = require('../../../../../../src/events/services/Dispatcher/drivers/EventEmitterDriver');


//-- Given
//--------------------------------------------------------

given.emitterDriver = () => {
	given.driver(EventEmitterDriver);
	given.engineDispatchingMethod('emit');
};


module.exports = build({ given, when, then });
