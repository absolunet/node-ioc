//--------------------------------------------------------
//-- Node IoC - Database - Connector - Sqlite Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


/**
 * SQLite connector driver.
 *
 * @memberof database.services.Connector.drivers
 * @augments database.services.Connector.drivers.Driver
 * @hideconstructor
 */
class SqliteDriver extends Driver {

	/**
	 * @inheritdoc
	 */
	get client() {
		return 'sqlite3';
	}

	/**
	 * @inheritdoc
	 */
	mapConfig(config) {
		const data = super.mapConfig(config);

		return {
			...data,
			useNullAsDefault: true,
			connection: {
				...data.connection,
				filename: config.filename
			}
		};
	}

	/**
	 * @inheritdoc
	 */
	async dropAll(connection, options = {}) {
		await super.dropAll(connection, {
			...options,
			ignoreTables: [
				...options.ignoreTables || [],
				'sqlite_master',
				'sqlite_sequence'
			]
		});
	}

}

module.exports = SqliteDriver;
