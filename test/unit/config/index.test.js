//--------------------------------------------------------
//-- Tests - Unit - Config
//--------------------------------------------------------
'use strict';

const path = require('path');
const { container, loadFreshContainer } = require('./../common');
const ConfigServiceProvider = require('./../../../src/config/providers/ConfigServiceProvider');
const ConfigRepository = require('./../../../src/config/repositories/ConfigRepository');


describe('Spark IoC - Config', () => {

	beforeEach(() => {
		loadFreshContainer();
		container.register(ConfigServiceProvider);
		container.configurePaths({
			base: __dirname,
			config: path.join(__dirname, 'stubs')
		});
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
			config.setFile(path.join(__dirname, 'stubs', 'config.js'));
		});


		test('Can read configuration', () => {
			expect(config.get('test')).toStrictEqual({ foo:'bar' });
			expect(config.get('test.foo')).toBe('bar');
		});

		test('Can set configuration', () => {
			expect(config.get('test')).toStrictEqual({ foo:'bar' });

			config.set({ test:{ foo:'foo' } });
			expect(config.get('test')).toStrictEqual({ foo:'foo' });

			config.setConfig({ test:{ foo:'baz' } });
			expect(config.get('test')).toStrictEqual({ foo:'baz' });
		});

		test('Can change configuration', () => {
			expect(config.get('test.foo')).toBe('bar');

			config.set('test.foo', 'foo');
			expect(config.get('test.foo')).toBe('foo');
		});

	});


	describe('Configurable provider registrations', () => {

		test('Application should register configured service provider', () => {
			container.onBooted(() => {
				expect(container.make('test')).toStrictEqual({ foo:'bar' });
				expect(container.make('test2')).toStrictEqual({ foo:'baz' });
			});
		});

	});

});
