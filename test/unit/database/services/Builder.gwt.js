//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Builder - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import __        from '@absolunet/private-registry';
import container from '../../container';
import Builder   from '../../../../dist/node/database/services/Builder';

let builder;
let result;
let fakeConfig;


//-- Mocks
//--------------------------------------------------------

const fakeConnection = {};
const otherConnection = {};

const fakeConnections = {
	fake:  fakeConnection,
	other: otherConnection
};

const fakeDriver = {
	getOrCreateConnection: jest.fn((name) => {
		const connection = fakeConnections[name];
		__(connection).set('driver', fakeDriver);

		return connection;
	})
};

const fakeConfigRepository = {
	get: jest.fn((key, defaultValue) => {
		return fakeConfig[key] || defaultValue;
	})
};

const fakeConnectorService = {
	driver: jest.fn((name) => {
		if (name === 'fake') {
			return fakeDriver;
		}

		throw new TypeError('An error has occurred...');
	})
};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeConfigRepository = () => {
	container.singleton('config', fakeConfigRepository);
	fakeConfig = {};
};

given.fakeConnectorService = () => {
	container.singleton('db.connection', fakeConnectorService);
};

given.builder = () => {
	builder = container.make(Builder);
};

given.fakeConnectionAsDefaultInConfig = () => {
	fakeConfig['database.default'] = 'fake';
};

given.fakeConnectionInConfig = () => {
	fakeConfig['database.connections'] = fakeConfig['database.connections'] || {};
	fakeConfig['database.connections'].fake = {
		driver: 'fake',
		key:    'fake'
	};
	fakeConfig['database.connections.fake'] = fakeConfig['database.connections'].fake;
};

given.otherConnectionInConfig = () => {
	fakeConfig['database.connections'] = fakeConfig['database.connections'] || {};
	fakeConfig['database.connections'].other = {
		driver: 'fake',
		key:    'other'
	};
	fakeConfig['database.connections.other'] = fakeConfig['database.connections'].other;
};

given.noDriverConnectionInConfig = () => {
	fakeConfig['database.connections'] = fakeConfig['database.connections'] || {};
	fakeConfig['database.connections'].no_driver = { // eslint-disable-line camelcase
		key: 'no_driver'
	};
	fakeConfig['database.connections.no_driver'] = fakeConfig['database.connections'].no_driver;
};

given.unexistingDriverConnectionInConfig = () => {
	fakeConfig['database.connections'] = fakeConfig['database.connections'] || {};
	fakeConfig['database.connections'].unexisting = {
		driver: 'unexisting',
		key:    'unexisting'
	};
	fakeConfig['database.connections.unexisting'] = fakeConfig['database.connections'].unexisting;
};


//-- When
//--------------------------------------------------------

when.gettingDefaultConnection = () => {
	when.attempting(() => {
		result = builder.getDefaultConnection();
	});
};

when.gettingConnection = (name) => {
	when.attempting(() => {
		result = builder.getConnection(name);
	});
};

when.gettingDriverFrom = (connection) => {
	when.attempting(() => {
		result = builder.getDriverForConnection(connection);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveReceivedFakeConnection = () => {
	then.resultShouldBe(fakeConnection);
	expect(fakeDriver.getOrCreateConnection).toHaveBeenCalledWith('fake', { driver: 'fake', key: 'fake' });
};

then.shouldHaveReceivedOtherConnection = () => {
	then.resultShouldBe(otherConnection);
	expect(fakeDriver.getOrCreateConnection).toHaveBeenCalledWith('other', { driver: 'fake', key: 'other' });
};

then.shouldHaveReceivedFakeDriver = () => {
	then.resultShouldBe(fakeDriver);
};


export default build({ given, when, then });
