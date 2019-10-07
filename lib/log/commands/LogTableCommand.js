//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Seeder
//--------------------------------------------------------
'use strict';

const GeneratorCommand = require('../../console/GeneratorCommand');


class LogTableCommand extends GeneratorCommand {

	/**
	 * {@inheritdoc}
	 */
	get policies() {
		return ['db', 'env:local'];
	}

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'log:table';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Create a migration for the log database table.';
	}

	/**
	 * {@inheritdoc}
	 */
	get files() {
		return {
			base: this.app.formatPath(__dirname, 'stubs', 'CreateLogsTable.stub')
		};
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return this.app.make('db.resolver').resolvePath('migrations');
	}

	/**
	 * {@inheritdoc}
	 */
	get filename() {
		const prefix    = this.app.make('helper.date')().format('YYYYMMDDHHmmss');
		const className = this.getClassName();

		return `${prefix}_${className}.js`;
	}

	/**
	 * {@inheritdoc}
	 */
	get patterns() {
		return {
			TABLE: this.getLogsTableName(),
			CLASS: this.getClassName()
		};
	}

	/**
	 * {@inheritdoc}
	 */
	get parameters() {
		return [];
	}

	/**
	 * {@inheritdoc}
	 */
	get options() {
		return [];
	}

	/**
	 * {@inheritdoc}
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
	 * @returns {boolean}
	 */
	migrationExists() {
		const { destination: folder } = this;
		const end = this.filename.split('_').pop();
		const files = this.app.make('file').scandir(folder);

		return files.some((name) => {
			return name.endsWith(end);
		});
	}

	/**
	 * Get the logs table name, "logs" by default.
	 *
	 * @returns {string}
	 */
	getLogsTableName() {
		return this.app.make('config').get('log.channels.database.table', 'logs');
	}

	/**
	 * Get the migration class name.
	 *
	 * @returns {string}
	 */
	getClassName() {
		return `Create${this.app.make('helper.string').pascal(this.getLogsTableName())}Table`;
	}

}


module.exports = LogTableCommand;
