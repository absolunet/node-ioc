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

		beforeEach(() => {
			grammar = container.make('config.grammar');
		});

		test('Replacements are correctly working', () => {
			['foo/bar', 'foo/bar.js'].forEach((filePath) => {
				expect(grammar.formatPath(`/${filePath}`)).toBe(`/${filePath}`);
				expect(grammar.formatPath(filePath)).toBe(filePath);
				expect(grammar.formatPath(`@${filePath}`)).toBe(`@${filePath}`);
				expect(grammar.formatPath(`@/${filePath}`)).toBe(`${container.make('path.base')}/${filePath}`);
			});
		});
	});

});
