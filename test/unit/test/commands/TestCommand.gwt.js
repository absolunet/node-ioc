//--------------------------------------------------------
//-- Tests - Unit - Test - Commands - Test Command - GWT
//--------------------------------------------------------
'use strict';

/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable no-process-env */

const { given, when, then, build } = require('../common.gwt');

const container      = require('../../container');
const TestCommand    = require('../../../../dist/node/test/commands/TestCommand');
const CommandRunner  = require('../../../../dist/node/console/services/CommandRunner');

const originalProcessArgv = process.argv;
const originalProcessEnv  = process.env;

let fakeSpawnProcess;
let spiedSpawn;
let fakeProcessArgv;
let fakeProcessEnv;
let commandRunner;
let testCommand;
let commandArgv;


//-- Mocks
//--------------------------------------------------------

const fakeJestEngine = {
	getPathArgument: jest.fn(() => { return '/path/to/jest'; })
};

const fakeTerminal = {};


//-- Given
//--------------------------------------------------------

given.mockedChildProcess = () => {
	jest.mock('child_process', () => {
		const EventEmitter = require('events'); // eslint-disable-line global-require
		const spawnProcess = new EventEmitter();
		fakeSpawnProcess   = spawnProcess;
		const spawn        = jest.fn(() => { return spawnProcess; });
		spiedSpawn         = spawn;

		return { spawn };
	});
};

given.fakeProcessArgv = () => {
	fakeProcessArgv = [...originalProcessArgv];
	process.argv = fakeProcessArgv;
};

given.fakeProcessEnv = () => {
	fakeProcessEnv = { ...originalProcessEnv };
	process.env    = fakeProcessEnv;
};

given.fakeJestTestEngine = () => {
	container.singleton('test.engine.jest', fakeJestEngine);
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.commandRunner = () => {
	commandRunner = container.make(CommandRunner);
	commandArgv = {};
};

given.testCommand = () => {
	testCommand = container.make(TestCommand, {
		app:       container,
		terrminal: container.make('terminal')
	});
};

given.argv = (key, value) => {
	commandArgv[key] = value;
};

given.allFlag = () => {
	given.argv('all', true);
};

given.unitFlag = () => {
	given.argv('unit', true);
};

given.featureFlag = () => {
	given.argv('feature', true);
};

given.endToEndFlag = () => {
	given.argv('endtoend', true);
};

given.integrationFlag = () => {
	given.argv('integration', true);
};

given.unitOption = () => {
	given.argv('type', 'unit');
};

given.featureOption = () => {
	given.argv('type', 'feature');
};

given.endToEndOption = () => {
	given.argv('type', 'endtoend');
};

given.integrationOption = () => {
	given.argv('type', 'integration');
};


//-- When
//--------------------------------------------------------

when.runningCommand = async () => {
	await when.attemptingAsync(async () => {
		const argv = Object.fromEntries([
			...testCommand.parameters.map(([name,, defaultValue]) => {
				return [name, defaultValue];
			}),
			...testCommand.options.map(([name, defaultValue]) => {
				return [name, defaultValue];
			})
		]);
		setTimeout(() => { fakeSpawnProcess.emit('close', 0); }, 5);
		await commandRunner.unsafeRun(testCommand, { ...argv, ...commandArgv });
	});
};


//-- Then
//--------------------------------------------------------

then.resetFakeSpawnProcess = () => {
	fakeSpawnProcess.removeAllListeners();
};

then.resetProcessArgv = () => {
	process.argv = originalProcessArgv;
};

then.resetProcessEnv = () => {
	process.env = originalProcessEnv;
};

then.processEnvShouldHave = (key, value) => {
	then.shouldNotHaveThrown();
	expect(process.env[key]).toBe(value);
};

then.shouldRunTestInRepository = (repositoryName) => {
	then.processEnvShouldHave('TEST_REPOSITORY', repositoryName);
	expect(spiedSpawn).toHaveBeenCalledTimes(1);
};

then.shouldRunAllTests = () => {
	then.shouldRunTestInRepository('test');
};

then.shouldRunUnitTests = () => {
	then.shouldRunTestInRepository('test.unit');
};

then.shouldRunFeatureTests = () => {
	then.shouldRunTestInRepository('test.feature');
};

then.shouldRunEndToEndTests = () => {
	then.shouldRunTestInRepository('test.endtoend');
};

then.shouldRunIntegrationTests = () => {
	then.shouldRunTestInRepository('test.integration');
};


module.exports = build({ given, when, then });

/* eslint-enable unicorn/prevent-abbreviations */
/* eslint-enable no-process-env */
