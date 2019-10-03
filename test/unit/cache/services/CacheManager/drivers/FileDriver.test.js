//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - File Driver
//--------------------------------------------------------
'use strict';


const { given, when, then } = require('./FileDriver.gwt');
const common                = require('./common');


beforeAll(() => {
	given.existingCacheDirectory();
});

beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyEntry();
	given.fileDriver();
});

afterEach(() => {
	then.removeCacheFile();
});

afterAll(() => {
	then.removeCacheDirectory();
});


describe('File driver', () => {
	common({ given, when, then });
});
