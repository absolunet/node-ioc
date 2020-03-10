//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container from '../../container';
import CommandRunner from '../../../../dist/node/console/services/CommandRunner';

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
	table: jest.fn()
};

const fakeInterceptor = {
	startCapture: jest.fn(),
	stopCapture:  jest.fn(() => {
		return fakeCapture;
	})
};

const fakeTranslator = {
	translate: jest.fn((key, replace = {}) => {
		return `${key} ${JSON.stringify(replace)}`;
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

given.fakeTranslator = () => {
	container.singleton('translator', fakeTranslator);
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
		'12345678900002_CreateFooTable',
		'12345678900003_CreateBarTable'
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
		'02345678900002_CreateBazTable'
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

then.shouldHaveTranslated = (...parameters) => {
	then.shouldNotHaveThrown();
	expect(fakeTranslator.translate).toHaveBeenCalledWith(...parameters);
};

then.shouldHavePrintedTwoMigrations = () => {
	then.shouldNotHaveThrown();
	then.shouldHaveTranslated('commands.db-migrate.messages.migrated', { migration: '12345678900002_CreateFooTable' });
	then.shouldHaveTranslated('commands.db-migrate.messages.migrated', { migration: '12345678900003_CreateBarTable' });
	expect(fakeTerminal.success).toHaveBeenCalledTimes(2);
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(1, 'commands.db-migrate.messages.migrated {"migration":"12345678900002_CreateFooTable"}');
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(2, 'commands.db-migrate.messages.migrated {"migration":"12345678900003_CreateBarTable"}');
};

then.shouldHavePrintedThatNoMigrationRan = () => {
	then.shouldNotHaveThrown();
	then.shouldHaveTranslated('commands.db-migrate.messages.up-to-date');
	expect(fakeTerminal.success).not.toHaveBeenCalled();
	expect(fakeTerminal.print).toHaveBeenCalledWith('commands.db-migrate.messages.up-to-date {}');
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
	then.shouldHaveTranslated('commands.db-migrate-refresh.messages.rolled-back', { migration: '02345678900002_CreateBazTable' });
	then.shouldHaveTranslated('commands.db-migrate-refresh.messages.rolled-back', { migration: '02345678900001_AlterQuxTable' });
	then.shouldHaveTranslated('commands.db-migrate-refresh.messages.rolled-back', { migration: '02345678900000_CreateQuxTable' });
	expect(fakeTerminal.success).toHaveBeenCalledTimes(3);
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(1, 'commands.db-migrate-refresh.messages.rolled-back {"migration":"02345678900002_CreateBazTable"}');
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(2, 'commands.db-migrate-refresh.messages.rolled-back {"migration":"02345678900001_AlterQuxTable"}');
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(3, 'commands.db-migrate-refresh.messages.rolled-back {"migration":"02345678900000_CreateQuxTable"}');
};

then.oneMigrationShouldHaveRunDown = () => {
	then.shouldHaveRolledBack();
	then.shouldHaveTranslated('commands.db-migrate-rollback.messages.rolled-back', { migration: '02345678900002_CreateBazTable' });
	expect(fakeTerminal.success).toHaveBeenCalledTimes(1);
	expect(fakeTerminal.success).toHaveBeenCalledWith('commands.db-migrate-rollback.messages.rolled-back {"migration":"02345678900002_CreateBazTable"}');
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
	then.shouldHaveTranslated('commands.db-migrate-rollback.messages.up-to-date');
	expect(fakeTerminal.success).not.toHaveBeenCalled();
	expect(fakeTerminal.print).toHaveBeenCalledWith('commands.db-migrate-rollback.messages.up-to-date {}');
};

then.shouldHavePrintedTwoRanMigrationsAndTwoPendingMigrations = () => {
	then.shouldNotHaveThrown();
	then.shouldHaveTranslated('commands.db-migrate-status.messages.ran');
	then.shouldHaveTranslated('commands.db-migrate-status.messages.migration');
	then.shouldHaveTranslated('commands.db-migrate-status.messages.yes');
	then.shouldHaveTranslated('commands.db-migrate-status.messages.no');
	expect(fakeTerminal.table).toHaveBeenCalledWith(['commands.db-migrate-status.messages.ran {}', 'commands.db-migrate-status.messages.migration {}'], [
		['commands.db-migrate-status.messages.yes {}', '02345678900000_CreateQuxTable'],
		['commands.db-migrate-status.messages.yes {}', '02345678900001_AlterQuxTable'],
		['commands.db-migrate-status.messages.no {}',  '12345678900002_CreateFooTable'],
		['commands.db-migrate-status.messages.no {}',  '12345678900003_CreateBarTable']
	]);
};

then.shouldHaveSeeded = () => {
	then.shouldNotHaveThrown();
	expect(fakeConnection.seed.run).toHaveBeenCalled();
};

then.shouldHavePrintedTwoSeededClasses = () => {
	then.shouldNotHaveThrown();
	then.shouldHaveTranslated('commands.db-seed.messages.seeded', { seeder: 'FooTableSeeder' });
	then.shouldHaveTranslated('commands.db-seed.messages.seeded', { seeder: 'BarTableSeeder' });
	expect(fakeTerminal.success).toHaveBeenCalledTimes(2);
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(1, 'commands.db-seed.messages.seeded {"seeder":"FooTableSeeder"}');
	expect(fakeTerminal.success).toHaveBeenNthCalledWith(2, 'commands.db-seed.messages.seeded {"seeder":"BarTableSeeder"}');
};


export default build({ given, when, then });
