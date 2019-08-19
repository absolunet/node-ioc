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
		const { connection } = this;

		await connection(this.config.table).insert({
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
