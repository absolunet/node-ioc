//--------------------------------------------------------
//-- Node IoC - Database - Connector - Sqlite Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


class SqliteDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	get client() {
		return 'sqlite3';
	}

	/**
	 * {@inheritdoc}
	 */
	mapConfig(config) {
		const data = super.mapConfig(config);
		data.connection = {
			...data.connection,
			filename: this.configGrammar.formatPath(config.database)
		};

		data.useNullAsDefault = true;

		return data;
	}

	/**
	 * {@inheritdoc}
	 */
	async dropAll(connection = this.defaultConnection, options = {}) {
		await super.dropAll(connection, this.formatKnexCleanerOptions(options));
	}

	/**
	 * Format Knex cleaner plugin options.
	 *
	 * @param {object} options
	 * @returns {object}
	 */
	formatKnexCleanerOptions(options) {
		return {
			...options,
			ignoreTables: [
				...options.ignoreTables || [],
				'sqlite_master',
				'sqlite_sequence'
			]
		};
	}

}

module.exports = SqliteDriver;
