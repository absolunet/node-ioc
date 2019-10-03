//--------------------------------------------------------
//-- Node IoC - Database - Connector - Driver
//--------------------------------------------------------
'use strict';

const __                  = require('@absolunet/private-registry');
const NotImplementedError = require('../../../../foundation/exceptions/NotImplementedError');

/* istanbul ignore next */
class Driver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['config', 'db.resolver', 'file'];
	}

	/**
	 * Client to be used, such as "mysql", "sqlite3", etc.
	 *
	 * @type {string}
	 * @abstract
	 */
	get client() {
		throw new NotImplementedError(this, 'client', 'string', 'accessor');
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		__(this).set('connections', {});
	}

	/**
	 * Get Knex connection.
	 *
	 * @returns {Knex}
	 */
	getConnection(name = 'default') {
		if (!this.hasConnection(name)) {
			throw new TypeError(`The [${name}] connection does not exists.`);
		}

		return __(this).get('connections')[name];
	}

	/**
	 * Get default Knex connection.
	 *
	 * @returns {Knex}
	 */
	getDefaultConnection() {
		return this.getConnection('default');
	}

	/**
	 * Set Knex connection with name.
	 *
	 * @param {string} name
	 * @param {Knex} connection
	 * @returns {Driver}
	 */
	setConnection(name, connection) {
		__(this).get('connections')[name] = connection;

		return this;
	}

	/**
	 * Set default Knex connection instance.
	 *
	 * @param {Knex} connection
	 * @returns {Driver}
	 */
	setDefaultConnection(connection) {
		this.setConnection('default', connection);

		return this;
	}

	/**
	 * Check if connection exists by name.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	hasConnection(name) {
		return Boolean(__(this).get('connections')[name]);
	}

	/**
	 * Get connection if it exists, otherwise create a new connection and returns it.
	 *
	 * @param {string} name
	 * @param {object} config
	 * @returns {Knex}
	 */
	getOrCreateConnection(name, config) {
		if (this.hasConnection(name)) {
			return this.getConnection(name);
		}

		return this.createConnection(name, config);
	}

	/**
	 * Create new connection and store it by name.
	 *
	 * @param {string} name
	 * @param {object} config
	 * @returns {Knex}
	 */
	createConnection(name, config) {
		const connection = this.newConnection(config);

		this.setConnection(name, connection);

		return connection;
	}

	/**
	 * Get new Knex connection.
	 *
	 * @param {object} config
	 * @returns {Knex}
	 */
	newConnection(config) {
		const connection = require('knex')(this.mapConfig(config)); // eslint-disable-line global-require

		__(connection).set('driver', this);

		return connection;
	}

	/**
	 * Map configuration from the driver and given configuration into a Knex configuratioon model.
	 *
	 * @param {object} config
	 * @returns {object}
	 */
	mapConfig(config) {
		return {
			client: this.client,
			connection: config,
			migrations: {
				tableName: this.migrationsTable,
				directory: this.resolver.resolvePath('migrations')
			},
			seeds: {
				directory: this.resolver.resolvePath('seeds')
			}
		};
	}

	/**
	 * Clean the database of existing data.
	 * Keeps the tables.
	 * @see dropAll()
	 *
	 * @param {Knex} [connection]
	 * @param {object} [options]
	 * @returns {Promise<void>}
	 */
	async clean(connection = this.defaultConnection, options = {}) {
		const { migrationsTable } = this;

		await require('knex-cleaner').clean(connection, { // eslint-disable-line global-require
			...options,
			ignoreTables: [
				...options.ignoreTables || [],
				migrationsTable,
				`${migrationsTable}_lock`
			]
		});
	}

	/**
	 * Drop all tables from the database.
	 *
	 * @param {Knex} [connection]
	 * @param {object} [options]
	 * @returns {Promise<void>}
	 */
	async dropAll(connection, options = {}) {
		const tables = await require('knex-cleaner/lib/knex_tables').getTableNames(connection, options); // eslint-disable-line global-require
		await Promise.all(tables.map((tableName) => {
			return connection.schema.dropTableIfExists(tableName);
		}));
	}

	/**
	 * Get migration status.
	 *
	 * @param {Knex} connection
	 * @returns {Promise<{name: string, ran: boolean}[]>}
	 */
	async migrationStatus(connection) {
		const [migrationsPath] = connection.migrate.generator.config.migrationSource.migrationsPaths;

		const allMigrations = this.file.scandir(migrationsPath);
		const data = await connection.select().from(this.migrationsTable);
		const ranMigrations = data.map(({ name }) => {
			return name;
		});

		return allMigrations.map((name) => {
			const ran = ranMigrations.includes(name);

			return { name, ran };
		});
	}

	/**
	 * @type {Resolver}
	 */
	get resolver() {
		return __(this).get('db.resolver');
	}

	/**
	 * @type {string}
	 */
	get migrationsTable() {
		return this.config.get('database.migrations_table', 'migrations');
	}

}

module.exports = Driver;
