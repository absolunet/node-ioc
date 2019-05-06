//--------------------------------------------------------
//-- Tests - Unit - Console
//--------------------------------------------------------
'use strict';

const childProcess           = require('child_process');

const TestCommand            = require('./stubs/commands/TestCommand');
const container              = require('./../common');
const ListCommand            = require('./../../../lib/console/commands/ListCommand');
const ConsoleServiceProvider = require('./../../../lib/console/providers/ConsoleServiceProvider');


describe('Node IoC - Console', () => {

	beforeEach(() => {
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
					childProcess.exec(`node lib/app/index.js${c}`, { stdio: 'pipe' }, (error, stdout) => {
						expect(error).toBeFalsy();
						const { description } = container.make(ListCommand);
						const regex = new RegExp(`${description}`, 'u');
						expect(regex.test(stdout)).toBeTruthy();
						stdouts.push(stdout);
						resolve();
					});
				});
			};

			const promises = [
				testCase('--help'),
				testCase('help'),
				testCase('list'),
				testCase('')
			];

			return Promise.all(promises).then(() => {
				const out = stdouts.shift();
				stdouts.forEach((stdout) => {
					expect(stdout).toBe(out);
				});
			});
		});

	});

});
