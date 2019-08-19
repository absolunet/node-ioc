//--------------------------------------------------------
//-- Tests - Unit - Database
//--------------------------------------------------------
'use strict';

const __                      = require('@absolunet/private-registry');
const fs                      = require('fs');
const path                    = require('path');
const container               = require('../common');
const ConfigServiceProvider   = require('../../../lib/config/providers/ConfigServiceProvider');
const ConsoleServiceProvider  = require('../../../lib/console/providers/ConsoleServiceProvider');
const DatabaseServiceProvider = require('../../../lib/database/providers/DatabaseServiceProvider');
const FileServiceProvider     = require('../../../lib/file/providers/FileServiceProvider');
const SecurityServiceProvider = require('../../../lib/security/providers/SecurityServiceProvider');
const SupportServiceProvider  = require('../../../lib/support/providers/SupportServiceProvider');
const BaseModel               = require('../../../lib/database/Model');
const BaseModelFactory        = require('../../../lib/database/Factory');

const CreateTestsTableStub    = require('./stubs/database/migrations/12345678901234_CreateTestsTable');

const databases = {
	test:  path.join(__dirname, 'stubs', 'database', 'test.sqlite'),
	other: path.join(__dirname, 'stubs', 'database', 'test-other.sqlite')
};

describe('Node IoC - Database', () => {

	beforeEach(() => {
		container.register(FileServiceProvider);
		container.register(ConfigServiceProvider);
		container.register(ConsoleServiceProvider);
		container.register(SecurityServiceProvider);
		container.register(SupportServiceProvider);

		container.bootIfNotBooted();

		container.make('config').set('database', {
			'enabled': true,
			'command_namespace': 'db',
			'default': 'test-sqlite',
			'connections': {
				'test-sqlite': {
					driver: 'sqlite',
					database: databases.test
				},
				'test-other-sqlite': {
					driver: 'sqlite',
					database: databases.other
				},
				'test-no-driver-sqlite': {
					database: databases.other
				},
				'test-unexisting-driver-sqlite': {
					driver: 'not-a-driver',
					database: databases.other
				}
			},
			'paths': {
				factories:  path.join(__dirname, 'stubs', 'database', 'factories'),
				migrations: path.join(__dirname, 'stubs', 'database', 'migrations'),
				models:     path.join(__dirname, 'stubs', 'database', 'models'),
				seeds:      path.join(__dirname, 'stubs', 'database', 'seeds')
			}
		});

		Object.values(databases).forEach((database) => {
			fs.writeFileSync(database, '');
		});

		container.register(DatabaseServiceProvider);
	});

	afterEach(() => {
		Object.values(databases).forEach((database) => {
			fs.writeFileSync(database, '');
		});
	});

	test('Can resolve dependencies', () => {
		expect(container.make('db')).toBeTruthy();
		expect(container.make('db.connection')).toBeTruthy();
		expect(container.make('db.factory')).toBeTruthy();
		expect(container.make('db.model')).toBeTruthy();
		expect(container.make('db.orm')).toBeTruthy();
		expect(container.make('db.resolver')).toBeTruthy();
	});


	describe('Builder', () => {

		let builder;

		beforeEach(() => {
			builder = container.make('db');
		});

		test('Can build default connection', () => {
			const defaultConnection = builder.getDefaultConnection();
			const connection        = builder.getConnection();

			expect(defaultConnection).toBe(connection);
			expect(typeof connection).toBe('function');
		});

		test('Can build connection by name', () => {
			const connection      = builder.getConnection('test-sqlite');
			const otherConnection = builder.getConnection('test-other-sqlite');

			expect(connection).not.toBe(otherConnection);
			expect(typeof connection).toBe('function');
			expect(typeof otherConnection).toBe('function');
		});

		test('Throws if connection configuration does not exists', () => {
			expect(() => {
				builder.getConnection('not-existing-connection');
			}).toThrow('Database connection [not-existing-connection] was not configured.');
		});

		test('Throws if connection configuration is incorrect', () => {
			expect(() => {
				builder.getConnection('test-no-driver-sqlite');
			}).toThrow('Database connection [test-no-driver-sqlite] configuration must define a driver.');
			expect(() => {
				builder.getConnection('test-unexisting-driver-sqlite');
			}).toThrow('Driver [not-a-driver] cannot be found.');
		});

	});


	describe('Connector', () => {

		let connector;

		beforeEach(() => {
			connector = container.make('db.connection');
		});

		test('Can get driver', () => {
			expect(() => {
				connector.hasDriver('default');
			}).not.toThrow();
		});

		describe('Drivers', () => {

			describe('SQLite', () => {

				test('Can create connection with sqlite client', async (done) => {
					const name       = 'test-sqlite';
					const config     = container.make('config').get(`database.connections.${name}`);
					const connection = connector.driver('sqlite').getOrCreateConnection(name, config);

					expect(connection).toBeTruthy();
					expect(connection.schema.createTable('test', (table) => {
						table.string('test');
					})).resolves.toBeTruthy();

					const hasTable = await connection.schema.hasTable('test');

					expect(hasTable).toBe(true);

					done();
				});

			});

		});

	});


	describe('Resolver', () => {

		let resolver;

		beforeEach(() => {
			resolver = container.make('db.resolver');
		});

		test('Can resolve all paths', () => {
			expect(resolver.resolvePaths()).toStrictEqual(container.make('config').get('database.paths'));
		});

		test('Can resolve single path', () => {
			expect(resolver.resolvePath('migrations')).toStrictEqual(container.make('config').get('database.paths.migrations'));
		});

		test('Can resolve application path', () => {
			container.make('config').set('database.paths.migrations', '@/foo/bar');
			expect(resolver.resolvePath('migrations')).not.toBe('@/foo/bar');
			expect(resolver.resolvePath('migrations')).toBe(container.make('config').get('database.paths.migrations'));
		});

		test('Can resolve home path', () => {
			container.make('config').set('database.paths.migrations', '~/foo/bar');
			expect(resolver.resolvePath('migrations')).not.toBe('~/foo/bar');
			expect(resolver.resolvePath('migrations')).toBe(container.make('config').get('database.paths.migrations'));
		});

		test('Can resolve unexisting path', () => {
			container.make('config').set('database.paths', {});
			const grammar = container.make('config.grammar');
			expect(resolver.resolvePath('factories')).toBe(grammar.format('@/database/factories'));
			expect(resolver.resolvePath('migrations')).toBe(grammar.format('@/database/migrations'));
			expect(resolver.resolvePath('models')).toBe(grammar.format('@/database/models'));
			expect(resolver.resolvePath('seeds')).toBe(grammar.format('@/database/seeds'));
			expect(typeof resolver.resolvePath('foo')).toBe('undefined');
		});

	});


	describe('ORM', () => {

		let orm;

		beforeEach(() => {
			orm = container.make('db.orm');
		});

		describe('Drivers', () => {

			describe('Bookshelf', () => {

				let driver;

				beforeEach(() => {
					driver = orm.driver('bookshelf');
				});

				test('Can build Model class', () => {
					const testModel = {};
					expect(driver.model('testModel')).toBeFalsy();
					driver.model('testModel', testModel);
					expect(typeof driver.model('testModel')).toBe('function');
				});

				test('Can be instantiated with custom connection', () => {
					const otherDriver = driver.withConnection(container.make('db').getConnection());

					expect(otherDriver).toBeTruthy();
					expect(typeof otherDriver).toBe(typeof driver);
					expect(otherDriver).not.toBe(driver);
				});

				test('Can generate model with given connection', () => {
					const TestModel = class extends BaseModel {};
					driver.model('testConnectionModel', TestModel);
					const model1 = driver.model('testConnectionModel');
					const otherDriver = driver.withConnection(container.make('db').getConnection('test-other-sqlite'));
					const model2 = otherDriver.model('testConnectionModel');

					expect(model1).toBe(driver.model('testConnectionModel'));
					expect(model2).toBe(otherDriver.model('testConnectionModel'));
					expect(model1).not.toBe(model2);
					expect(model1.query().client.connectionSettings.filename).toBe(databases.test);
					expect(model2.query().client.connectionSettings.filename).toBe(databases.other);
				});

			});

		});

	});


	describe('Model repository', () => {

		let repository;

		let fakeORM;

		let registry;

		beforeEach(() => {
			registry = {};

			const FakeORM = class {};
			FakeORM.prototype.registerModel = jest.fn(function(name, model) {
				const engine = this.engine();
				registry[name] = container.make(model, { engine });
			});
			FakeORM.prototype.getModel = jest.fn((name) => {
				return registry[name];
			});
			FakeORM.prototype.engine = jest.fn(() => {
				return { Model: { prototype: {}, extend: (a) => { return a; } } };
			});
			fakeORM = container.make(FakeORM);
		});

		test('Can inject model repository with "model" alias', () => {
			expect(container.make('model')).toBe(container.make('db.model'));
		});

		test('Can register a model', () => {
			repository = container.make('db.model', { 'db.orm': fakeORM });
			repository.set('test', class extends BaseModel {});
			expect(fakeORM.registerModel).toHaveBeenCalledTimes(1);
			expect(registry.test).toBeTruthy();
		});

		test('Can retrieve a model', () => {
			repository = container.make('db.model', { 'db.orm': fakeORM });
			const TestModel = class extends BaseModel {};
			repository.set('testModel', TestModel);
			const fetchedModel = repository.get('testModel');

			expect(fetchedModel.constructor.name.split(' ').pop()).toBe(TestModel.name);
			expect(fakeORM.registerModel).toHaveBeenCalledTimes(1);
			expect(fakeORM.getModel).toHaveBeenCalledTimes(1);
		});

		test('Throws if model does not exists', () => {
			repository = container.make('db.model');
			expect(() => {
				repository.get('testUndefined');
			}).toThrow();
		});

	});


	describe('Factory', () => {

		let factory;

		let TestFactory;

		let TestModel;

		let constructorCall;

		beforeEach(() => {
			constructorCall = jest.fn();
			factory = container.make('db.factory');

			TestFactory = class extends BaseModelFactory {

				constructor(...parameters) {
					const value = super(...parameters);
					constructorCall();

					return value;
				}

				get model() {
					return 'testModelFactory';
				}

				make() {
					return {
						foo: 'bar'
					};
				}

			};

			TestModel = class extends BaseModel {};
		});

		test('Can register model factory', () => {
			factory.register(TestFactory);
			expect(constructorCall).toHaveBeenCalledTimes(1);
		});

		test('Can retrieve model factory', () => {
			factory.register(TestFactory);
			container.make('db.model').set('testModelFactory', TestModel);
			const modelFactory = factory.make('testModelFactory');

			expect(modelFactory).toBeTruthy();
			expect(typeof modelFactory).toBe('object');
			expect(modelFactory.attributes.foo).toBe('bar');
		});

		test('Can register factory for dedicated model', () => {
			factory.register(TestFactory, 'otherTest');
			container.make('db.model').set('otherTest', TestModel);
			const modelFactory = factory.make('otherTest');

			expect(modelFactory).toBeTruthy();
			expect(typeof modelFactory).toBe('object');
			expect(modelFactory.attributes.foo).toBe('bar');
		});

		test('Throw if retrieving model factory if model was not registered', () => {
			factory.register(TestFactory);

			expect(() => {
				factory.make('testUndefined');
			}).toThrow();
		});

		test('Can get fake model collection from factory', () => {
			factory.register(TestFactory, 'testModelCollection');
			container.make('db.model').set('testModelCollection', TestModel);

			const model = factory.make('testModelCollection');
			const collection = factory.make('testModelCollection', 10);

			expect(collection.length).toBe(10);
			expect(collection).not.toBeInstanceOf(Array);
			expect(collection).not.toBeInstanceOf(model.constructor);
		});

	});


	describe('Migration', () => {

		test('Migrations can be retrieve by Knex', () => {
			const connection = container.make('db').getConnection();
			const [migrationsPath] = connection.migrate.config.migrationSource.migrationsPaths;

			expect(migrationsPath).toBe(container.make('config').get('database.paths.migrations'));
		});

	});


	describe('Seeder', () => {

		test('Seeders can be retrieve by Knex', () => {
			const connection = container.make('db').getConnection();
			const { directory: seedsPath } = connection.seed.config;

			expect(seedsPath).toBe(container.make('config').get('database.paths.seeds'));
		});

	});


	describe('Commands', () => {

		let registrar;

		let logStub;

		beforeEach(() => {
			logStub = jest.fn();
			registrar = container.make('command.registrar');
			container.make('terminal').print   = logStub;
			container.make('terminal').success = logStub;
		});

		describe('policies', () => {

			const resetPolicy = () => {
				const policy = 'db';
				__(container.make('gate')).get('policies')[policy] = [() => {
					return true;
				}];
			};

			test('Can hide commands if database is not enabled', () => {
				container.make('config').set('database.enabled', false);
				const commandCount = container.make('command').all().length;
				resetPolicy();
				expect(commandCount).toBeLessThan(container.make('command').all().length);
			});

			test('Can hide commands if namespace is not configured', () => {
				container.make('config').set('database.command_namespace', null);
				const commandCount = container.make('command').all().length;
				resetPolicy();
				expect(commandCount).toBeLessThan(container.make('command').all().length);
			});

			test('Can hide commands if both database is not enabled and namespace is not configured', () => {
				container.make('config').set('database.enabled', false);
				container.make('config').set('database.command_namespace', null);
				const commandCount = container.make('command').all().length;
				resetPolicy();
				expect(commandCount).toBeLessThan(container.make('command').all().length);
			});

			test('Can show commands if configured', () => {
				container.make('config').set('database.enabled', true);
				container.make('config').set('database.command_namespace', 'database');
				const commandCount = container.make('command').all().length;
				resetPolicy();
				expect(commandCount).toBe(container.make('command').all().length);
			});

		});

		describe('prefix', () => {

			test('Command can have preconfigured prefix', () => {
				const originalPrefix = container.make('command').get('db:seed');
				const newPrefixBeforeConfiguration = container.make('command').get('database:seed');
				container.make('config').set('database.command_namespace', 'database');
				const newPrefixAfterConfiguration = container.make('command').get('database:seed');

				expect(originalPrefix).toBeTruthy();
				expect(newPrefixBeforeConfiguration).toBeFalsy();
				expect(newPrefixAfterConfiguration).toBeTruthy();
				expect(newPrefixAfterConfiguration).toBe(originalPrefix);
			});

		});

		describe('Generator', () => {

			let ensureDirectoryStub;

			let writeAsyncStub;

			beforeEach(() => {
				ensureDirectoryStub = jest.fn(() => {
					return Promise.resolve();
				});
				writeAsyncStub = jest.fn(() => {
					return Promise.resolve();
				});

				Object.defineProperty(container.make('file.engine').async, 'ensureDir', {
					get: () => {
						return ensureDirectoryStub;
					}
				});
				container.make('file').driver('text').constructor.prototype.writeAsync = writeAsyncStub;
			});

			describe('make:factory', () => {

				test('Can create factory file', async (done) => {
					await registrar.resolve('make:factory TestFactory', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(1);

					const [[file, content]] = writeAsyncStub.mock.calls;

					expect(file).toMatch(/[\\/]TestFactory.js$/u);
					expect(content.includes('class TestFactory extends ModelFactory {')).toBe(true);
					expect(content.includes('module.exports = TestFactory;')).toBe(true);
					expect(content.includes(`get model() {\n\t\treturn 'test';\n\t}`)).toBe(true);

					done();
				});

			});

			describe('make:migration', () => {

				test('Can create migration file', async (done) => {
					await registrar.resolve('make:migration CreateTestsTable', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(1);

					const [[file, content]] = writeAsyncStub.mock.calls;

					expect(file).toMatch(/[\\/]\d{14}_CreateTestsTable\.js$/u);
					expect(content.includes('class CreateTestsTable extends Migration {')).toBe(true);
					expect(content.includes('module.exports = CreateTestsTable;')).toBe(true);

					done();
				});

				test('Can create a "create" migration file', async (done) => {
					await registrar.resolve('make:migration CreateTestsTable', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(1);

					const [[file, content]] = writeAsyncStub.mock.calls;

					expect(file).toMatch(/[\\/]\d{14}_CreateTestsTable\.js$/u);
					expect(content.includes(`async up({ schema }) {\n\t\tawait schema.createTable('tests', (table) => {\n\t\t\ttable.uuid('id').primary();\n\t\t\ttable.timestamps();\n\t\t});\n\t}`)).toBe(true);
					expect(content.includes(`async down({ schema }) {\n\t\tawait schema.dropTableIfExists('tests');\n\t}`)).toBe(true);

					done();
				});

				test('Can create an "alter" migration file', async (done) => {
					await registrar.resolve('make:migration AlterTestsTable', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(1);

					const [[file, content]] = writeAsyncStub.mock.calls;

					expect(file).toMatch(/[\\/]\d{14}_AlterTestsTable\.js$/u);
					expect(content.includes(`async up({ schema }) {\n\t\tawait schema.table('tests', (table) => {`)).toBe(true);
					expect(content.includes(`async down({ schema }) {\n\t\tawait schema.table('tests', (table) => {`)).toBe(true);

					done();
				});

				test('Can create a "drop" migration file', async (done) => {
					await registrar.resolve('make:migration DropTestsTable', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(1);

					const [[file, content]] = writeAsyncStub.mock.calls;

					expect(file).toMatch(/[\\/]\d{14}_DropTestsTable\.js$/u);
					expect(content.includes(`async up({ schema }) {\n\t\tawait schema.dropTableIfExists('tests');\n\t}`)).toBe(true);
					expect(content.includes(`async down({ schema }) {\n\t\tawait schema.createTable('tests', (table) => {\n\t\t\ttable.uuid('id').primary();\n\t\t\ttable.timestamps();\n\t\t});\n\t}`)).toBe(true);

					done();
				});

			});

			describe('make:seeder', () => {

				test('Can create seeder file', async (done) => {
					await registrar.resolve('make:seeder TestsTableSeeder', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(1);

					const [[file, content]] = writeAsyncStub.mock.calls;

					expect(file).toMatch(/[\\/]TestsTableSeeder.js/u);
					expect(content.includes(`class TestsTableSeeder extends Seeder {`)).toBe(true);
					expect(content.includes(`async seed(connection) {\n\t\tawait this.factory('test').save();\n\t}`)).toBe(true);
					expect(content.includes(`module.exports = TestsTableSeeder;`)).toBe(true);

					done();
				});

			});

			describe('make:model', () => {

				test('Can create model file', async (done) => {
					await registrar.resolve('make:model Test', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(1);

					const [[file, content]] = writeAsyncStub.mock.calls;

					expect(file).toMatch(/[\\/]Test\.js$/u);
					expect(content.includes(`class Test extends Model {`)).toBe(true);
					expect(content.includes(`module.exports = Test;`)).toBe(true);

					done();
				});

				test('Can create model file along with factory file', async (done) => {
					await registrar.resolve('make:model Test --factory', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(2);

					const [[model, modelContent], [factory, factoryContent]] = writeAsyncStub.mock.calls;

					expect(model).toMatch(/[\\/]Test\.js$/u);
					expect(modelContent.includes(`class Test extends Model {`)).toBe(true);
					expect(modelContent.includes(`module.exports = Test;`)).toBe(true);

					expect(factory).toMatch(/[\\/]TestFactory.js$/u);
					expect(factoryContent.includes('class TestFactory extends ModelFactory {')).toBe(true);
					expect(factoryContent.includes('module.exports = TestFactory;')).toBe(true);
					expect(factoryContent.includes(`get model() {\n\t\treturn 'test';\n\t}`)).toBe(true);

					done();
				});

				test('Can create model file along with migration', async (done) => {
					await registrar.resolve('make:model Test --migration', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(2);

					const [[model, modelContent], [migration, migrationContent]] = writeAsyncStub.mock.calls;

					expect(model).toMatch(/[\\/]Test\.js$/u);
					expect(modelContent.includes(`class Test extends Model {`)).toBe(true);
					expect(modelContent.includes(`module.exports = Test;`)).toBe(true);

					expect(migration).toMatch(/[\\/]\d{14}_CreateTestsTable\.js$/u);
					expect(migrationContent.includes('class CreateTestsTable extends Migration {')).toBe(true);
					expect(migrationContent.includes('module.exports = CreateTestsTable;')).toBe(true);

					done();
				});

				test('Can create model file along with seeder file', async (done) => {
					await registrar.resolve('make:model Test --seeder', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(2);

					const [[model, modelContent], [seeder, seederContent]] = writeAsyncStub.mock.calls;

					expect(model).toMatch(/[\\/]Test\.js$/u);
					expect(modelContent.includes(`class Test extends Model {`)).toBe(true);
					expect(modelContent.includes(`module.exports = Test;`)).toBe(true);

					expect(seeder).toMatch(/[\\/]TestsTableSeeder.js/u);
					expect(seederContent.includes(`class TestsTableSeeder extends Seeder {`)).toBe(true);
					expect(seederContent.includes(`async seed(connection) {\n\t\tawait this.factory('test').save();\n\t}`)).toBe(true);
					expect(seederContent.includes(`module.exports = TestsTableSeeder;`)).toBe(true);

					done();
				});

				test('Can create model file along with migration, seeder and factory files', async (done) => {
					await registrar.resolve('make:model Test --all', true);

					expect(writeAsyncStub).toHaveBeenCalledTimes(4);
					const [[model, modelContent], [factory, factoryContent], [migration, migrationContent], [seeder, seederContent]] = writeAsyncStub.mock.calls;

					expect(model).toMatch(/[\\/]Test\.js$/u);
					expect(modelContent.includes(`class Test extends Model {`)).toBe(true);
					expect(modelContent.includes(`module.exports = Test;`)).toBe(true);

					expect(factory).toMatch(/[\\/]TestFactory.js$/u);
					expect(factoryContent.includes('class TestFactory extends ModelFactory {')).toBe(true);
					expect(factoryContent.includes('module.exports = TestFactory;')).toBe(true);
					expect(factoryContent.includes(`get model() {\n\t\treturn 'test';\n\t}`)).toBe(true);

					expect(migration).toMatch(/[\\/]\d{14}_CreateTestsTable\.js$/u);
					expect(migrationContent.includes('class CreateTestsTable extends Migration {')).toBe(true);
					expect(migrationContent.includes('module.exports = CreateTestsTable;')).toBe(true);

					expect(seeder).toMatch(/[\\/]TestsTableSeeder.js/u);
					expect(seederContent.includes(`class TestsTableSeeder extends Seeder {`)).toBe(true);
					expect(seederContent.includes(`async seed(connection) {\n\t\tawait this.factory('test').save();\n\t}`)).toBe(true);
					expect(seederContent.includes(`module.exports = TestsTableSeeder;`)).toBe(true);

					done();
				});

			});

		});

		describe('Database', () => {

			let connection;

			beforeEach(() => {
				connection = container.make('db').getConnection();
			});

			describe('db:migrate', () => {

				test('Can run migration', async (done) => {
					const hadTable = await connection.schema.hasTable('tests');
					await registrar.resolve('db:migrate', true);
					const tableWasCreated = await connection.schema.hasTable('tests');

					expect(hadTable).toBe(false);
					expect(tableWasCreated).toBe(true);

					done();
				});

				test('Can run migration and seed the database afterwards', async (done) => {
					const hadTable = await connection.schema.hasTable('tests');
					await registrar.resolve('db:migrate --seed', true);
					const tableWasCreated = await connection.schema.hasTable('tests');
					const [{ count }] = await connection.select().from('tests').count('id as count');

					expect(hadTable).toBe(false);
					expect(tableWasCreated).toBe(true);
					expect(count).toBe(1);

					done();
				});

			});

			describe('db:migrate:fresh', () => {

				test('Can migrate into a fresh database', async (done) => {
					await connection.schema.createTable('tests', (table) => {
						table.increments('id').primary();
						table.timestamps();
					});
					const tableWasCreated = await connection.schema.hasTable('tests');
					await connection('tests').insert({ });
					await connection('tests').insert({ });
					const [{ originalCount }] = await connection.select().from('tests').count('id as originalCount');

					await registrar.resolve('db:migrate:fresh', true);

					const tableStillExists = await connection.schema.hasTable('tests');
					const [{ newCount }] = await connection.select().from('tests').count('id as newCount');

					expect(tableWasCreated).toBe(true);
					expect(originalCount).toBe(2);
					expect(tableStillExists).toBe(true);
					expect(newCount).toBe(0);

					done();
				});

				test('Can migrate into a fresh database and seed the database afterwards', async (done) => {
					await connection.schema.createTable('tests', (table) => {
						table.increments('id').primary();
						table.timestamps();
					});
					const tableWasCreated = await connection.schema.hasTable('tests');
					await connection('tests').insert({ });
					await connection('tests').insert({ });
					const [{ originalCount }] = await connection.select().from('tests').count('id as originalCount');

					await registrar.resolve('db:migrate:fresh --seed', true);

					const tableStillExists = await connection.schema.hasTable('tests');
					const [{ newCount }] = await connection.select().from('tests').count('id as newCount');

					expect(tableWasCreated).toBe(true);
					expect(originalCount).toBe(2);
					expect(tableStillExists).toBe(true);
					expect(newCount).toBe(1);

					done();
				});

			});

			describe('db:migrate:refresh', () => {

				test('Can refresh the migrations', async (done) => {
					const { down } = CreateTestsTableStub.prototype;
					const downStub = jest.fn(async function(...parameters) {
						await down.apply(this, parameters);
					});
					CreateTestsTableStub.prototype.down = downStub;

					await connection.schema.createTable('tests', (table) => {
						table.increments('id').primary();
						table.timestamps();
					});
					await connection.schema.createTable('migrations', (table) => {
						table.increments('id').primary();
						table.string('name');
						table.integer('batch');
						table.dateTime('migration_time');
					});
					await connection('migrations').insert({
						name: '12345678901234_CreateTestsTable.js',
						batch: 1,
						migration_time: Date.now() // eslint-disable-line camelcase
					});
					const tableWasCreated = await connection.schema.hasTable('tests');
					await connection('tests').insert({ });
					await connection('tests').insert({ });
					const [{ originalCount }] = await connection.select().from('tests').count('id as originalCount');


					await registrar.resolve('db:migrate:refresh', true);

					const tableStillExists = await connection.schema.hasTable('tests');
					const [{ newCount }] = await connection.select().from('tests').count('id as newCount');

					expect(tableWasCreated).toBe(true);
					expect(originalCount).toBe(2);
					expect(tableStillExists).toBe(true);
					expect(newCount).toBe(0);
					expect(downStub).toHaveBeenCalledTimes(1);

					CreateTestsTableStub.prototype.down = down;

					done();
				});

				test('Can refresh the migrations and seed the database afterwards', async (done) => {
					const { down } = CreateTestsTableStub.prototype;
					const downStub = jest.fn(async function(...parameters) {
						await down.apply(this, parameters);
					});
					CreateTestsTableStub.prototype.down = downStub;

					await connection.schema.createTable('tests', (table) => {
						table.increments('id').primary();
						table.timestamps();
					});
					await connection.schema.createTable('migrations', (table) => {
						table.increments('id').primary();
						table.string('name');
						table.integer('batch');
						table.dateTime('migration_time');
					});
					await connection('migrations').insert({
						name: '12345678901234_CreateTestsTable.js',
						batch: 1,
						migration_time: Date.now() // eslint-disable-line camelcase
					});
					const tableWasCreated = await connection.schema.hasTable('tests');
					await connection('tests').insert({ });
					await connection('tests').insert({ });
					const [{ originalCount }] = await connection.select().from('tests').count('id as originalCount');


					await registrar.resolve('db:migrate:refresh --seed', true);

					const tableStillExists = await connection.schema.hasTable('tests');
					const [{ newCount }] = await connection.select().from('tests').count('id as newCount');

					expect(tableWasCreated).toBe(true);
					expect(originalCount).toBe(2);
					expect(tableStillExists).toBe(true);
					expect(newCount).toBe(1);
					expect(downStub).toHaveBeenCalledTimes(1);

					CreateTestsTableStub.prototype.down = down;

					done();
				});

			});

			describe('db:migrate:rollback', () => {

				test('Can rollback migrations', async (done) => {
					await connection.schema.createTable('tests', (table) => {
						table.increments('id').primary();
						table.timestamps();
					});
					await connection.schema.createTable('migrations', (table) => {
						table.increments('id').primary();
						table.string('name');
						table.integer('batch');
						table.dateTime('migration_time');
					});
					await connection('migrations').insert({
						name: '12345678901234_CreateTestsTable.js',
						batch: 1,
						migration_time: Date.now() // eslint-disable-line camelcase
					});
					const tableWasCreated = await connection.schema.hasTable('tests');

					await registrar.resolve('db:migrate:rollback', true);

					const tableStillExists = await connection.schema.hasTable('tests');

					expect(tableWasCreated).toBe(true);
					expect(tableStillExists).toBe(false);

					done();
				});

			});

			describe('db:migrate:status', () => {

				test('Can get the migrations status when migration was not run yet', async (done) => {
					await registrar.resolve('db:migrate');
					await registrar.resolve('db:migrate:rollback');
					logStub.mockClear();

					await registrar.resolve('db:migrate:status', true);

					expect(logStub).toHaveBeenCalledTimes(1);
					expect(logStub.mock.calls[0][0]).toMatch(/N\s+.\s+12345678901234_CreateTestsTable\.js/u);

					done();
				});

				test('Can get the migrations status when migration was run', async (done) => {
					await registrar.resolve('db:migrate');
					logStub.mockClear();

					await registrar.resolve('db:migrate:status', true);

					expect(logStub).toHaveBeenCalledTimes(1);
					expect(logStub.mock.calls[0][0]).toMatch(/Y\s+.\s+12345678901234_CreateTestsTable\.js/u);

					done();
				});

			});

			describe('db:seed', () => {

				test('Can seed the database', async (done) => {
					await connection.schema.createTable('tests', (table) => {
						table.uuid('id').primary();
						table.timestamps();
					});
					const [{ originalCount }] = await connection.select().from('tests').count('id as originalCount');

					await registrar.resolve('db:seed', true);

					const [{ newCount }] = await connection.select().from('tests').count('id as newCount');

					expect(originalCount).toBe(0);
					expect(newCount).toBe(1);

					done();
				});

			});

		});

	});

});
