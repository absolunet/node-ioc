//--------------------------------------------------------
//-- Tests - Unit - Config
//--------------------------------------------------------
'use strict';

const path = require('path');

const appData          = require('./stubs/config/app');
const miscData         = require('./stubs/config/misc');
const FileLoader       = require('./stubs/services/FakeFileLoader');
const container        = require('../common');
const ConfigRepository = require('../../../lib/config/repositories/ConfigRepository');


describe('Node IoC - Config', () => {

	beforeEach(() => {
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
			expect(config.get()).toMatchObject({ misc: miscData, app: appData });
			expect(config.get('misc')).toStrictEqual(miscData);
			expect(config.get('misc.foo')).toBe(miscData.foo);
		});

		test('Can set configuration', () => {
			expect(config.get('misc')).toStrictEqual(miscData);

			config.set({ misc: { foo: 'foo' } });
			expect(config.get('misc.foo')).toBe('foo');

			config.setConfig({ misc: { foo: 'baz' } });
			expect(config.get('misc.foo')).toBe('baz');

			config.set('misc.foo', 'qux');
			expect(config.get('misc.foo')).toBe('qux');
		});

		test('Can set configuration by overwriting object', () => {
			const oldFoo = { bar: 'baz' };
			config.set({ foo: oldFoo });
			expect(config.get('foo')).toStrictEqual(oldFoo);

			const newFoo = { lorem: 'ipsum' };
			config.set('foo', newFoo);
			expect(config.get('foo')).toStrictEqual(newFoo);
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
				expect(grammar.format('@/foo/{{APP_ENV}}')).toBe(container.basePath('/foo/test'));
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
