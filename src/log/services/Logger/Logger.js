//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger
//--------------------------------------------------------

import __             from '@absolunet/private-registry';
import hasDriver      from '../../../support/mixins/hasDriver';
import DatabaseDriver from './drivers/DatabaseDriver';
import FileDriver     from './drivers/FileDriver';
import StackDriver    from './drivers/StackDriver';


/**
 * Logger service that exposes log methods representing levels.
 * It forwards the log to the configured driver.
 *
 * @memberof log.services
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Logger extends hasDriver() {

	/**
	 * Class dependencies: <code>['app', 'config', log.level']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['config', 'log.level']);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		super.init();

		this.addDriver('database', DatabaseDriver);
		this.addDriver('file',     FileDriver);
		this.addDriver('stack',    StackDriver);

		this.setFallbackChannel('single');
	}

	/**
	 * Log emergency message.
	 *
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async emergency(message, context) {
		await this.log(this.LEVEL.EMERGENCY, message, context);
	}

	/**
	 * Log alert message.
	 *
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async alert(message, context) {
		await this.log(this.LEVEL.ALERT, message, context);
	}

	/**
	 * Log critical message.
	 *
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async critical(message, context) {
		await this.log(this.LEVEL.CRITICAL, message, context);
	}

	/**
	 * Log error message.
	 *
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async error(message, context) {
		await this.log(this.LEVEL.ERROR, message, context);
	}

	/**
	 * Log warning message.
	 *
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async warning(message, context) {
		await this.log(this.LEVEL.WARNING, message, context);
	}

	/**
	 * Log notice message.
	 *
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async notice(message, context) {
		await this.log(this.LEVEL.NOTICE, message, context);
	}

	/**
	 * Log info message.
	 *
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async info(message, context) {
		await this.log(this.LEVEL.INFO, message, context);
	}

	/**
	 * Log debug message.
	 *
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async debug(message, context) {
		await this.log(this.LEVEL.DEBUG, message, context);
	}

	/**
	 * Log message with default channel.
	 *
	 * @param {number} level - The log level.
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async log(level, message, context) {
		await this.logWithDefaultChannel(level, message, context);
	}

	/**
	 * Log message with the given channel by name.
	 * Catches errors.
	 *
	 * @param {string} channel - The channel to use.
	 * @param {number} level - The log level.
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async logWithChannel(channel, level, message, context) {
		try {
			await this.unsafeLogWithChannel(channel, level, message, context);
		} catch (error) {
			if (channel !== this.fallbackChannel) {
				await this.logWithFallbackChannel(this.LEVEL.ERROR, `Error thrown while logging: "${error.message}". Switching to [${this.fallbackChannel}] channel.`);
				await this.logWithFallbackChannel(level, message, context);
			}
		}
	}

	/**
	 * Log message with the given channel by name.
	 * Does not catch errors.
	 *
	 * @param {string} channel - The channel to use.
	 * @param {number} level - The log level.
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 * @throws {TypeError} Indicates that the log channel was not found.
	 */
	async unsafeLogWithChannel(channel, level, message, context) {
		const config = this.config.get(`log.channels.${channel}`);

		if (!config) {
			throw new TypeError(`Cannot find log channel [${channel}]`);
		}

		if (!this.isLevelUnderThreshold(level, config.level)) {
			const driver = this.driver(config.driver);
			driver.setConfig(config);

			await driver.log(level, message, context);
		}
	}

	/**
	 * Log with default channel.
	 *
	 * @param {number} level - The log level.
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async logWithDefaultChannel(level, message, context) {
		await this.logWithChannel(this.config.get('log.default'), level, message, context);
	}

	/**
	 * Log with fallback channel.
	 *
	 * @param {number} level - The log level.
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 */
	async logWithFallbackChannel(level, message, context) {
		await this.logWithChannel(this.fallbackChannel, level, message, context);
	}

	/**
	 * Check if the given level is under the given level threshold.
	 *
	 * @param {string|number} level - The level to evaluate.
	 * @param {string|number} [threshold] - The threshold.
	 * @returns {boolean} Indicates that the given level is under the given threshold.
	 */
	isLevelUnderThreshold(level, threshold = 0) {
		return this.getLevelValue(level) < this.getLevelValue(threshold);
	}

	/**
	 * Get parsed level value from either the number value or the verbose string.
	 *
	 * @param {string|number} level - The level.
	 * @returns {number} The level value as integer.
	 */
	getLevelValue(level) {
		return isNaN(level) ? this.LEVEL[level.toUpperCase()] : parseInt(level, 10);
	}

	/**
	 * Set default channel.
	 *
	 * @param {string} channel - The fallback channel name.
	 */
	setFallbackChannel(channel) {
		__(this).set('fallbackChannel', channel);
	}

	/**
	 * Log level enum.
	 *
	 * @type {log.enums.Level}
	 */
	get LEVEL() {
		return __(this).get('log.level');
	}

	/**
	 * The fallback channel.
	 *
	 * @type {string}
	 */
	get fallbackChannel() {
		return __(this).get('fallbackChannel');
	}

}


export default Logger;
