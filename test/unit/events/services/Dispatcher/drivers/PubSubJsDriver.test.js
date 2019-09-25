//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - Drivers - PubSub.js Driver
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./PubSubJsDriver.gwt');
const common                = require('./common');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.PubSubJsDriver();
});


describe('PubSub.js Driver', () => {
	common({ given, when, then });
});
