//--------------------------------------------------------
//-- Tests - Unit - Cache
//--------------------------------------------------------
'use strict';

const fs         = require('fs');
const path       = require('path');
const container  = require('../common');

const CacheServiceProvider    = require('../../../lib/cache/CacheServiceProvider');
const DatabaseServiceProvider = require('../../../lib/database/DatabaseServiceProvider');
const SecurityServiceProvider = require('../../../lib/security/SecurityServiceProvider');

const DatabaseDriver = require('../../../lib/cache/services/CacheManager/drivers/DatabaseDriver');
const FileDriver     = require('../../../lib/cache/services/CacheManager/drivers/FileDriver');
const RuntimeDriver  = require('../../../lib/cache/services/CacheManager/drivers/RuntimeDriver');

const CacheClearCommand  = require('../../../lib/cache/commands/CacheClearCommand');
const CacheForgetCommand = require('../../../lib/cache/commands/CacheForgetCommand');

const directory = path.join(__dirname, 'stubs', 'data');
const file      = path.join(directory, 'test.json');


describe('Node IoC - Log', () => {

	beforeEach(() => {
		container.register(CacheServiceProvider);
		container.register(DatabaseServiceProvider);
		container.register(SecurityServiceProvider);
		container.bootIfNotBooted();
	});

	test('Cache is resolvable', () => {
		expect(container.isBound('cache')).toBe(true);
		expect(container.make('cache')).toBeTruthy();
	});

	describe('Cache manager', () => {

		let manager;

		let TestDriver;

		beforeEach(() => {
			TestDriver = class extends RuntimeDriver {};
			container.make('config').set('cache', {
				'default': 'runtime',
				'stores': {
					runtime: {
						driver: 'runtime'
					},
					file: {
						driver: 'file',
						file:   file
					},
					test: {
						driver: 'test',
						foo:    'bar'
					}
				},
				'common': {
					prefix:     'node_ioc_test',
					expiration: 600
				}
			});
			manager = container.make('cache');
			manager.addDriver('test', TestDriver);
		});

		test('Can resolve default store', () => {
			const result = manager.resolveDefault();
			expect(result).toBeInstanceOf(RuntimeDriver);
		});

		test('Can resolve store by name', () => {
			const result1 = manager.resolve('runtime');
			const result2 = manager.resolve('file');
			const result3 = manager.resolve('test');
			expect(result1).toBeInstanceOf(RuntimeDriver);
			expect(result2).toBeInstanceOf(FileDriver);
			expect(result3).toBeInstanceOf(TestDriver);
			expect(result3.driverConfig.foo).toBe('bar');
		});

		test('Can build store by driver', () => {
			const result = manager.build('test');
			expect(result).toBeInstanceOf(TestDriver);
			expect(result.driverConfig.foo).not.toBe('bar');
		});

		test('Can build store by driver and config', () => {
			const result = manager.build('test', { foo: 'other bar' });
			expect(result).toBeInstanceOf(TestDriver);
			expect(result.driverConfig.foo).toBe('other bar');
		});

		test('Common configured config are merged with passed config', () => {
			const result1 = manager.build('test');
			const result2 = manager.build('test', { baz: 'test', prefix: 'node_ioc_custom_prefix' });
			expect(result1.driverConfig).toStrictEqual({
				prefix: 'node_ioc_test',
				expiration: 600
			});
			expect(result2.driverConfig).toStrictEqual({
				baz: 'test',
				prefix: 'node_ioc_custom_prefix',
				expiration: 600
			});
		});

		test('Forwards calls to the default store', async (done) => {
			const get = jest.fn(() => { return 'bar'; });
			manager.addDriver('stub', { get });
			container.make('config').set('cache', {
				'default': 'stub',
				'stores': {
					stub: {
						driver: 'stub'
					}
				}
			});
			const result = await manager.get('foo');
			expect(get).toHaveBeenCalledTimes(1);
			expect(get).toHaveBeenCalledWith('foo');
			expect(result).toBe('bar');
			done();
		});


		test('Throws if given store does not exists', () => {
			expect(() => {
				manager.resolve('unexisting');
			}).toThrow();
		});

	});

	describe('Drivers', () => {

		let driver;

		const runDriverTestSuite = () => {
			test('Can put item in cache and retrieve it', async (done) => {
				await driver.put('foo', 'bar');
				const result1 = await driver.get('foo');
				expect(result1).toBe('bar');
				await new Promise((resolve) => {
					setTimeout(resolve, 2000);
				});
				const result2 = await driver.get('foo');
				expect(result2).toBe('bar');
				done();
			});

			test('Can put item with an expiration time', async (done) => {
				await driver.put('foo', 'bar', 1);
				const result1 = await driver.get('foo');
				expect(result1).toBe('bar');
				await new Promise((resolve) => {
					setTimeout(resolve, 2000);
				});
				const result2 = await driver.get('foo');
				expect(result2).toBeFalsy();
				done();
			});

			test('Can put item in cache with already existing key and overwrite the value', async (done) => {
				await driver.put('foo', 'bar');
				const result1 = await driver.get('foo');
				expect(result1).toBe('bar');
				await driver.put('foo', 'test');
				const result2 = await driver.get('foo');
				expect(result2).toBe('test');
				done();
			});

			test('Can get a non-existing item in cache', async (done) => {
				const result = await driver.get('foo');
				expect(result).toBeFalsy();
				done();
			});

			test('Can get a non-existing item in cache with a default value', async (done) => {
				const result = await driver.get('foo', 'default');
				expect(result).toBe('default');
				done();
			});

			test('Can put a plain object or array in cache', async (done) => {
				const object = { foo: 'bar', baz: 'test' };
				await driver.put('object', object);
				const result = await driver.get('object');

				expect(result).toStrictEqual(object);
				expect(result).not.toBe(object);

				done();
			});

			test('Can put an instance in cache and store its primitive value', async (done) => {
				const MyClass = class {

					constructor() {
						this.foo = 'bar';
						this.baz = 'test';
					}

				};
				const object = new MyClass();
				await driver.put('object', object);
				const result = await driver.get('object');

				expect(result).toBeTruthy();
				expect(result.foo).toBe('bar');
				expect(result.baz).toBe('test');
				expect(result).not.toBeInstanceOf(MyClass);

				done();
			});

			test('Can increment a cached value', async (done) => {
				await driver.put('foo', 1);
				await driver.increment('foo');
				const result = await driver.get('foo');
				expect(result).toBe(2);
				done();
			});

			test('Can decrement a cached value', async (done) => {
				await driver.put('foo', 5);
				await driver.decrement('foo');
				const result = await driver.get('foo');
				expect(result).toBe(4);
				done();
			});

			test('Can increment a non-existing value by initializing it to 0', async (done) => {
				await driver.increment('foo');
				const result = await driver.get('foo');
				expect(result).toBe(1);
				done();
			});

			test('Can decrement a non-existing value by initializing it to 0', async (done) => {
				await driver.decrement('foo');
				const result = await driver.get('foo');
				expect(result).toBe(-1);
				done();
			});

			test('Can delete a cached value', async (done) => {
				await driver.put('foo', 'bar');
				await driver.put('baz', 'test');
				const result1 = await driver.get('foo');
				const result2 = await driver.get('baz');
				await driver.delete('foo');
				const result3 = await driver.get('foo');
				const result4 = await driver.get('baz');

				expect(result1).toBe('bar');
				expect(result2).toBe('test');
				expect(result3).toBeFalsy();
				expect(result4).toBe('test');

				done();
			});

			test('Can delete a non-existing value', async (done) => {
				const errorCallback = jest.fn();
				const result1 = await driver.get('foo');

				return Promise.resolve(driver.delete('foo'))
					.catch(errorCallback)
					.finally(() => {
						expect(errorCallback).not.toHaveBeenCalled();
						expect(result1).toBeFalsy();
						done();
					});
			});

			test('Can flush the whole cache', async (done) => {
				await driver.put('foo', 'bar');
				await driver.put('baz', 'test');

				const result1 = await driver.get('foo');
				const result2 = await driver.get('baz');

				await driver.flush();

				const result3 = await driver.get('foo');
				const result4 = await driver.get('baz');

				expect(result1).toBe('bar');
				expect(result2).toBe('test');
				expect(result3).toBeFalsy();
				expect(result4).toBeFalsy();

				done();
			});
		};
		describe('Runtime Driver', () => {

			beforeEach(() => {
				driver = container.make(RuntimeDriver, { 'driver.config': {} });
			});

			runDriverTestSuite();
		});

		describe('File Driver', () => {
			beforeAll(() => {
				fs.mkdirSync(directory);
			});

			beforeEach(() => {
				driver = container.make(FileDriver, { 'driver.config': { file } });
			});

			afterEach(() => {
				if (fs.existsSync(file)) {
					fs.unlinkSync(file);
				}
			});

			afterAll(() => {
				fs.rmdirSync(directory);
			});

			runDriverTestSuite();
		});

		describe('Database Driver', () => {

			const databaseFile = path.join(__dirname, 'stubs', 'database.sqlite');

			beforeAll(() => {
				fs.writeFileSync(databaseFile, '');
			});

			beforeEach(async (done) => {
				container.make('config').set('database', {
					connections: {
						test: {
							driver: 'sqlite',
							filename: databaseFile
						}
					}
				});
				driver = container.make(DatabaseDriver, {
					'driver.config': {
						table: 'cache',
						connection: 'test'
					}
				});

				await container.make('db').getConnection('test').schema.createTable('cache', (table) => {
					table.string('key').unique();
					table.text('value').nullable();
					table.timestamp('expires_at').nullable();
				});
				done();
			});

			afterEach(async (done) => {
				await container.make('db').getConnection('test').schema.dropTableIfExists('cache');
				done();
			});

			afterAll(() => {
				fs.writeFileSync(databaseFile, '');
			});

			runDriverTestSuite();

		});

	});

	describe('Commands', () => {

		let app;

		let cache;

		let command;

		let resolve;

		let store;

		let terminal;

		beforeEach(() => {
			container.make('config').set('cache', {
				'default': 'test',
				'stores': {
					test: {
						driver: 'test'
					},
					foo: {
						driver: 'bar'
					}
				}
			});
			app = container;
			store = {
				'flush':  jest.fn(() => { return Promise.resolve(); }),
				'delete': jest.fn(() => { return Promise.resolve(); })
			};
			resolve = jest.fn(() => { return store; });
			cache = { resolve };
			terminal = { println: jest.fn() };
		});

		describe('cache:clear', () => {

			beforeEach(() => {
				command = container.make(CacheClearCommand, { app, cache, terminal });
				command.formatArguments();
			});

			test('Flushes the default store', async (done) => {
				await command.handle();
				expect(resolve).toHaveBeenCalledWith(undefined);
				expect(store.flush).toHaveBeenCalled();
				done();
			});

			test('Flushes the given store instead of the default one', async (done) => {
				command.args.parameters.find(({ name }) => { return name === 'store'; }).value = 'foo';
				await command.handle();
				expect(resolve).toHaveBeenCalledWith('foo');
				expect(store.flush).toHaveBeenCalled();
				done();
			});

		});

		describe('cache:forget', () => {

			beforeEach(() => {
				command = container.make(CacheForgetCommand, { app, cache, terminal });
				command.formatArguments();
			});

			test('Cache key is required', () => {
				expect(command.args.parameters.find(({ name }) => { return name === 'key'; }).required).toBe(true);
			});

			test('Can flush given key from default store', async (done) => {
				command.args.parameters.find(({ name }) => { return name === 'key'; }).value = 'my_key';
				await command.handle();
				expect(resolve).toHaveBeenCalledWith(undefined);
				expect(store.delete).toHaveBeenCalledWith('my_key');
				done();
			});

			test('Can flush given key from given store', async (done) => {
				command.args.parameters.find(({ name }) => { return name === 'key'; }).value = 'my_key';
				command.args.parameters.find(({ name }) => { return name === 'store'; }).value = 'foo';
				await command.handle();
				expect(resolve).toHaveBeenCalledWith('foo');
				expect(store.delete).toHaveBeenCalledWith('my_key');
				done();
			});

		});

	});

});
