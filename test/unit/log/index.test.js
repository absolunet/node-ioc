//--------------------------------------------------------
//-- Tests - Unit - HTTP
//--------------------------------------------------------
'use strict';

const __                    = require('@absolunet/private-registry');
const container             = require('../common');
const FileServiceProvider   = require('../../../lib/file/providers/FileServiceProvider');
const ConfigServiceProvider = require('../../../lib/config/providers/ConfigServiceProvider');
const LogServiceProvider    = require('../../../lib/log/providers/LogServiceProvider');


describe('Node IoC - Log', () => {

	beforeEach(() => {
		container.register(FileServiceProvider);
		container.register(ConfigServiceProvider);
		container.register(LogServiceProvider);
		container.bootIfNotBooted();
	});

	test('Logger is resolvable', () => {
		expect(container.isBound('log')).toBe(true);
		expect(container.make('log')).toBeTruthy();
	});

	describe('Logger', () => {

		let logger;

		let fakeLog;

		let fakeSetConfig;

		const message = 'A message to log';

		beforeEach(() => {
			container.make('config').set('logging', {
				'default': 'test',
				'channels': {
					test: {
						driver: 'test'
					}
				}
			});
			fakeLog       = jest.fn(() => { return Promise.resolve(); });
			fakeSetConfig = jest.fn();
			logger = container.make('log');
			logger.addDriver('test', { log: fakeLog, setConfig: fakeSetConfig });
		});

		describe('Logging methods', () => {

			test('Can debug', () => {
				logger.debug(message);
				expect(fakeLog).toHaveBeenCalledTimes(1);
				expect(fakeLog).toHaveBeenCalledWith(0, message, undefined);
			});

			test('Can info', () => {
				logger.info(message);
				expect(fakeLog).toHaveBeenCalledTimes(1);
				expect(fakeLog).toHaveBeenCalledWith(1, message, undefined);
			});

			test('Can notice', () => {
				logger.notice(message);
				expect(fakeLog).toHaveBeenCalledTimes(1);
				expect(fakeLog).toHaveBeenCalledWith(2, message, undefined);
			});

			test('Can warning', () => {
				logger.warning(message);
				expect(fakeLog).toHaveBeenCalledTimes(1);
				expect(fakeLog).toHaveBeenCalledWith(3, message, undefined);
			});

			test('Can error', () => {
				logger.error(message);
				expect(fakeLog).toHaveBeenCalledTimes(1);
				expect(fakeLog).toHaveBeenCalledWith(4, message, undefined);
			});

			test('Can critical', () => {
				logger.critical(message);
				expect(fakeLog).toHaveBeenCalledTimes(1);
				expect(fakeLog).toHaveBeenCalledWith(5, message, undefined);
			});

			test('Can alert', () => {
				logger.alert(message);
				expect(fakeLog).toHaveBeenCalledTimes(1);
				expect(fakeLog).toHaveBeenCalledWith(6, message, undefined);
			});

			test('Can emergency', () => {
				logger.emergency(message);
				expect(fakeLog).toHaveBeenCalledTimes(1);
				expect(fakeLog).toHaveBeenCalledWith(7, message, undefined);
			});

		});


		describe('Drivers', () => {

			let driver;

			describe('File Driver', () => {

				let appendFile;
				let ensureFile;

				beforeEach(() => {
					appendFile = jest.fn(() => { return Promise.resolve(); });
					ensureFile = jest.fn(() => { return Promise.resolve(); });
					__(container.make('file.engine').__instance).set('async', { appendFile, ensureFile });
					driver = logger.driver('file');
					driver.setConfig({ path: '/test.log' });
				});

				test('Can change configuration', async (done) => {
					await driver.log('debug', message);
					driver.setConfig({ path: '/other-test.log' });
					await driver.log('debug', message);
					expect(ensureFile).toHaveBeenCalledTimes(2);
					expect(ensureFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[1][0]).toBe('/other-test.log');
					done();
				});

				test('Can log a debug message with level as string', async (done) => {
					await driver.log('debug', message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('debug')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log a debug message with level as number', async (done) => {
					await driver.log(0, message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('debug')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log an info message with level as string', async (done) => {
					await driver.log('info', message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('info')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log an info message with level as number', async (done) => {
					await driver.log(1, message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('info')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log a notice message with level as string', async (done) => {
					await driver.log('notice', message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('notice')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log a notice message with level as number', async (done) => {
					await driver.log(2, message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('notice')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log a warning message with level as string', async (done) => {
					await driver.log('warning', message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('warning')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log a warning message with level as number', async (done) => {
					await driver.log(3, message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('warning')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log an error message with level as string', async (done) => {
					await driver.log('error', message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('error')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log an error message with level as number', async (done) => {
					await driver.log(4, message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('error')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log a critical message with level as string', async (done) => {
					await driver.log('critical', message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('critical')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log a critical message with level as number', async (done) => {
					await driver.log(5, message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('critical')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log an alert message with level as string', async (done) => {
					await driver.log('alert', message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('alert')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log an alert message with level as number', async (done) => {
					await driver.log(6, message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('alert')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log an emergency message with level as string', async (done) => {
					await driver.log('emergency', message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('emergency')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

				test('Can log an emergency message with level as number', async (done) => {
					await driver.log(7, message);
					expect(ensureFile).toHaveBeenCalledTimes(1);
					expect(ensureFile).toHaveBeenCalledWith('/test.log');
					expect(appendFile).toHaveBeenCalledTimes(1);
					expect(appendFile.mock.calls[0][0]).toBe('/test.log');
					expect(appendFile.mock.calls[0][1].includes('emergency')).toBe(true);
					expect(appendFile.mock.calls[0][1].includes(message)).toBe(true);
					done();
				});

			});

		});

	});

});
