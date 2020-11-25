//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Connector - Drivers - MySQL Driver - GWT
//--------------------------------------------------------

import gwt from '../../../common.gwt';
const { given, when, then, build } = gwt;

import __          from '@absolunet/private-registry';
import container   from '../../../../container';
import MySQLDriver from '../../../../../../dist/node/database/services/Connector/drivers/MySQLDriver';

let result;
let mysqlDriver;
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

given.mysqlDriver = () => {
	mysqlDriver = container.make(MySQLDriver);
};

given.fakeConnection = (name) => {
	mysqlDriver.setConnection(name, fakeConnection);
};

given.connectionConfig = () => {
	config = {
		host: 'localhost',
		user: 'root',
		password: 'password',
		database: 'database',
		port: '3306'
	};
};

given.fakeMigrationTableNameInConfig = () => {
	fakeConfig['database.migrations_table'] = 'fake_migrations';
};


//-- When
//--------------------------------------------------------

when.gettingClient = () => {
	when.attempting(() => {
		result = mysqlDriver.client;
	});
};

when.settingFakeConnection = (name) => {
	when.attempting(() => {
		result = mysqlDriver.setConnection(name, fakeConnection);
	});
};

when.settingDefaultFakeConnection = () => {
	when.attempting(() => {
		result = mysqlDriver.setDefaultConnection(fakeConnection);
	});
};

when.checkingIfConnectionExists = (name) => {
	when.attempting(() => {
		result = mysqlDriver.hasConnection(name);
	});
};

when.makingConnection = () => {
	when.attempting(() => {
		result = mysqlDriver.makeConnection(config);
	});
};

when.creatingConnection = (name) => {
	when.attempting(() => {
		result = mysqlDriver.createConnection(name, config);
	});
};

when.gettingOrCreatingConnection = (name) => {
	when.attempting(() => {
		result = mysqlDriver.getOrCreateConnection(name, config);
	});
};

when.mappingConfig = () => {
	when.attempting(() => {
		result = mysqlDriver.mapConfig(config);
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
	expect(mysqlDriver.getConnection(name)).toBeTruthy();
};

then.shouldNotHaveConnection = (name) => {
	then.shouldNotHaveThrown();
	expect(mysqlDriver.hasConnection(name)).toBe(false);
};

then.resultShouldBeKnexInstanceWithConfig = () => {
	then.resultShouldBe(mockedKnex);
	expect(mockedKnexFactory).toHaveBeenCalled();
	expect(mockedKnexFactory.mock.calls[0][0].connection).toStrictEqual(config);
};

then.resultShouldBeAwareOfCurrentDriver = () => {
	then.shouldNotHaveThrown();
	expect(__(result).get('driver')).toBe(mysqlDriver);
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
	expect(result.client).toBe('mysql');
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
