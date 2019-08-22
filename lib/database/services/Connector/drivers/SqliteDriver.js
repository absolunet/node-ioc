//--------------------------------------------------------
//-- Node IoC - Database - Connector - Sqlite Driver
//--------------------------------------------------------
'use strict';

const __     = require('@absolunet/private-registry');
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
	init() {
		super.init();
		__(this).set('queue', []);
	}

	/**
	 * {@inheritdoc}
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
	 * {@inheritdoc}
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
