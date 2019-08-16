//--------------------------------------------------------
//-- Node IoC - Database - Command - Migrate Fresh
//--------------------------------------------------------
'use strict';

const __      = require('@absolunet/private-registry');
const Command = require('../../console/Command');


class MigrateStatusCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['config', 'db', 'terminal.interceptor'];
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
		return `${this.prefix}:migrate:status`;
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Get the current migration status';
	}

	/**
	 * Command prefix.
	 *
	 * @type {string}
	 */
	get prefix() {
		return this.config.get('database.command_namespace', 'db');
	}

	/**
	 * {@inheritdoc}
	 */
	async handle() {
		const connection = await this.db.getConnection();
		const status     = await this.db.getDriverForConnection(connection).migrationStatus(connection);

		this.table(['Ran?', 'Migration'], status.map(({ ran, name }) => {
			return [ran ? 'Y' : 'N', name];
		}));
	}

	/**
	 * @type {Interceptor}
	 */
	get interceptor() {
		return __(this).get('terminal.interceptor');
	}

}

module.exports = MigrateStatusCommand;
