//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - Database Driver
//--------------------------------------------------------
'use strict';


const { given, when, then } = require('./DatabaseDriver.gwt');
const common                = require('./common');


beforeAll(() => {
	given.emptyDatabase();
});

beforeEach(async () => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyEntry();
	given.databaseDriver();
	given.databaseConfig();
	await given.cacheTable();
});

afterEach(async () => {
	await then.dropCacheTable();
});

afterAll(() => {
	given.emptyDatabase();
});


describe('Database driver', () => {
	common({ given, when, then });
});
