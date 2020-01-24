//--------------------------------------------------------
//-- Node IoC - Database - Command - Migrate Fresh
//--------------------------------------------------------

import Command from '../../console/Command';


/**
 * Command that shows the status of each migration.
 *
 * @memberof database.commands
 * @augments console.Command
 * @hideconstructor
 */
class MigrateStatusCommand extends Command {

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
		return `${this.prefix}:migrate:status`;
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return this.t('commands.db-migrate-status.description');
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
	 * @inheritdoc
	 */
	async handle() {
		const connection = this.db.getConnection();
		const status     = await this.db.getDriverForConnection(connection).migrationStatus(connection);
		const columns    = [
			this.t('commands.db-migrate-status.messages.ran'),
			this.t('commands.db-migrate-status.messages.migration')
		];

		this.table(columns, status.map(({ ran, name }) => {
			return [this.t(`commands.db-migrate-status.messages.${ran ? 'yes' : 'no'}`), name];
		}));
	}

}


export default MigrateStatusCommand;
