//--------------------------------------------------------
//-- Tests - Unit - Foundation
//--------------------------------------------------------
'use strict';

const slash           = require('slash');
const container       = require('../common');
const ServiceProvider = require('../../../lib/foundation/ServiceProvider');



describe('Node IoC - Foundation', () => {

	describe('Bootstrap', () => {

		test('Can boot', () => {
			expect(container).toHaveProperty('booted');
			expect(container.booted).toBe(false);
			container.boot();
			expect(container.booted).toBe(true);
		});

		test('Can boot only once', () => {
			expect(container).toHaveProperty('booted');
			expect(container.booted).toBe(false);
			container.boot();
			expect(container.booted).toBe(true);
			expect(container.boot.bind(container)).toThrow();
		});

		test('Can boot if not booted', () => {
			expect(container).toHaveProperty('booted');
			expect(container.booted).toBe(false);
			container.bootIfNotBooted();
			expect(container.booted).toBe(true);
			expect(container.bootIfNotBooted.bind(container)).not.toThrow();
			expect(container.booted).toBe(true);
		});

	});


	describe('Paths', () => {

		test('Can set base path', () => {
			const originalBasePath       = container.make('path.base');
			const originalAppPath        = container.make('path.app');
			const originalConfigPath     = container.make('path.config');
			const originalControllerPath = container.make('path.controller');

			container.useBasePath(__dirname);

			const newBasePath       = container.make('path.base');
			const newAppPath        = container.make('path.app');
			const newConfigPath     = container.make('path.config');
			const newControllerPath = container.make('path.controller');

			expect(newBasePath).not.toBe(originalBasePath);
			expect(newAppPath).not.toBe(originalAppPath);
			expect(newConfigPath).not.toBe(originalConfigPath);
			expect(newControllerPath).not.toBe(originalControllerPath);

			expect(newBasePath).toBe(slash(__dirname));
			expect(newAppPath.startsWith(slash(__dirname))).toBe(true);
			expect(newConfigPath.startsWith(slash(__dirname))).toBe(true);
			expect(newControllerPath.startsWith(slash(__dirname))).toBe(true);
		});

		test('Can set app base path', () => {
			const originalBasePath       = container.make('path.base');
			const originalAppPath        = container.make('path.app');
			const originalConfigPath     = container.make('path.config');
			const originalControllerPath = container.make('path.controller');

			container.useAppPath('otherApp');

			const newBasePath       = container.make('path.base');
			const newAppPath        = container.make('path.app');
			const newConfigPath     = container.make('path.config');
			const newControllerPath = container.make('path.controller');

			expect(newBasePath).toBe(originalBasePath);
			expect(newConfigPath).toBe(originalConfigPath);
			expect(newAppPath).not.toBe(originalAppPath);
			expect(newControllerPath).not.toBe(originalControllerPath);

			expect(newAppPath.endsWith('otherApp')).toBe(true);
			expect(newControllerPath.startsWith(slash(originalBasePath))).toBe(true);
			expect(newControllerPath.endsWith(slash('otherApp/http/controllers'))).toBe(true);
		});

	});


	describe('Service providers', () => {

		test('Can register service provider', () => {
			const object = { pass: true };
			const mockedRegister = jest.fn();

			class TestServiceProvider {

				register() {
					mockedRegister();
					this.app.bind('test', () => {
						return object;
					});
				}

			}

			container.register(TestServiceProvider);
			container.bootIfNotBooted();
			expect(mockedRegister.mock.calls.length).toBe(1);
			expect(container.make('test')).toBe(object);
		});

		test('Service provider can register other service providers', () => {
			const object = { pass: true };

			class SubtestServiceProvider {

				register() {
					this.app.bind('test', () => {
						return object;
					});
				}

			}

			class TestServiceProvider {

				register() {
					this.app.register(SubtestServiceProvider);
				}

			}

			container.register(TestServiceProvider);
			container.boot();

			expect(container.make('test')).toBe(object);
		});

		test('Service provider automatically injects the application', () => {
			class TestServiceProvider extends ServiceProvider {

				register() {
					expect(this.app).toBe(container.make('app'));
					expect(this.app).toBeInstanceOf(container.constructor);
				}

			}

			container.register(TestServiceProvider);
			container.boot();
		});

	});


	describe('Events', () => {

		test('Events are correctly dispatched', () => {
			container.onBooting(() => {
				expect(container.booted).toBe(false);
			});

			container.onBooted(() => {
				expect(container.booted).toBe(true);
			});

			container.boot();
		});

		test('Event "Booted" is correctly dispatched if already passed', () => {
			container.boot();
			const callback = jest.fn();
			container.onBooted(callback);
			expect(callback.mock.calls.length).toBe(1);
		});
	});

});
