//--------------------------------------------------------
//-- Tests - Unit - Foundation
//--------------------------------------------------------
'use strict';


const container = require('./../common');
const ServiceProvider = require('./../../../lib/foundation/ServiceProvider');


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


	describe('Service providers', () => {

		test('Can register service provider', () => {
			const obj = { pass:true };
			const mockedRegister = jest.fn();

			class TestServiceProvider {

				register() {
					mockedRegister();
					this.app.bind('test', () => {
						return obj;
					});
				}

			}

			container.register(TestServiceProvider);
			container.bootIfNotBooted();
			expect(mockedRegister.mock.calls.length).toBe(1);
			expect(container.make('test')).toBe(obj);
		});

		test('Service provider can register other service providers', () => {
			const obj = { pass:true };

			class SubtestServiceProvider {

				register() {
					this.app.bind('test', () => {
						return obj;
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

			expect(container.make('test')).toBe(obj);
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
