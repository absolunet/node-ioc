//--------------------------------------------------------
//-- Node IoC - Database - Command - Migrate
//--------------------------------------------------------
'use strict';

const Command = require('../../console/Command');


class MigrateCommand extends Command {

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
		return `${this.prefix}:migrate`;
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Run the database migrations.';
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

		this.info('Migrating latest migrations');

		const { migrations, output } = await this.migrate(connection);

		output.forEach((string) => {
			this.warning(string);
		});

		if (migrations.length === 0) {
			this.info('Already up to date');
		} else {
			migrations.forEach((migration) => {
				this.success(`Migrated: ${migration}`);
			});
		}

		if (this.flag('seed')) {
			await this.call(`${this.prefix}:seed`);
		}
	}

	/**
	 * Run database migrations.
	 *
	 * @param {Connector} connection
	 * @returns {Promise<{output: *, migrations: *, batch: *}>}
	 */
	async migrate(connection) {
		this.terminalInterceptor.startCapture();
		const [batch, migrations] = await connection.migrate.latest();
		const output = this.terminalInterceptor.stopCapture();

		return { batch, migrations, output };
	}

}


module.exports = MigrateCommand;
