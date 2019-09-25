//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - Drivers - PubSub.js Driver
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./EventEmitterDriver.gwt');
const common                = require('./common');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emitterDriver();
});


describe('Event Emitter Driver', () => {
	common({ given, when, then });
});
