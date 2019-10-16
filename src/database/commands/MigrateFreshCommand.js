//-- Node IoC - Database - Command - Migrate Fresh
//--------------------------------------------------------

import Command from '../../console/Command';


/**
 * Command that drops all tables and re-runs all migrations.
 *
 * @memberof database.commands
 * @augments console.Command
 * @hideconstructor
 */
class MigrateFreshCommand extends Command {

	/**
	 * Class dependencies: <code>['config', 'db']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['config', 'db']);
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
		return `${this.prefix}:migrate:fresh`;
	}

	/**
	 * @inheritdoc
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

		this.info('Migrating all migrations in fresh database');

		this.info('Dropping all tables');
		await this.dropAllTables(connection);
		this.info('All tables dropped');

		await this.call(`${this.prefix}:migrate${this.flag('seed') ? ' --seed' : ''}`);
	}

	/**
	 * Drop all database tables.
	 *
	 * @param {Knex} connection - The database connection to use.
	 * @returns {Promise<void>} - The async process promise.
	 */
	async dropAllTables(connection) {
		const driver = this.db.getDriverForConnection(connection);
		await driver.dropAll(connection);
		await driver.clean(connection);
	}

}


export default MigrateFreshCommand;
