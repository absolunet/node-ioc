//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container = require('../../container');
const CommandRunner = require('../../../../lib/console/services/CommandRunner');

let result;
let command;
let commandRunner;
let commandArgv;
let migrationsToRun;
let ranMigrations;
let fakeConfig;
let fakeCapture;
let batch;
let seeders;


//-- Mocks
//--------------------------------------------------------

const fakeTerminal = {
	success: jest.fn(),
	warning: jest.fn(),
	print:   jest.fn(),
	println: jest.fn((...parameters) => {
		fakeTerminal.print(...parameters);
	}),
	table: jest.fn()
};

const fakeInterceptor = {
	startCapture: jest.fn(),
	stopCapture:  jest.fn(() => {
		return fakeCapture;
	})
};

const fakeConnection = {
	migrate: {
		latest: jest.fn(() => {
			return Promise.resolve([batch, migrationsToRun]);
		}),
		rollback: jest.fn(() => {
			const rollbackBatch      = Object.keys(ranMigrations).sort().pop() || 0;
			const rollbackMigrations = [...ranMigrations[rollbackBatch] || []].reverse();
			delete ranMigrations[rollbackBatch];

			return Promise.resolve([rollbackBatch, rollbackMigrations]);
		})
	},
	seed: {
		run: jest.fn(() => {
			return Promise.resolve([seeders]);
		})
	}
};

const fakeDatabaseDriver = {
	dropAll:         jest.fn(() => { return Promise.resolve(); }),
	clean:           jest.fn(() => { return Promise.resolve(); }),
	migrationStatus: jest.fn(() => {
		const migrationStatus = [];
		let ran = true;
		Object.keys(ranMigrations).sort().forEach((key) => {
			migrationStatus.push(...ranMigrations[key].map((name) => {
				return { ran, name };
			}));
		});
		ran = false;
		migrationStatus.push(...migrationsToRun.map((name) => {
			return { ran, name };
		}));

		return Promise.resolve(migrationStatus);
	})
};

const fakeConnectionBuilder = {
	getConnection: jest.fn(() => {
		return fakeConnection;
	}),
	getDriverForConnection: jest.fn(() => {
		return fakeDatabaseDriver;
	})
};

const fakeConfigRepository = {
	get: jest.fn((key, defaultValue) => {
		return fakeConfig[key] || defaultValue;
	})
};

const fakeCommandRegistrar = {
	resolve: jest.fn(() => { return Promise.resolve(); })
};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.command = (Command) => {
	command = container.make(Command, {
		app:      container,
		terminal: container.make('terminal')
	});
};

given.commandRunner = () => {
	commandRunner = container.make(CommandRunner);
	commandArgv   = {};
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.fakeInterceptor = () => {
	container.singleton('terminal.interceptor', fakeInterceptor);
	fakeCapture = [];
};

given.fakeConnectionBuilder = () => {
	container.singleton('db', fakeConnectionBuilder);
	migrationsToRun = [];
	ranMigrations = {};
	seeders = [];
	batch = 1;
};

given.fakeConfigRepository = () => {
	container.singleton('config', fakeConfigRepository);
	fakeConfig = {};
};

given.fakeCommandRegistrar = () => {
	container.singleton('command.registrar', fakeCommandRegistrar);
};

given.argv = (key, value) => {
	commandArgv[key] = value;
};

given.flag = (key) => {
	given.argv(key, true);
};

given.seedFlag = () => {
	given.flag('seed');
};

given.twoMigrationsToRun = () => {
	migrationsToRun = [
		'12345678900000_CreateFooTable',
		'12345678900001_CreateBarTable'
	];
};

given.noMigrationsToRun = () => {
	migrationsToRun = [];
};

given.databasePrefix = (value) => {
	fakeConfig['database.command_namespace'] = value;
};

given.twoMigrationsInFirstBatch = () => {
	ranMigrations[1] = [
		'02345678900000_CreateQuxTable',
		'02345678900001_AlterQuxTable'
	];
};

given.oneMigrationInSecondBatch = () => {
	ranMigrations[2] = [
		'02345678900000_CreateBazTable'
	];
};

given.twoSeeders = () => {
	seeders = [
		'FooTableSeeder',
		'BarTableSeeder'
	];
};


//-- When
//--------------------------------------------------------

when.runningCommand = async () => {
	await when.attemptingAsync(async () => {
		const argv = Object.fromEntries([
			...command.parameters.map(([name,, defaultValue]) => {
				return [name, defaultValue];
			}),
			...command.options.map(([name, defaultValue]) => {
				return [name, defaultValue];
			})
		]);
		await commandRunner.unsafeRun(command, { ...argv, ...commandArgv });
	});
};

when.gettingCommandName = () => {
	when.attempting(() => {
		result = command.name;
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveRunMigrations = () => {
	then.shouldNotHaveThrown();
	expect(fakeConnection.migrate.latest).toHaveBeenCalledTimes(1);
};

then.shouldHavePrintedTwoMigrations = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.success).toHaveBeenCalledTimes(2);
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(1, 'Migrated: 12345678900000_CreateFooTable');
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(2, 'Migrated: 12345678900001_CreateBarTable');
};

then.shouldHavePrintedThatNoMigrationRan = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.success).not.toHaveBeenCalled();
	expect(fakeTerminal.print).toHaveBeenCalledWith('Already up to date');
};

then.commandShouldHaveRunWithPrefix = (prefix, name) => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRegistrar.resolve.mock.calls[0][0]).toBe(`${prefix}:${name}`);
};

then.seedCommandShouldHaveRunWithPrefix = (prefix) => {
	then.commandShouldHaveRunWithPrefix(prefix, 'seed');
};

then.seedCommandShouldHaveRun = () => {
	then.seedCommandShouldHaveRunWithPrefix('db');
};

then.migrateCommandShouldHaveRunWithPrefix = (prefix) => {
	then.commandShouldHaveRunWithPrefix(prefix, 'migrate');
};

then.migrateCommandShouldHaveRun = () => {
	then.migrateCommandShouldHaveRunWithPrefix('db');
};

then.migrateCommandShouldHaveRunWithSeedFlagAndPrefix = (prefix) => {
	then.commandShouldHaveRunWithPrefix(prefix, 'migrate --seed');
};

then.migrateCommandShouldHaveRunWithSeedFlag = () => {
	then.migrateCommandShouldHaveRunWithSeedFlagAndPrefix('db');
};

then.resultShouldStartBy = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toMatch(new RegExp(`^${expected}`, 'u'));
};

then.shouldHaveDroppedAllTables = () => {
	then.shouldNotHaveThrown();
	expect(fakeDatabaseDriver.dropAll).toHaveBeenCalled();
};

then.shouldHaveCleanedDatabase = () => {
	then.shouldNotHaveThrown();
	expect(fakeDatabaseDriver.clean).toHaveBeenCalled();
};

then.shouldHaveRolledBack = () => {
	then.shouldNotHaveThrown();
	expect(fakeConnection.migrate.rollback).toHaveBeenCalled();
};

then.shouldNotHaveMigrationsRemaining = () => {
	then.shouldNotHaveThrown();
	expect(ranMigrations).toStrictEqual({});
};

then.threeMigrationsShouldHaveRunDown = () => {
	then.shouldHaveRolledBack();
	then.shouldNotHaveMigrationsRemaining();
	expect(fakeTerminal.success).toHaveBeenCalledTimes(3);
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(1, 'Rolled back: 02345678900000_CreateBazTable');
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(2, 'Rolled back: 02345678900001_AlterQuxTable');
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(3, 'Rolled back: 02345678900000_CreateQuxTable');
};

then.oneMigrationShouldHaveRunDown = () => {
	then.shouldHaveRolledBack();
	expect(fakeTerminal.success).toHaveBeenCalledTimes(1);
	expect(fakeTerminal.success).toHaveBeenCalledWith('Rolled back: 02345678900000_CreateBazTable');
};

then.shouldHaveTwoMigrationsInOneBatchRemaining = () => {
	then.shouldNotHaveThrown();
	expect(ranMigrations).toStrictEqual({
		1: [
			'02345678900000_CreateQuxTable',
			'02345678900001_AlterQuxTable'
		]
	});
};


then.noMigrationShouldHaveRunDown = () => {
	then.shouldHaveRolledBack();
	expect(fakeTerminal.success).not.toHaveBeenCalled();
	expect(fakeTerminal.print).toHaveBeenCalledWith('No migration rollback to run');
};

then.shouldHavePrintedTwoRanMigrationsAndTwoPendingMigrations = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.table).toHaveBeenCalledWith(['Ran?', 'Migration'], [
		['Y', '02345678900000_CreateQuxTable'],
		['Y', '02345678900001_AlterQuxTable'],
		['N', '12345678900000_CreateFooTable'],
		['N', '12345678900001_CreateBarTable']
	]);
};

then.shouldHaveSeeded = () => {
	then.shouldNotHaveThrown();
	expect(fakeConnection.seed.run).toHaveBeenCalled();
};

then.shouldHavePrintedTwoSeededClasses = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.success).toHaveBeenCalledTimes(2);
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(1, 'Seeded: FooTableSeeder');
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(2, 'Seeded: BarTableSeeder');
};


module.exports = build({ given, when, then });
