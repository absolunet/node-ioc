//--------------------------------------------------------
//-- Tests - Unit - Database - Database Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const container = require('../container');
const DatabaseServiceProvider = require('../../../src/database/DatabaseServiceProvider');
const SecurityServiceProvider = require('../../../src/security/SecurityServiceProvider');

let result;
let fakeFiles;
let fakeConfig;


//-- Mocks
//--------------------------------------------------------

const fakeModelFactory = {
	register: jest.fn()
};

const fakeFileManager = {
	exists: jest.fn((folder) => {
		return Object.keys(fakeFiles).some((filePath) => {
			return filePath.startsWith(folder);
		});
	}),
	scandir: jest.fn((folder) => {
		return Object.keys(fakeFiles).filter((filePath) => {
			return filePath.startsWith(folder);
		});
	}),
	loadInFolder: jest.fn((folder) => {
		return Object.entries(fakeFiles)
			.filter(([filePath]) => {
				return filePath.startsWith(folder);
			})
			.map(([, concrete]) => {
				return concrete;
			});
	})
};

const fakeConfigRepository = {
	get: jest.fn((key, defaultValue) => {
		return typeof fakeConfig[key] === 'undefined' ? defaultValue : fakeConfig[key];
	}),
	loadConfigFromFolder: jest.fn(() => { return {}; })
};

const fakeFactory  = {};
const otherFactory = {};


//-- Given
//--------------------------------------------------------

given.providersAndDependencies = () => {
	container.register(DatabaseServiceProvider);
	container.register(SecurityServiceProvider);
};

given.emptyResult = () => {
	result = undefined;
};

given.databaseEnabledInConfiguration = () => {
	fakeConfig['database.enabled'] = true;
};

given.commandNamespace = (namespace) => {
	fakeConfig['database.command_namespace'] = namespace;
};

given.databaseDisabledInConfiguration = () => {
	fakeConfig['database.enabled'] = false;
};

given.fakeModelsFolderPathInConfiguration = () => {
	fakeConfig['database.paths'] = { factories: '/path/to/factories' };
	fakeConfig['database.paths.factories'] = fakeConfig['database.paths'].factories;
	fakeFiles[`${fakeConfig['database.paths'].factories}/FooFactory.js`] = fakeFactory;
	fakeFiles[`${fakeConfig['database.paths'].factories}/barFactory.js`] = otherFactory;
};

given.emptyModelsFolderPathInConfiguration = () => {
	fakeConfig['database.paths'] = { factories: '/path/to/empty/factories' };
	fakeConfig['database.paths.factories'] = fakeConfig['database.paths'].factories;
};

given.fakeModelFactory = () => {
	container.decorate('db.factory', () => {
		return fakeModelFactory;
	});
};

given.fakeFileManager = () => {
	container.decorate('file', () => {
		return fakeFileManager;
	});
	fakeFiles = {};
};

given.fakeConfigRepository = () => {
	container.decorate('config', () => {
		return fakeConfigRepository;
	});
	fakeConfig = {};
};


//-- When
//--------------------------------------------------------

when.checkingIfDatabasePolicyPasses = () => {
	when.attempting(() => {
		result = container.make('gate').can('db');
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.connectionBuilderIsResolvable = () => {
	then.serviceShouldBeResolvable('db');
};

then.connectionBuilderIsSingleton = () => {
	then.shouldHaveSingleton('db');
};

then.connectorServiceIsResolvable = () => {
	then.serviceShouldBeResolvable('db.connection');
};

then.connectorServiceIsSingleton = () => {
	then.shouldHaveSingleton('db.connection');
};

then.modelFactoryIsResolvable = () => {
	then.serviceShouldBeResolvable('db.factory');
};

then.modelFactoryIsSingleton = () => {
	then.shouldHaveSingleton('db.factory');
};

then.modelRepositoryIsResolvable = () => {
	then.serviceShouldBeResolvable('db.model');
};

then.modelRepositoryIsSingleton = () => {
	then.shouldHaveSingleton('db.model');
};

then.ormIsResolvable = () => {
	then.serviceShouldBeResolvable('db.orm');
};

then.ormIsSingleton = () => {
	then.shouldHaveSingleton('db.orm');
};

then.databasePathResolverIsResolvable = () => {
	then.serviceShouldBeResolvable('db.resolver');
};

then.databasePathResolverIsSingleton = () => {
	then.shouldHaveSingleton('db.resolver');
};

then.modelRepositoryHasShortAlias = () => {
	then.serviceShouldBeResolvable('model');
};

then.shouldHaveRegisteredModelFactoriesInFactory = () => {
	then.shouldNotHaveThrown();
	expect(fakeModelFactory.register).toHaveBeenCalledTimes(2);
	expect(fakeModelFactory.register).toHaveBeenNthCalledWith(1, fakeFactory);
	expect(fakeModelFactory.register).toHaveBeenNthCalledWith(2, otherFactory);
};

then.shouldNotHaveRegisteredModelFactoriesInFactory = () => {
	then.shouldNotHaveThrown();
	expect(fakeModelFactory.register).not.toHaveBeenCalled();
};


module.exports = build({ given, when, then });
