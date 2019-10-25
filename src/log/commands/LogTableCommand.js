//--------------------------------------------------------
//-- Node IoC - Database - Command - Log Table
//--------------------------------------------------------

import GeneratorCommand from '../../console/GeneratorCommand';


/**
 * Command that creates the migration for "logs" database table.
 *
 * @memberof log.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class LogTableCommand extends GeneratorCommand {

	/**
	 * @inheritdoc
	 */
	get policies() {
		return ['db', 'env:local'];
	}

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'log:table';
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return 'Create a migration for the log database table.';
	}

	/**
	 * @inheritdoc
	 */
	get files() {
		return {
			base: this.app.formatPath(__dirname, 'stubs', 'CreateLogsTable.stub')
		};
	}

	/**
	 * @inheritdoc
	 */
	get destination() {
		return this.app.make('db.resolver').resolveSourcePath('migrations');
	}

	/**
	 * @inheritdoc
	 */
	get fileName() {
		const prefix = this.app.make('helper.date')().format('YYYYMMDDHHmmss');
		const name   = this.getClassName();

		return `${prefix}_${name}.js`;
	}

	/**
	 * @inheritdoc
	 */
	get patterns() {
		return {
			TABLE: this.getLogsTableName(),
			CLASS: this.getClassName()
		};
	}

	/**
	 * @inheritdoc
	 */
	get parameters() {
		return [];
	}

	/**
	 * @inheritdoc
	 */
	get options() {
		return [];
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		this.debug(`Generating log migration file.`);

		if (this.migrationExists()) {
			this.warning('The migration already exists.');

			return;
		}

		await this.generate('base');
		this.info(`Log migration file successfully generated!`);
		this.info(`Don't forget to run migration command.`);
	}

	/**
	 * Check if migration already exists in configured directory.
	 *
	 * @returns {boolean} Indicates if the migration file already exists.
	 */
	migrationExists() {
		const { destination: folder } = this;
		const end   = this.fileName.split('_').pop();
		const files = this.app.make('file').scandir(folder);

		return files.some((name) => {
			return name.endsWith(end);
		});
	}

	/**
	 * Get the logs table name, "logs" by default.
	 *
	 * @returns {string} Logs table name.
	 */
	getLogsTableName() {
		return this.app.make('config').get('log.channels.database.table', 'logs');
	}

	/**
	 * Get the migration class name.
	 *
	 * @returns {string} The class name.
	 */
	getClassName() {
		return `Create${this.app.make('helper.string').pascal(this.getLogsTableName())}Table`;
	}

}


export default LogTableCommand;
