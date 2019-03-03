//--------------------------------------------------------
//-- Tests - Unit - Console
//--------------------------------------------------------
'use strict';

const childProcess = require('child_process');
const { container, loadFreshContainer } = require('./../common');
const ConsoleServiceProvider = require('./../../../src/console/providers/ConsoleServiceProvider');
const ListCommand = require('./../../../src/console/commands/ListCommand');
const TestCommand = require('./stubs/commands/TestCommand');


describe('Spark IoC - Console', () => {

	beforeEach(() => {
		loadFreshContainer();
		container.register(ConsoleServiceProvider);
		container.bootIfNotBooted();
	});


	describe('Commands', () => {

		test('Command is registered in repository', () => {
			container.onBooted(() => {
				const commandRepository = container.make('command');
				const commandCount = commandRepository.all().length;
				commandRepository.add(TestCommand);
				expect(commandRepository.all().length).toBe(commandCount + 1);
			});
		});

		test('Command "list" should exists and be the default command', () => {
			const stdouts = [];
			const testCase = (command) => {
				const c = command ? ` ${command}` : '';

				return new Promise((resolve) => {
					childProcess.exec(`node index.js${c}`, (err, stdout) => {
						expect(err).toBeFalsy();
						const { description } = container.make(ListCommand);
						const regex = new RegExp(`[a-z-.]+\n\n${description}`, 'u');
						expect(regex.test(stdout)).toBeTruthy();
						stdouts.push(stdout);
						resolve();
					});
				});
			};

			return Promise.all([
				testCase('--help'),
				testCase('help'),
				testCase('list'),
				testCase('')
			]).then(() => {
				const out = stdouts.shift();
				stdouts.forEach((stdout) => {
					expect(stdout).toBe(out);
				});
			});
		});

	});

});
