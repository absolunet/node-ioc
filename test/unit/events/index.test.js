//--------------------------------------------------------
//-- Tests - Unit - HTTP
//--------------------------------------------------------
'use strict';

const container = require('./../common');


describe('Node IoC - Events', () => {

	beforeEach(() => {
		container.bootIfNotBooted();
	});


	test('Event service is resolvable', () => {
		expect(container.isBound('event')).toBe(true);
		expect(container.make('event')).toBeTruthy();
	});


	describe('Dispatcher', () => {

		let dispatcher;

		beforeEach(() => {
			dispatcher = container.make('event');
		});

		test('Has driver', () => {
			expect(() => {
				dispatcher.driver();
			}).not.toThrow();
		});

		test('Has engine', () => {
			expect(dispatcher.engine).toBeTruthy();
		});

		test('Forward calls to driver', () => {
			expect(dispatcher.on).toBeTruthy();
			expect(typeof dispatcher.on).toBe(typeof dispatcher.driver().on);
		});

	});


	describe('Drivers', () => {

		let driver;

		let listener1;

		let listener2;

		let listener3;

		let payload;

		beforeEach(() => {
			listener1 = jest.fn();
			listener2 = jest.fn();
			listener3 = jest.fn();
			payload = {};
		});

		[
			{
				name: 'emitter',
				emit: 'emit'
			},
			{
				name: 'pubsubjs',
				emit: 'publishSync'
			}
		].forEach(({ name, emit }) => {
			describe(`${name} driver`, () => {

				beforeEach(() => {
					driver = container.make('event').driver(name);
				});

				test('Can add event listener', () => {
					driver.on('test', listener1);
					driver.on('test', listener2);
					driver.engine[emit]('test', payload);
					driver.engine[emit]('test', payload);

					expect(listener1).toHaveBeenCalledTimes(2);
					expect(listener2).toHaveBeenCalledTimes(2);
					expect(listener1).toHaveBeenCalledWith('test', payload);
					expect(listener2).toHaveBeenCalledWith('test', payload);
				});

				test('Can remove event listener', () => {
					driver.on('test', listener1);
					driver.on('test', listener2);
					driver.off('test', listener1);
					driver.engine[emit]('test', payload);
					driver.engine[emit]('test', payload);

					expect(listener1).not.toHaveBeenCalled();
					expect(listener2).toHaveBeenCalledTimes(2);
				});

				test('Can add event listener for a single execution', () => {
					driver.once('test', listener1);
					driver.once('test', listener2);
					driver.engine[emit]('test', payload);
					driver.engine[emit]('test', payload);

					expect(listener1).toHaveBeenCalledTimes(1);
					expect(listener2).toHaveBeenCalledTimes(1);
					expect(listener1).toHaveBeenCalledWith('test', payload);
					expect(listener2).toHaveBeenCalledWith('test', payload);
				});

				test('Can emit event', () => {
					driver.on('test', listener1);
					driver.on('test', listener2);
					driver.emit('test', payload);
					driver.emit('test', payload);

					expect(listener1).toHaveBeenCalledTimes(2);
					expect(listener2).toHaveBeenCalledTimes(2);
					expect(listener1).toHaveBeenCalledWith('test', payload);
					expect(listener2).toHaveBeenCalledWith('test', payload);
				});

				test('Can remove all listener for a given event', () => {
					driver.on('test', listener1);
					driver.on('test', listener2);
					driver.on('other.test', listener3);
					driver.removeListeners('test');
					driver.emit('test', payload);
					driver.emit('other.test', payload);

					expect(listener1).not.toHaveBeenCalled();
					expect(listener2).not.toHaveBeenCalled();
					expect(listener3).toHaveBeenCalledTimes(1);
				});

				test('Can remove all listener for all events', () => {
					driver.on('test', listener1);
					driver.on('test', listener2);
					driver.on('other.test', listener3);
					driver.removeAllListeners();
					driver.emit('test', payload);
					driver.emit('other.test', payload);

					expect(listener1).not.toHaveBeenCalled();
					expect(listener2).not.toHaveBeenCalled();
					expect(listener3).not.toHaveBeenCalled();
				});

			});

		});
	});

});
