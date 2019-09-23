//--------------------------------------------------------
//-- Tests - Unit - Log - Services - Logger - Drivers - Database Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../../common.gwt');

const knex           = require('knex');
const mockConnection = require('mock-knex');
const container      = require('../../../container');
const DatabaseDriver = require('../../../../../lib/log/services/Logger/drivers/DatabaseDriver');

let tracker;
let connections;
let driver;
let config;
let level;
let message;
let context;
let currentConnection;
let lastStep;
let lastResult;


//-- Mocks
//--------------------------------------------------------

const fakeDatabaseConnectionBuilder = {
	getConnection: jest.fn((name) => {
		const connection = knex({
			client: 'sqlite',
			filename: `/path/to/${name}/database.sqlite`,
			useNullAsDefault: true
		});
		mockConnection.mock(connection);
		connections[name] = connections[name] || { values: [] };
		connections[name].connection = connection;

		return connection;
	})
};

const fakeTerminal = {
	command: 'some:command'
};


//-- Given
//--------------------------------------------------------

given.freshValues = () => {
	level = undefined;
	message = undefined;
	context = undefined;
	currentConnection = undefined;
};

given.driver = (Driver) => {
	driver      = container.make(Driver);
	({ config } = driver);
};

given.databaseDriver = () => {
	given.driver(DatabaseDriver);
};

given.fakeDatabaseConnectionBuilder = () => {
	container.singleton('db', fakeDatabaseConnectionBuilder);
	connections = {
		connection: { values: [] },
		other:      { values: [] }
	};
	given.queryTracker();
};

given.queryTracker = () => {
	lastStep   = 0;
	lastResult = undefined;

	tracker = mockConnection.getTracker();
	tracker.install();

	const insert = (query) => {
		const [insertCommand, insertContext, insertLevel, insertMessage, insertVersion] = query.bindings;
		const insertId = connections[currentConnection].values.length + 1;
		connections[currentConnection].values.push({
			id: insertId,
			command: insertCommand,
			context: insertContext,
			level: insertLevel,
			message: insertMessage,
			version: insertVersion
		});
		query.response();
	};

	const select = (query) => {
		if (query.sql === 'select count(`id`) as `count` from `logs`') {
			const { length: count } = connections[currentConnection].values;

			return [{ count }];
		}

		return [...connections[currentConnection].values];
	};

	const del = (query) => {
		if (query.sql === 'delete from `logs` where `id` < ?') {
			const { values } = connections[currentConnection];
			values.splice(0, values.length, ...values.filter(({ id }) => {
				return id >= query.bindings[0];
			}));
		}
	};

	const response = (query, result) => {
		lastResult = result;
		query.response(result);
	};

	tracker.on('query', (query, step) => {
		if (step <= lastStep) {
			query.response(lastResult);
		} else {
			lastStep = step;

			switch (query.method) {

				case 'insert':
					insert(query);
					response(query);
					break;

				case 'select':
					response(query, select(query));
					break;

				case 'del':
					del(query);
					response(query);
					break;

				default:
					response(query);
					break;

			}
		}
	});
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.message = () => {
	message = 'A message to log';
};

given.level = (value) => {
	level = value;
};

given.context = () => {
	context = { key: 'value' };
};

given.config = (key, value) => {
	config[key] = value;
	driver.setConfig(config);
};

given.limit = (value) => {
	given.config('limit', value);
};

given.connectionConfig = () => {
	given.config('connection', 'connection');
};

given.oneEntryInConnectionWithLevel = (value) => {
	connections.connection.values.push({
		id: connections.connection.values.length + 1,
		level: value,
		version: '0.0.0',
		message: 'An entry in connection',
		command: '',
		context: null
	});
};


//-- When
//--------------------------------------------------------

when.loggingWithLevel = async (value) => {
	await when.attemptingAsync(async () => {
		currentConnection = driver.config.connection;
		await driver.log(value, message, context);
	});
};

when.logging = async () => {
	await when.loggingWithLevel(level);
};

when.changingForOtherConnectionInConfig = () => {
	config.connection = 'other';
	driver.setConfig(config);
};


//-- Then
//--------------------------------------------------------

then.shouldHaveLoggedWithLevelOnConnection = (connection, value) => {
	then.shouldNotHaveThrown();
	const { values } = connections[connection];
	expect(values.length).toBeGreaterThanOrEqual(1);
	expect(values.some(({ level: l }) => { return value === l; })).toBe(true);
};

then.shouldHaveLoggedInConnectionWithLevel = (value) => {
	then.shouldHaveLoggedWithLevelOnConnection('connection', value);
};

then.shouldHaveLoggedInOtherConnectionWithLevel = (value) => {
	then.shouldHaveLoggedWithLevelOnConnection('other', value);
};

then.shouldHaveCountEntriesInConnection = (times) => {
	then.shouldNotHaveThrown();
	const { values } = connections.connection;
	expect(values.length).toBe(times);
};

then.shouldHaveOneEntryInConnection = () => {
	then.shouldHaveCountEntriesInConnection(1);
};

then.shouldHaveTwoEntriesInConnection = () => {
	then.shouldHaveCountEntriesInConnection(2);
};

then.removeQueryTracker = () => {
	if (tracker) {
		tracker.uninstall();
	}

	tracker = undefined;
};


module.exports = build({ given, when, then });
