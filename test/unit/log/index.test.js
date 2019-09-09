//--------------------------------------------------------
//-- Tests - Unit - HTTP
//--------------------------------------------------------
'use strict';

const __                     = require('@absolunet/private-registry');
const container              = require('../common');
const LogServiceProvider     = require('../../../lib/log/providers/LogServiceProvider');
const SupportServiceProvider = require('../../../lib/support/providers/SupportServiceProvider');


describe('Node IoC - Log', () => {

	beforeEach(() => {
		container.register(LogServiceProvider);
		container.register(SupportServiceProvider);
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
					},
					file: {
						driver: 'file'
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


		describe('Error handling', () => {

			let errorCallback;

			beforeEach(() => {
				errorCallback = jest.fn();
				logger.addDriver('broken', {});
				logger.addDriver('file', { log: fakeLog, setConfig: fakeSetConfig });
			});

			test('Fallback to file channel if error happens during logging process', (done) => {
				logger.logWithChannel('broken', 1, message)
					.catch(errorCallback)
					.finally(() => {
						expect(errorCallback).not.toHaveBeenCalled();
						expect(fakeLog).toHaveBeenCalledTimes(2);
						expect(fakeLog.mock.calls[0][0]).toBe(4);
						expect(fakeLog.mock.calls[0][1]).toBe('Error thrown while logging: Cannot find logging channel [broken]. Switching to [file] channel.');
						expect(fakeLog.mock.calls[1][0]).toBe(1);
						expect(fakeLog.mock.calls[1][1]).toBe(message);
						done();
					});
			});

			test('Does not exit process if file channel throws', (done) => {
				fakeLog = jest.fn(() => { throw new TypeError('Fallback driver error'); });
				logger.addDriver(logger.fallbackChannel, { log: fakeLog, setConfig: fakeSetConfig });
				logger.logWithFallbackChannel(1, message)
					.catch(errorCallback)
					.finally(() => {
						expect(errorCallback).not.toHaveBeenCalled();
						expect(fakeLog).toHaveBeenCalled();
						done();
					});
			});

		});

		describe('Logging threshold', () => {

			beforeEach(() => {
				container.make('config').set('logging', {
					'default': 'test',
					'channels': {
						test: {
							driver: 'test',
							level: 'error'
						}
					}
				});
			});

			test('Can set a logging threshold to prevent abusive logging in some channels', async (done) => {
				await logger.debug(message);
				await logger.info(message);
				await logger.notice(message);
				await logger.warning(message);
				await logger.error(message);
				await logger.critical(message);
				await logger.alert(message);
				await logger.emergency(message);

				expect(fakeLog).toHaveBeenCalledTimes(4);
				expect(fakeLog.mock.calls[0][0]).toBe(4);
				expect(fakeLog.mock.calls[1][0]).toBe(5);
				expect(fakeLog.mock.calls[2][0]).toBe(6);
				expect(fakeLog.mock.calls[3][0]).toBe(7);

				done();
			});

		});

		describe('Drivers', () => {

			let driver;

			describe('File Driver', () => {

				let content;
				let appendFile;
				let ensureFile;
				let readFile;
				let writeFile;
				let stat;

				beforeEach(() => {
					ensureFile = jest.fn(() => { return Promise.resolve(); });
					appendFile = jest.fn((file, text) => {
						content += text;

						return Promise.resolve();
					});
					readFile = jest.fn(() => {
						return Promise.resolve(content);
					});
					writeFile = jest.fn((file, text) => {
						content = text;

						return Promise.resolve();
					});
					stat = jest.fn(() => { return Promise.resolve({ size: content.length }); });
					__(container.make('file.engine').__instance).set('async', {
						appendFile,
						ensureFile,
						readFile,
						writeFile,
						stat
					});
					driver = logger.driver('file');
					driver.setConfig({ path: '/test.log', limit: '1kb' });
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

				describe('Interface', () => {

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

				describe('Limit', () => {

					test('Reduce file size when exceeding based on configuration', async (done) => {
						content = `${message}\n\n`.repeat(57);
						expect(content.length).toBe(1026);

						await driver.log('info', message);
						expect(content.length).toBe(1016);

						await driver.log('info', message);
						expect(content.length).toBe(1024);

						await driver.log('info', message);
						expect(content.length).toBe(1014);

						done();
					});

					test('Do not reduce file size when not exceeding based on configuration', async (done) => {
						content = `${message}\n\n`.repeat(40);
						expect(content.length).toBe(720);

						await driver.log('info', message);
						expect(content.length).toBe(800);

						await driver.log('info', message);
						expect(content.length).toBe(880);

						done();
					});

					test('Throw an error if configured limit exceed the driver threshold', async (done) => {
						driver.setConfig({ limit: '100Gb' });

						const originalContent = content;
						await expect(driver.log('info', message)).rejects.not.toBe(null);
						expect(content).toBe(originalContent);

						done();
					});

				});

			});

			describe('Database Driver', () => {

				const command = 'test:log:database';
				let records;
				let connection;
				let getConnection;
				let fakeInsert;
				let fakeDelete;
				let fakeBuilder;
				let fakeSelect;
				let now;

				beforeEach(() => {
					records = [];
					now = jest.fn(() => { return '1970-01-01 00:00:01'; });
					fakeBuilder = {
						where:   jest.fn(() => { return fakeBuilder; }),
						from:    jest.fn(() => { return fakeBuilder; }),
						orderBy: jest.fn(() => { return fakeBuilder; }),
						count:   jest.fn(() => { return Promise.resolve([{ count: records.length }]); }),
						limit:   jest.fn((limit) => { return Promise.resolve(records.slice(0, limit)); })
					};
					fakeInsert = jest.fn(() => {
						records.push({ id: records.length + 1 });

						return Promise.resolve();
					});
					fakeDelete = jest.fn(() => {
						return fakeBuilder;
					});
					fakeSelect = jest.fn(() => {
						return fakeBuilder;
					});
					const connectionMethods = {
						'insert': fakeInsert,
						'delete': fakeDelete,
						'select': fakeSelect,
						'fn': { now }
					};
					connection = jest.fn(() => {
						return connectionMethods;
					});
					Object.assign(connection, connectionMethods);
					getConnection = jest.fn(() => {
						return connection;
					});
					container.singleton('db', { getConnection });
					container.singleton('terminal', { command });
					driver = logger.driver('database');
				});


				test('Can change configuration', async (done) => {
					await driver.log('debug', message);
					driver.setConfig({ connection: 'other' });
					await driver.log('debug', message);
					expect(getConnection).toHaveBeenCalledTimes(4);
					expect(getConnection.mock.calls[0][0]).toBe('default');
					expect(getConnection.mock.calls[2][0]).toBe('other');
					done();
				});

				describe('Interface', () => {

					test('Can log a debug message with level as string', async (done) => {
						const level = 0;
						await driver.log('debug', message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log a debug message with level as number', async (done) => {
						const level = 0;
						await driver.log(level, message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log an info message with level as string', async (done) => {
						const level = 1;
						await driver.log('info', message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log an info message with level as number', async (done) => {
						const level = 1;
						await driver.log(level, message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log a notice message with level as string', async (done) => {
						const level = 2;
						await driver.log('notice', message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log a notice message with level as number', async (done) => {
						const level = 2;
						await driver.log(level, message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log a warning message with level as string', async (done) => {
						const level = 3;
						await driver.log('warning', message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log a warning message with level as number', async (done) => {
						const level = 3;
						await driver.log(level, message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log an error message with level as string', async (done) => {
						const level = 4;
						await driver.log('error', message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log an error message with level as number', async (done) => {
						const level = 4;
						await driver.log(level, message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log a critical message with level as string', async (done) => {
						const level = 5;
						await driver.log('critical', message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log a critical message with level as number', async (done) => {
						const level = 5;
						await driver.log(level, message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log an alert message with level as string', async (done) => {
						const level = 6;
						await driver.log('alert', message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log an alert message with level as number', async (done) => {
						const level = 6;
						await driver.log(level, message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log an emergency message with level as string', async (done) => {
						const level = 7;
						await driver.log('emergency', message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

					test('Can log an emergency message with level as number', async (done) => {
						const level = 7;
						await driver.log(level, message);
						expect(fakeInsert).toHaveBeenCalledTimes(1);
						expect(fakeInsert.mock.calls[0][0]).toEqual(expect.objectContaining({
							level,
							message,
							command
						}));
						done();
					});

				});

				describe('Limit', () => {

					test('Delete exceeding records when exceeding records limit based on configuration', async (done) => {
						driver.setConfig({ limit: 1 });
						await driver.log('info', message);
						await driver.log('warning', message);
						expect(fakeDelete).toHaveBeenCalledTimes(1);
						done();
					});

					test('Do not delete records when not exceeding records limit based on configuration', async (done) => {
						driver.setConfig({ limit: 2 });
						await driver.log('info', message);
						await driver.log('warning', message);
						expect(fakeDelete).not.toHaveBeenCalled();
						done();
					});

				});

			});

		});

	});

});
