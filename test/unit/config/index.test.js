//--------------------------------------------------------
//-- Tests - Unit - Config
//--------------------------------------------------------
'use strict';

const path = require('path');

const configData            = require('./stubs/config/data');
const FileLoader            = require('./stubs/services/FakeFileLoader');
const container             = require('./../common');
const ConfigServiceProvider = require('./../../../lib/config/providers/ConfigServiceProvider');
const ConfigRepository      = require('./../../../lib/config/repositories/ConfigRepository');


describe('Node IoC - Config', () => {

	beforeEach(() => {
		container.register(ConfigServiceProvider);
		container.configurePaths({
			config: path.join(__dirname, 'stubs', 'config')
		});

		container.singleton('file', FileLoader);
		container.bootIfNotBooted();
	});


	describe('Provider', () => {

		test('Container contains config repository', () => {
			expect(container.make('config')).toBeInstanceOf(ConfigRepository);
		});

	});


	describe('Repository', () => {

		let config;

		beforeEach(() => {
			config = container.make('config');
		});

		test('Can read configuration', () => {
			expect(config.get()).toStrictEqual(configData);
			expect(config.get('test')).toStrictEqual(configData.test);
			expect(config.get('test.foo')).toBe(configData.test.foo);
		});

		test('Can set configuration', () => {
			expect(config.get('test')).toStrictEqual(configData.test);

			config.set({ test: { foo: 'foo' } });
			expect(config.get('test.foo')).toBe('foo');

			config.setConfig({ test: { foo: 'baz' } });
			expect(config.get('test.foo')).toBe('baz');

			config.set('test.foo', 'qux');
			expect(config.get('test.foo')).toBe('qux');
		});

	});


	describe('Configurable provider registrations', () => {

		test('Application should register configured service provider', () => {
			container.onBooted(() => {
				expect(container.make('test')).toStrictEqual({ foo: 'bar' });
				expect(container.make('test2')).toStrictEqual({ foo: 'baz' });
			});
		});

	});


	describe('Grammar', () => {

		let grammar;
		let environment;

		beforeEach(() => {
			grammar = container.make('config.grammar');
			environment = container.make('env');
		});


		describe('Path', () => {

			test('Replacement is correctly working', () => {
				['foo/bar', 'foo/bar.js'].forEach((filePath) => {
					expect(grammar.formatPath(`/${filePath}`)).toBe(`/${filePath}`);
					expect(grammar.formatPath(filePath)).toBe(filePath);
					expect(grammar.formatPath(`@${filePath}`)).toBe(`@${filePath}`);
					expect(grammar.formatPath(`@/${filePath}`)).toBe(`${container.make('path.base')}/${filePath}`);
				});
			});

		});


		describe('Environment', () => {

			beforeEach(() => {
				environment.setFromFile(path.join(__dirname, 'stubs', '.env.stub'));
			});

			test('Replacement is working with existing variable', () => {
				expect(grammar.formatEnvironment('{{APP_ENV}}')).toBe('test');
			});

			test('Replacement is working with existing variable with fallback', () => {
				expect(grammar.formatEnvironment('{{APP_ENV|fallback}}')).toBe('test');
			});

			test('Replacement is working with undefined variable', () => {
				expect(grammar.formatEnvironment('{{APP_UNDEFINED}}')).toBeNull();
			});

			test('Replacement is working with undefined variable with fallback', () => {
				expect(grammar.formatEnvironment('{{APP_UNDEFINED|fallback}}')).toBe('fallback');
			});

		});


		describe('Global formatting', () => {

			beforeEach(() => {
				environment.setFromFile(path.join(__dirname, 'stubs', '.env.stub'));
			});

			test('Replacement is working with path', () => {
				expect(grammar.format('@/foo/bar')).toBe(`${container.make('path.base')}/foo/bar`);
			});

			test('Replacement is working with environment variable', () => {
				expect(grammar.format('{{APP_ENV}}')).toBe('test');
			});

			test('Replacement is working with combination of path and environment variable', () => {
				expect(grammar.format('@/foo/{{APP_ENV}}')).toBe(`${container.make('path.base')}/foo/test`);
			});

		});


		describe('Dynamic formatting', () => {

			let config;

			beforeEach(() => {
				config = container.make('config');
				environment.setFromFile(path.join(__dirname, 'stubs', '.env.stub'));
			});

			test('Configuration value is dynamically formatted for paths', () => {
				config.set('foo.bar', '@/foo/bar');
				expect(config.get('foo.bar')).toBe(`${container.make('path.base')}/foo/bar`);
			});

			test('Configuration value is dynamically formatted for environment variables', () => {
				config.set('foo.bar', '{{APP_ENV}}');
				expect(config.get('foo.bar')).toBe('test');
			});

			test('Value evaluated to null returns null', () => {
				config.set('foo.bar', '{{APP_UNDEFINED|null}}');
				expect(config.get('foo.bar')).toBeNull();
			});

		});

	});

});
