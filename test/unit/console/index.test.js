//--------------------------------------------------------
//-- Tests - Unit - Console
//--------------------------------------------------------
'use strict';

const __                     = require('@absolunet/private-registry');
const childProcess           = require('child_process');
const TestCommand            = require('./stubs/commands/TestCommand');
const TestMakeCommand        = require('./stubs/commands/TestMakeCommand');
const container              = require('../common');
const ListCommand            = require('../../../lib/console/commands/ListCommand');
const ConsoleServiceProvider = require('../../../lib/console/providers/ConsoleServiceProvider');


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

		test('Command "list" should exists and be the default command', async (done) => {
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

			await Promise.all([
				testCase('list'),
				testCase('')
			]);

			const out = stdouts.shift();
			stdouts.forEach((stdout) => {
				expect(stdout).toBe(out);
			});

			done();
		});

		describe('Strict mode', () => {

			let errorCallback;
			const { error } = console; // eslint-disable-line no-console

			beforeEach(() => {
				console.error = jest.fn(); // eslint-disable-line no-console
				errorCallback = jest.fn();
			});

			afterAll(() => {
				console.error = error; // eslint-disable-line no-console
			});

			test('Command called with unhandled parameter fails', async (done) => {
				const registrar = container.make('command.registrar');
				await registrar.resolve('list foo').catch(errorCallback);
				expect(errorCallback).toHaveBeenCalledTimes(1);
				expect(errorCallback.mock.calls[0][0].message).toMatch(/Unknown argument: foo/u);
				done();
			});

			test('Command called with unhandled option fails', async (done) => {
				const registrar = container.make('command.registrar');
				await registrar.resolve('list --foo=bar').catch(errorCallback);
				expect(errorCallback).toHaveBeenCalledTimes(1);
				expect(errorCallback.mock.calls[0][0].message).toMatch(/Unknown argument: foo/u);
				done();
			});

			test('Command called with unhandled flag fails', async (done) => {
				const registrar = container.make('command.registrar');
				await registrar.resolve('list --foo').catch(errorCallback);
				expect(errorCallback).toHaveBeenCalledTimes(1);
				expect(errorCallback.mock.calls[0][0].message).toMatch(/Unknown argument: foo/u);
				done();
			});

		});


		describe('Generator commands', () => {

			let ensureDir; // eslint-disable-line unicorn/prevent-abbreviations

			let handleException;

			let writeFile;

			beforeEach(() => {
				ensureDir       = jest.fn(() => { return Promise.resolve(); });
				handleException = jest.fn(() => { return Promise.resolve(); });
				writeFile       = jest.fn(() => { return Promise.resolve(); });
				__(container.make('file.engine').__instance).set('async', { ensureDir, writeFile });
				container.singleton('exception.handler', { handle: handleException });
			});

			test('Can make file', async (done) => {
				const registrar = container.make('command.registrar');
				registrar.add(TestMakeCommand);
				await registrar.resolve('test:case:make SomeClass', true);
				expect(handleException).not.toHaveBeenCalled();
				expect(writeFile).toHaveBeenCalledTimes(1);
				const [[filePath, content]] = writeFile.mock.calls;
				expect(filePath.replace(/\\/gu, '/')).toMatch(/test\/unit\/console\/stubs\/commands\/stubs\/SomeClass\.js$/u);
				expect(content).toMatch(/\/\/-- Node IoC - Command - SomeClass\n/u);
				expect(content).toMatch(/class SomeClass \{\n/u);
				expect(content).toMatch(/module.exports = SomeClass;\n/u);
				done();
			});

			test('Can make file in directory', async (done) => {
				const registrar = container.make('command.registrar');
				registrar.add(TestMakeCommand);
				await registrar.resolve('test:case:make foo/SomeClass', true);
				expect(handleException).not.toHaveBeenCalled();
				expect(writeFile).toHaveBeenCalledTimes(1);
				const [[filePath, content]] = writeFile.mock.calls;
				expect(filePath.replace(/\\/gu, '/')).toMatch(/test\/unit\/console\/stubs\/commands\/stubs\/foo\/SomeClass\.js$/u);
				expect(content).toMatch(/\/\/-- Node IoC - Command - SomeClass\n/u);
				expect(content).toMatch(/class SomeClass \{\n/u);
				expect(content).toMatch(/module.exports = SomeClass;\n/u);
				done();
			});

		});

	});

	describe('Interceptor', () => {

		let interceptor;

		const givenCleanInterceptorsForJest = () => {
			interceptor
				.add((content) => {
					return content.trim().replace(/\s*console\.log.*[\w.@]+:\d+\n/u, '').trim();
				});
		};

		beforeEach(() => {
			interceptor = container.make('terminal.interceptor')
				.editable()
				.mute();
		});

		afterEach(() => {
			interceptor.disable();
		});

		test('Can intercept stdout', () => {
			const closure = jest.fn();
			interceptor.add(closure);
			process.stdout.write('Test');

			expect(closure).toHaveBeenCalledTimes(1);
		});

		test('Can read stdout in interceptor', () => {
			givenCleanInterceptorsForJest();
			const loggedContent = 'Test';
			const closure = jest.fn();

			interceptor.add(closure);
			process.stdout.write(loggedContent);
			process.stdout.write(loggedContent);

			expect(closure).toHaveBeenCalledTimes(2);
			expect(closure.mock.calls[0][0]).toBe(loggedContent);
			expect(closure.mock.calls[1][0]).toBe(loggedContent);
		});

		test('Can remove stdout interceptor', () => {
			const loggedContent = 'Test';
			const closure = jest.fn();

			interceptor.add(closure, 1);
			process.stdout.write(loggedContent);
			interceptor.remove(closure);
			process.stdout.write(loggedContent);

			expect(closure).toHaveBeenCalledTimes(1);
		});

		test('Can remove all interceptors', () => {
			const interceptor1 = jest.fn();
			const interceptor2 = jest.fn();
			const interceptor3 = jest.fn();
			interceptor.add(interceptor1);
			interceptor.add(interceptor2);
			interceptor.add(interceptor3);

			process.stdout.write('Test');
			interceptor.removeAll();
			process.stdout.write('Test');

			expect(interceptor1).toHaveBeenCalledTimes(1);
			expect(interceptor2).toHaveBeenCalledTimes(1);
			expect(interceptor3).toHaveBeenCalledTimes(1);
		});

		test('Can edit output content', () => {
			givenCleanInterceptorsForJest();
			const loggedContent      = 'Test';
			const transformedContent = 'Foo';
			let receivedContent;

			interceptor.add(() => {
				return transformedContent;
			});

			interceptor.add((content) => {
				receivedContent = content;
			});

			process.stdout.write(loggedContent);

			expect(receivedContent).toBe(transformedContent);
		});

		test('Can disable edition', () => {
			interceptor.uneditable();
			givenCleanInterceptorsForJest();
			const loggedContent      = 'Test';
			const transformedContent = 'Foo';
			let receivedContent;

			interceptor.add(() => {
				return transformedContent;
			});

			interceptor.add((content) => {
				receivedContent = content;
			});

			process.stdout.write(loggedContent);

			expect(receivedContent).not.toBe(transformedContent);
		});

		test('Can keep color from chalk in interceptors', () => {
			givenCleanInterceptorsForJest();
			const loggedContent = 'Test';
			let receivedContent;

			interceptor.keepStyle();

			interceptor.add((content) => {
				receivedContent = content;
			});

			process.stdout.write(`\u001B[36m${loggedContent}\u001B[0m`);

			expect(receivedContent).toBeTruthy();
			expect(receivedContent.includes(loggedContent)).toBe(true);
			expect(receivedContent).not.toBe(loggedContent);
		});

		test('Can remove color from chalk in interceptors', () => {
			givenCleanInterceptorsForJest();
			const loggedContent = 'Test';
			let receivedContent;

			interceptor.removeStyle();

			interceptor.add((content) => {
				receivedContent = content;
			});

			process.stdout.write(`\u001B[36m${loggedContent}\u001B[0m`);

			expect(receivedContent).toBeTruthy();
			expect(receivedContent.includes(loggedContent)).toBe(true);
			expect(receivedContent).toBe(loggedContent);
		});

	});

});
