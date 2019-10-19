//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Resolver - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container from '../../container';
import Resolver  from '../../../../dist/node/database/services/Resolver';

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

given.fakeDatabasePath = () => {
	container.configurePaths({ database: '/database' });
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
	expect(container.make('path.factory')).toBe('/database/path/to/factories');
	expect(container.make('path.migration')).toBe('/database/path/to/migrations');
	expect(container.make('path.model')).toBe('/database/path/to/models');
	expect(container.make('path.seed')).toBe('/database/path/to/seeds');
};

then.defaultPathsShouldBeBoundIntoApplication = () => {
	then.pathsShouldBeBoundIntoApplication();
	expect(container.make('path.factory')).toBe('/database/factories');
	expect(container.make('path.migration')).toBe('/database/migrations');
	expect(container.make('path.model')).toBe('/database/models');
	expect(container.make('path.seed')).toBe('/database/seeds');
};

then.fakeMigrationPathShouldBeBoundIntoApplication = () => {
	then.shouldNotHaveThrown();
	then.serviceShouldBeResolvable('path.migration');
	expect(container.make('path.migration')).toBe('/database/path/to/migrations');
};

then.defaultPathsExceptMigrationShouldBeBoundIntoApplication = () => {
	then.serviceShouldBeResolvable('path.factory');
	then.serviceShouldBeResolvable('path.model');
	then.serviceShouldBeResolvable('path.seed');
	expect(container.make('path.factory')).toBe('/database/factories');
	expect(container.make('path.model')).toBe('/database/models');
	expect(container.make('path.seed')).toBe('/database/seeds');
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
	expect(fakeConfigGrammar.format).toHaveBeenCalledTimes(8);
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(1, 'factories');
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(2, 'migrations');
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(3, 'models');
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(4, 'seeds');
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(5, 'factories');
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(6, 'migrations');
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(7, 'models');
	expect(fakeConfigGrammar.format).toHaveBeenNthCalledWith(8, 'seeds');
};


export default build({ given, when, then });
