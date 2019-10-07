//--------------------------------------------------------
//-- Node IoC - Database - Command - Migrate Fresh
//--------------------------------------------------------
'use strict';

const __      = require('@absolunet/private-registry');
const Command = require('../../console/Command');


class MigrateFreshCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['config', 'db', 'terminal.interceptor']);
	}

	/**
	 * {@inheritdoc}
	 */
	get policies() {
		return ['db'];
	}

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return `${this.prefix}:migrate:fresh`;
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Drop all tables and re-run all migrations.';
	}

	/**
	 * Command prefix.
	 *
	 * @type {string}
	 */
	get prefix() {
		return this.config.get('database.command_namespace');
	}

	/**
	 * {@inheritdoc}
	 */
	get flags() {
		return [
			['seed', 'Seed the database after the migrations.']
		];
	}

	/**
	 * {@inheritdoc}
	 */
	async handle() {
		const connection = await this.db.getConnection();

		this.info('Migrating all migrations in fresh database');

		this.info('Dropping all tables');
		await this.dropAllTables(connection);
		this.info('All tables dropped');

		await this.call(`${this.prefix}:migrate${this.flag('seed') ? ' --seed' : ''}`);
	}

	/**
	 * Drop all database tables.
	 *
	 * @param {Knex} connection
	 * @returns {Promise<void>}
	 */
	async dropAllTables(connection) {
		await this.db.getDriverForConnection(connection).dropAll(connection);
		await this.db.getDriverForConnection(connection).clean(connection);
	}

	/**
	 * @type {Interceptor}
	 */
	get interceptor() {
		return __(this).get('terminal.interceptor');
	}

}

module.exports = MigrateFreshCommand;
