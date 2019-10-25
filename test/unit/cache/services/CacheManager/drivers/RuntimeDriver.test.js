//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - Runtime Driver
//--------------------------------------------------------


import gwt from './RuntimeDriver.gwt';
const { given, when, then } = gwt;
import common                from './common';


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyEntry();
	given.runtimeDriver();
});

describe('Runtime driver', () => {
	common({ given, when, then });
});
