//--------------------------------------------------------
//-- Node IoC - Database - Command - Migrate Refresh
//--------------------------------------------------------
'use strict';

const Command = require('../../console/Command');


class MigrateRefreshCommand extends Command {

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
		return `${this.prefix}:migrate:refresh`;
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Reset and re-run all migrations.';
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

		this.info('Rolling back migrations');
		const rollback = await this.rollback(connection);

		rollback.output.forEach((string) => {
			this.warning(string);
		});

		if (rollback.migrations.length > 0) {
			rollback.migrations.forEach((migration) => {
				this.success(`Rolled back: ${migration}`);
			});
		}

		await this.call(`${this.prefix}:migrate${this.flag('seed') ? ' --seed' : ''}`);
	}

	/**
	 * Rollback all database migrations.
	 *
	 * @param {Connector} connection
	 * @returns {Promise<{output: *, migrations: *}>}
	 */
	async rollback(connection) {
		this.terminalInterceptor.startCapture();
		const [, migrations] = await connection.migrate.rollback();
		const output         = this.terminalInterceptor.stopCapture();

		if (migrations.length > 0) {
			const { migrations: nextMigrations, output: nextOutput } = await this.rollback(connection);
			migrations.push(...nextMigrations);
			output.push(...nextOutput);
		}

		return { migrations, output };
	}

}


module.exports = MigrateRefreshCommand;
