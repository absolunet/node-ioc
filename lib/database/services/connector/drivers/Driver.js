//--------------------------------------------------------
//-- Node IoC - Database - Connector - Driver
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');
const knex = require('knex');
const knexCleaner = require('knex-cleaner');
const knexTables = require('knex-cleaner/lib/knex_tables');


class Driver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['config', 'config.grammar', 'db.resolver'];
	}

	/**
	 * Client to be used, such as "mysql", "sqlite3", etc.
	 *
	 * @type {string}
	 * @abstract
	 */
	get client() {
		throw new TypeError('Accessor [client] must be implemented. It should return a string.');
	}

	/**
	 * Get Knex connection.
	 *
	 * @returns {Knex}
	 */
	getConnection() {
		const { defaultConnection } = this;

		if (!defaultConnection) {
			throw new Error('No default connection was configured.');
		}

		return defaultConnection;
	}

	/**
	 * Set default Knex connection instance.
	 *
	 * @param {object} config
	 */
	setDefaultConnection(config) {
		__(this).set('default', this.newConnection(config));
	}

	/**
	 * Get new Knex connection.
	 *
	 * @param {object} config
	 * @returns {Knex}
	 */
	newConnection(config) {
		const connection = knex(this.mapConfig(config));

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
				tableName: 'migrations',
				directory: this.paths.migrations
			},
			seeds: {
				directory: this.paths.seeds
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
		await knexCleaner.clean(connection, {
			...options,
			ignoreTables: [
				...options.ignoreTables || [],
				'migrations',
				'migrations_lock'
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
	async dropAll(connection = this.defaultConnection, options = {}) {
		const tables = await knexTables.getTableNames(connection, options);
		await Promise.all(tables.map((tableName) => {
			return connection.schema.dropTableIfExists(tableName);
		}));
	}

	/**
	 * @type {{factories: string, models: string, migrations: string, seeds: string}}
	 */
	get paths() {
		return this.resolver.paths;
	}

	/**
	 * @type {ConfigRepository}
	 */
	get config() {
		return __(this).get('config');
	}

	/**
	 * @type {Grammar}
	 */
	get grammar() {
		return __(this).get('config.grammar');
	}

	/**
	 * @type {Knex}
	 */
	get defaultConnection() {
		return __(this).get('default');
	}

	/**
	 * @returns {Resolver}
	 */
	get resolver() {
		return __(this).get('db.resolver');
	}

}

module.exports = Driver;
