//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Seeder
//--------------------------------------------------------
'use strict';

const GeneratorCommand = require('../../console/GeneratorCommand');


class CacheTableCommand extends GeneratorCommand {

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
		return 'cache:table';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Create a migration for the cache database table.';
	}

	/**
	 * {@inheritdoc}
	 */
	get files() {
		return {
			base: this.app.formatPath(__dirname, 'stubs', 'CreateCacheTable.stub')
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
			TABLE: this.getCacheTableName(),
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
		this.debug(`Generating cache migration file.`);

		if (this.migrationExists()) {
			this.warning('The migration already exists.');

			return;
		}

		await this.generate('base');
		this.info(`Cache migration file successfully generated!`);
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
	 * Get the cache table name, "cache" by default.
	 *
	 * @returns {string}
	 */
	getCacheTableName() {
		return this.app.make('config').get('cache.stores.database.table', 'cache');
	}

	/**
	 * Get the migration class name.
	 *
	 * @returns {string}
	 */
	getClassName() {
		return `Create${this.app.make('helper.string').pascal(this.getCacheTableName())}Table`;
	}

}


module.exports = CacheTableCommand;
