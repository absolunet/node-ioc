//--------------------------------------------------------
//-- Tests - Unit - Console
//--------------------------------------------------------
'use strict';

const { container, loadFreshContainer } = require('./../common');
const ConsoleServiceProvider = require('./../../../src/console/providers/ConsoleServiceProvider');
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

	});

});
