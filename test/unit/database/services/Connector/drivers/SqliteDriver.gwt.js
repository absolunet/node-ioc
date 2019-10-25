//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Connector - Drivers - SQLite Driver - GWT
//--------------------------------------------------------

import gwt from '../../../common.gwt';
const { given, when, then, build } = gwt;

import __           from '@absolunet/private-registry';
import container    from '../../../../container';
import SqliteDriver from '../../../../../../dist/node/database/services/Connector/drivers/SqliteDriver';

let result;
let sqliteDriver;
let config;
let fakeConfig;


//-- Mocks
//--------------------------------------------------------

const mockedKnex = {};

const mockedKnexFactory = jest.fn(() => {
	return mockedKnex;
});

const fakeConfigRepository = {
	get: jest.fn((key, defaultValue) => {
		return fakeConfig[key] || defaultValue;
	})
};

const fakeResolver = {
	resolvePath: jest.fn((type) => {
		return `/path/to/${type}`;
	})
};

const fakeFileManager = {};

const fakeConnection = {};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.mockedKnex = () => {
	jest.mock('knex', () => {
		return mockedKnexFactory;
	});
};

given.fakeConfigRepository = () => {
	container.singleton('config', fakeConfigRepository);
	fakeConfig = {};
};

given.fakeResolver = () => {
	container.singleton('db.resolver', fakeResolver);
};

given.fakeFileManager = () => {
	container.singleton('file', fakeFileManager);
};

given.sqliteDriver = () => {
	sqliteDriver = container.make(SqliteDriver);
};

given.fakeConnection = (name) => {
	sqliteDriver.setConnection(name, fakeConnection);
};

given.connectionConfig = () => {
	config = { filename: '/path/to/database.sqlite' };
};

given.fakeMigrationTableNameInConfig = () => {
	fakeConfig['database.migrations_table'] = 'fake_migrations';
};


//-- When
//--------------------------------------------------------

when.gettingClient = () => {
	when.attempting(() => {
		result = sqliteDriver.client;
	});
};

when.settingFakeConnection = (name) => {
	when.attempting(() => {
		result = sqliteDriver.setConnection(name, fakeConnection);
	});
};

when.settingDefaultFakeConnection = () => {
	when.attempting(() => {
		result = sqliteDriver.setDefaultConnection(fakeConnection);
	});
};

when.checkingIfConnectionExists = (name) => {
	when.attempting(() => {
		result = sqliteDriver.hasConnection(name);
	});
};

when.makingConnection = () => {
	when.attempting(() => {
		result = sqliteDriver.makeConnection(config);
	});
};

when.creatingConnection = (name) => {
	when.attempting(() => {
		result = sqliteDriver.createConnection(name, config);
	});
};

when.gettingOrCreatingConnection = (name) => {
	when.attempting(() => {
		result = sqliteDriver.getOrCreateConnection(name, config);
	});
};

when.mappingConfig = () => {
	when.attempting(() => {
		result = sqliteDriver.mapConfig(config);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldBeValidKnexClient = () => {
	then.shouldNotHaveThrown();
};

then.shouldHaveConnection = (name) => {
	then.shouldNotHaveThrown();
	expect(sqliteDriver.getConnection(name)).toBeTruthy();
};

then.shouldNotHaveConnection = (name) => {
	then.shouldNotHaveThrown();
	expect(sqliteDriver.hasConnection(name)).toBe(false);
};

then.resultShouldBeKnexInstanceWithConfig = () => {
	then.resultShouldBe(mockedKnex);
	expect(mockedKnexFactory).toHaveBeenCalled();
	expect(mockedKnexFactory.mock.calls[0][0].connection).toStrictEqual(config);
};

then.resultShouldBeAwareOfCurrentDriver = () => {
	then.shouldNotHaveThrown();
	expect(__(result).get('driver')).toBe(sqliteDriver);
};

then.resultShouldBeFakeConnection = () => {
	then.resultShouldBe(fakeConnection);
};

then.shouldHaveReceivedProperKnexConfigWithFakeMigrationTableNameAndConnectionConfig = () => {
	then.shouldNotHaveThrown();
	const keys = Object.keys(result);
	['client', 'connection', 'migrations', 'seeds'].forEach((key) => {
		expect(keys).toContain(key);
	});
	expect(result.client).toBe('sqlite3');
	expect(result.connection).toStrictEqual(config);
	expect(result.migrations).toStrictEqual({
		tableName: 'fake_migrations',
		directory: '/path/to/migrations'
	});
	expect(result.seeds).toStrictEqual({
		directory: '/path/to/seeds'
	});
};


export default build({ given, when, then });
