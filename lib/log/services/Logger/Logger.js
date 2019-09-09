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

		__(this).set('fallbackChannel', 'file');
	}

	/**
	 * Log emergency message.
	 *
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 */
	emergency(message, context) {
		return this.log(this.LEVEL.EMERGENCY, message, context);
	}

	/**
	 * Log alert message.
	 *
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 */
	alert(message, context) {
		return this.log(this.LEVEL.ALERT, message, context);
	}

	/**
	 * Log critical message.
	 *
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 */
	critical(message, context) {
		return this.log(this.LEVEL.CRITICAL, message, context);
	}

	/**
	 * Log error message.
	 *
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 */
	error(message, context) {
		return this.log(this.LEVEL.ERROR, message, context);
	}

	/**
	 * Log warning message.
	 *
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 */
	warning(message, context) {
		return this.log(this.LEVEL.WARNING, message, context);
	}

	/**
	 * Log notice message.
	 *
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 */
	notice(message, context) {
		return this.log(this.LEVEL.NOTICE, message, context);
	}

	/**
	 * Log info message.
	 *
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 */
	info(message, context) {
		return this.log(this.LEVEL.INFO, message, context);
	}

	/**
	 * Log debug message.
	 *
	 * @param {string} message
	 * @param {*} [context]
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
	async log(level, message, context) {
		await this.logWithDefaultChannel(level, message, context);

		return this;
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
		try {
			const config = this.config.get(`logging.channels.${channel}`);

			if (!config) {
				throw new TypeError(`Cannot find logging channel [${channel}]`);
			}

			if (!this.isLevelUnderThreshold(level, config.level)) {
				const driver = this.driver(config.driver);
				driver.setConfig(config);

				await driver.log(level, message, context);
			}
		} catch (error) {
			if (channel !== this.fallbackChannel) {
				await this.logWithFallbackChannel(this.LEVEL.ERROR, `Error thrown while logging: ${error.message}. Switching to [${this.fallbackChannel}] channel.`);
				await this.logWithFallbackChannel(level, message, context);
			}
		}

		return this;
	}

	/**
	 * Log with default channel.
	 *
	 * @param {number} level
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 */
	logWithDefaultChannel(level, message, context) {
		return this.logWithChannel(this.config.get('logging.default'), level, message, context);
	}

	/**
	 * Log with fallback channel.
	 *
	 * @param {number} level
	 * @param {string} message
	 * @param {*} [context]
	 * @returns {Promise<Logger>}
	 */
	logWithFallbackChannel(level, message, context) {
		return this.logWithChannel(this.fallbackChannel, level, message, context);
	}

	/**
	 * Check if the given level is under the given level threshold.
	 *
	 * @param {string|number} level
	 * @param {string|number} [threshold]
	 */
	isLevelUnderThreshold(level, threshold = 0) {
		return this.getLevelValue(level) < this.getLevelValue(threshold);
	}

	/**
	 * Get parsed level value from either the number value or the verbose string.
	 *
	 * @param {string|number} level
	 * @returns {number}
	 */
	getLevelValue(level) {
		return isNaN(level) ? this.LEVEL[level.toUpperCase()] : parseInt(level, 10);
	}

	/**
	 * @type {Level}
	 */
	get LEVEL() {
		return __(this).get('log.level');
	}

	/**
	 * @type {string}
	 */
	get fallbackChannel() {
		return __(this).get('fallbackChannel');
	}

}


module.exports = Logger;
