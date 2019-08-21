//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger
//--------------------------------------------------------
'use strict';

const __             = require('@absolunet/private-registry');
const hasDriver      = require('../../../support/mixins/hasDriver');
const DatabaseDriver = require('./drivers/DatabaseDriver');
const FileDriver     = require('./drivers/FileDriver');


class Logger extends hasDriver() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['config', 'log.level']);
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		super.init();

		this.addDriver('database', DatabaseDriver);
		this.addDriver('file',     FileDriver);
	}

	/**
	 * Log emergency message.
	 *
	 * @param {string} message
	 * @param {*} context
	 * @returns {Promise<Logger>}
	 */
	emergency(message, context) {
		return this.log(this.LEVEL.EMERGENCY, message, context);
	}

	/**
	 * Log alert message.
	 *
	 * @param {string} message
	 * @param {*} context
	 * @returns {Promise<Logger>}
	 */
	alert(message, context) {
		return this.log(this.LEVEL.ALERT, message, context);
	}

	/**
	 * Log critical message.
	 *
	 * @param {string} message
	 * @param {*} context
	 * @returns {Promise<Logger>}
	 */
	critical(message, context) {
		return this.log(this.LEVEL.CRITICAL, message, context);
	}

	/**
	 * Log error message.
	 *
	 * @param {string} message
	 * @param {*} context
	 * @returns {Promise<Logger>}
	 */
	error(message, context) {
		return this.log(this.LEVEL.ERROR, message, context);
	}

	/**
	 * Log warning message.
	 *
	 * @param {string} message
	 * @param {*} context
	 * @returns {Promise<Logger>}
	 */
	warning(message, context) {
		return this.log(this.LEVEL.WARNING, message, context);
	}

	/**
	 * Log notice message.
	 *
	 * @param {string} message
	 * @param {*} context
	 * @returns {Promise<Logger>}
	 */
	notice(message, context) {
		return this.log(this.LEVEL.NOTICE, message, context);
	}

	/**
	 * Log info message.
	 *
	 * @param {string} message
	 * @param {*} context
	 * @returns {Promise<Logger>}
	 */
	info(message, context) {
		return this.log(this.LEVEL.INFO, message, context);
	}

	/**
	 * Log debug message.
	 *
	 * @param {string} message
	 * @param {*} context
	 * @returns {Promise<Logger>}
	 */
	debug(message, context) {
		return this.log(this.LEVEL.DEBUG, message, context);
	}

	/**
	 * Log message with default channel.
	 *
	 * @param {number} level
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 */
	log(level, message, context) {
		return this.logWithChannel('default', level, message, context);
	}

	/**
	 * Log message with the given channel by name.
	 *
	 * @param {string} channel
	 * @param {number} level
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 * @throws
	 */
	async logWithChannel(channel, level, message, context) {
		if (channel === 'default') {
			return this.logWithChannel(this.config.get('logging.default'), level, message, context);
		}

		const config = this.config.get(`logging.channels.${channel}`);

		if (!config) {
			throw new TypeError(`Cannot find logging channel [${channel}]`);
		}

		const driver = this.driver(config.driver);
		driver.setConfig(config);

		await driver.log(level, message, context);

		return this;
	}

	/**
	 * @type {Level}
	 */
	get LEVEL() {
		return __(this).get('log.level');
	}

}


module.exports = Logger;
