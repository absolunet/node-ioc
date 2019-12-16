//--------------------------------------------------------
//-- Tests - Unit - Test - Commands - Test Command - GWT
//--------------------------------------------------------

/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable no-process-env */

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container      from '../../container';
import TestCommand    from '../../../../dist/node/test/commands/TestCommand';
import CommandRunner  from '../../../../dist/node/console/services/CommandRunner';

const originalProcessArgv = process.argv;
const originalProcessEnv  = process.env;

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

const spiedSpawnProcess = jest.fn();

const fakeTerminal = {
	spawn: jest.fn(() => {
		return new Promise((resolve) => {
			setTimeout(() => {
				spiedSpawnProcess();
				resolve();
			});
		});
	})
};


//-- Given
//--------------------------------------------------------

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
		terminal: container.make('terminal')
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
		await commandRunner.unsafeRun(testCommand, { ...argv, ...commandArgv });
	});
};


//-- Then
//--------------------------------------------------------

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
	expect(fakeTerminal.spawn).toHaveBeenCalledTimes(1);
	expect(spiedSpawnProcess).toHaveBeenCalledTimes(1);
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


export default build({ given, when, then });

/* eslint-enable unicorn/prevent-abbreviations */
/* eslint-enable no-process-env */
