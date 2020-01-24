//--------------------------------------------------------
//-- Node IoC - Database - Command - Migrate Rollback
//--------------------------------------------------------

import Command from '../../console/Command';


/**
 * Command that rollbacks the last database migrations.
 *
 * @memberof database.commands
 * @augments console.Command
 * @hideconstructor
 */
class MigrateRollbackCommand extends Command {

	/**
	 * Class dependencies: <code>['config', 'db', 'terminal.interceptor']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['config', 'db', 'terminal.interceptor']);
	}

	/**
	 * @inheritdoc
	 */
	get policies() {
		return ['db'];
	}

	/**
	 * @inheritdoc
	 */
	get name() {
		return `${this.prefix}:migrate:rollback`;
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return this.t('commands.db-migrate-rollback.description');
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
	 * @inheritdoc
	 */
	async handle() {
		const connection = await this.db.getConnection();

		this.info(this.t('commands.db-migrate-rollback.messages.rolling-back'));
		const { batch, migrations, output } = await this.rollback(connection);

		output.forEach((string) => {
			this.warning(string);
		});

		if (migrations.length === 0) {
			this.info(this.t('commands.db-migrate-rollback.messages.up-to-date'));
		} else {
			this.info(`Migration #${batch} rollback successful!`);
			migrations.forEach((migration) => {
				this.success(this.t('commands.db-migrate-rollback.messages.rolled-back', { migration }));
			});
		}
	}

	/**
	 * Rollback the database migrations.
	 *
	 * @param {database.services.Connector} connection - The database connection to use.
	 * @returns {Promise<{output: *, migrations: *, batch: *}>} The migrations that ran, the current batch and the output made by Knex.
	 */
	async rollback(connection) {
		this.terminalInterceptor.startCapture();
		const [batch, migrations] = await connection.migrate.rollback();
		const output = this.terminalInterceptor.stopCapture();

		return { batch, migrations, output };
	}

}


export default MigrateRollbackCommand;
