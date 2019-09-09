//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger - Drivers - File Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


class DatabaseDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'db', 'terminal']);
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		this.setConfig({
			connection: 'default',
			table: 'logs'
		});
	}

	/**
	 * {@inheritdoc}
	 */
	async log(level, message, context) {
		await this.storeLog(level, message, context);
		await this.cleanPastLogs();
	}

	/**
	 * Store log in database.
	 *
	 * @param {string|number} level
	 * @param {string} message
	 * @param {object} [context]
	 * @returns {Promise<void>}
	 */
	async storeLog(level, message, context) {
		const { connection, config: { table } } = this;

		await connection(table).insert({
			level:      this.getFormattedLevel(level),
			version:    this.getFormattedVersion(),
			message:    this.getFormattedMessage(message),
			command:    this.getFormattedCommand(),
			context:    this.getFormattedContext(context),
			created_at: connection.fn.now(), // eslint-disable-line camelcase
			updated_at: connection.fn.now()  // eslint-disable-line camelcase
		});
	}

	/**
	 * Clear past logs in the database, starting by the least recent ones.
	 *
	 * @returns {Promise<void>}
	 */
	async cleanPastLogs() {
		const { connection, config: { table, limit } } = this;
		const [{ count }] = await connection.select().from(table).count('id as count');
		if (count > limit) {
			const results = await connection.select('id').from(table).orderBy('id').limit(count - limit);
			const [{ id }] = results.reverse();
			await connection(table).delete().where('id', '<=', id);
		}
	}

	/**
	 * Get formatted level value.
	 *
	 * @param {number|string} level
	 * @returns {number}
	 */
	getFormattedLevel(level) {
		return typeof level === 'number' ? level : this.LEVEL[level.toUpperCase()];
	}

	/**
	 * Get formatted version value.
	 *
	 * @returns {string}
	 */
	getFormattedVersion() {
		return this.app.version;
	}

	/**
	 * Get formatted message value.
	 *
	 * @param {string} message
	 * @returns {string}
	 */
	getFormattedMessage(message) {
		return message.toString();
	}

	/**
	 * Get formatted current command.
	 *
	 * @returns {string}
	 */
	getFormattedCommand() {
		return this.terminal.command || '';
	}

	/**
	 * Get formatted context by converting it into JSON.
	 *
	 * @param {*} context
	 * @returns {string}
	 */
	getFormattedContext(context) {
		return JSON.stringify(typeof context === 'undefined' ? null : context);
	}

	/**
	 * @type {Knex}
	 */
	get connection() {
		return this.db.getConnection(this.config.connection);
	}

}


module.exports = DatabaseDriver;
