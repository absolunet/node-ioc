//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - Runtime Driver
//--------------------------------------------------------
'use strict';


const { given, when, then } = require('./RuntimeDriver.gwt');
const common                = require('./common');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyEntry();
	given.runtimeDriver();
});

describe('Runtime driver', () => {
	common({ given, when, then });
});
