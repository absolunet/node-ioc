//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Resolver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container = require('../../container');
const Resolver  = require('../../../../lib/database/services/Resolver');

let result;
let resolver;
let fakeConfig;


//-- Mocks
//--------------------------------------------------------

const fakeConfigRepository = {
	get: jest.fn((key, defaultValue) => {
		return fakeConfig[key] || defaultValue;
	})
};

const fakeConfigGrammar = {
	format: jest.fn((value) => {
		return value;
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

given.fakeConfigGrammar = () => {
	container.singleton('config.grammar', fakeConfigGrammar);
};

given.fakePathsInConfig = () => {
	const key = 'database.paths';
	fakeConfig[key] = {
		factories:  '/path/to/factories',
		migrations: '/path/to/migrations',
		models:     '/path/to/models',
		seeds:      '/path/to/seeds'
	};
	fakeConfig['database.paths.factories']  = '/path/to/factories';
	fakeConfig['database.paths.migrations'] = '/path/to/migrations';
	fakeConfig['database.paths.models']    = '/path/to/models';
	fakeConfig['database.paths.seeds']     = '/path/to/seeds';
};

given.emptyPathsInConfig = () => {
	fakeConfig['database.paths'] = {};
	delete fakeConfig['database.paths.factories'];
	delete fakeConfig['database.paths.migrations'];
	delete fakeConfig['database.paths.models'];
	delete fakeConfig['database.paths.seeds'];
};

given.fakeMigrationPathInConfig = () => {
	given.emptyPathsInConfig();
	fakeConfig['database.paths'] = {
		migrations: '/path/to/migrations'
	};
	fakeConfig['database.paths.migrations'] = '/path/to/migration';
};

given.resolver = () => {
	resolver = container.make(Resolver);
};


//-- When
//--------------------------------------------------------

when.makingResolver = () => {
	when.attempting(() => {
		resolver = container.make(Resolver);
	});
};

when.resolvingPaths = () => {
	when.attempting(() => {
		result = resolver.resolvePaths();
	});
};

when.resolvingMigrationPath = () => {
	when.attempting(() => {
		result = resolver.resolvePath('migrations');
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldEqual = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(expected);
};

then.pathsShouldBeBoundIntoApplication = () => {
	then.shouldNotHaveThrown();
	then.serviceShouldBeResolvable('path.factory');
	then.serviceShouldBeResolvable('path.migration');
	then.serviceShouldBeResolvable('path.model');
	then.serviceShouldBeResolvable('path.seed');
};
then.fakePathsShouldBeBoundIntoApplication = () => {
	then.pathsShouldBeBoundIntoApplication();
	expect(container.make('path.factory')).toBe('/path/to/factories');
	expect(container.make('path.migration')).toBe('/path/to/migrations');
	expect(container.make('path.model')).toBe('/path/to/models');
	expect(container.make('path.seed')).toBe('/path/to/seeds');
};

then.defaultPathsShouldBeBoundIntoApplication = () => {
	then.pathsShouldBeBoundIntoApplication();
	expect(container.make('path.factory')).toBe('@/database/factories');
	expect(container.make('path.migration')).toBe('@/database/migrations');
	expect(container.make('path.model')).toBe('@/database/models');
	expect(container.make('path.seed')).toBe('@/database/seeds');
};

then.fakeMigrationPathShouldBeBoundIntoApplication = () => {
	then.shouldNotHaveThrown();
	then.serviceShouldBeResolvable('path.migration');
	expect(container.make('path.migration')).toBe('/path/to/migrations');
};

then.defaultPathsExceptMigrationShouldBeBoundIntoApplication = () => {
	then.serviceShouldBeResolvable('path.factory');
	then.serviceShouldBeResolvable('path.model');
	then.serviceShouldBeResolvable('path.seed');
	expect(container.make('path.factory')).toBe('@/database/factories');
	expect(container.make('path.model')).toBe('@/database/models');
	expect(container.make('path.seed')).toBe('@/database/seeds');
};

then.shouldHaveSamePathsAsBoundInApplication = () => {
	then.pathsShouldBeBoundIntoApplication();
	then.resultShouldEqual({
		factories:  container.make('path.factory'),
		migrations: container.make('path.migration'),
		models:     container.make('path.model'),
		seeds:      container.make('path.seed')
	});
};

then.shouldHaveSameMigrationPathAsBoundInApplication = () => {
	then.serviceShouldBeResolvable('path.migration');
	then.resultShouldBe(container.make('path.migration'));
};

then.configGrammarShouldHaveBeenUsedForEveryPathsAsDefaultPaths = () => {
	then.shouldNotHaveThrown();
	expect(fakeConfigGrammar.format).toHaveBeenCalledTimes(4);
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(1, '@/database/factories');
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(2, '@/database/migrations');
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(3, '@/database/models');
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(4, '@/database/seeds');
};


module.exports = build({ given, when, then });
