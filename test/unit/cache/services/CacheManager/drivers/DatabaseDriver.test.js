//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - Database Driver
//--------------------------------------------------------


import gwt from './DatabaseDriver.gwt';
const { given, when, then } = gwt;
import common                from './common';


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
