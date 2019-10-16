//--------------------------------------------------------
//-- Node IoC - Database - Command - Migrate
//--------------------------------------------------------

import Command from '../../console/Command';


/**
 * Command that runs the database migrations.
 *
 * @memberof database.commands
 * @augments console.Command
 * @hideconstructor
 */
class MigrateCommand extends Command {

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
		return `${this.prefix}:migrate`;
	}

	/**
	 * @inheritdoc
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
	 * @inheritdoc
	 */
	get flags() {
		return [
			['seed', 'Seed the database after the migrations.']
		];
	}

	/**
	 * @inheritdoc
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
	 * @param {Connector} connection - The database connection to use.
	 * @returns {Promise<{output: *, migrations: *, batch: *}>} - The migrations that ran, the current batch and the output made by Knex.
	 */
	async migrate(connection) {
		this.terminalInterceptor.startCapture();
		const [batch, migrations] = await connection.migrate.latest();
		const output = this.terminalInterceptor.stopCapture();

		return { batch, migrations, output };
	}

}


export default MigrateCommand;
