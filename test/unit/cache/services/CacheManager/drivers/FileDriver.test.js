//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - File Driver
//--------------------------------------------------------


import gwt from './FileDriver.gwt';
const { given, when, then } = gwt;
import common                from './common';


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
