//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger - Drivers - Driver
//--------------------------------------------------------

import __                  from '@absolunet/private-registry';
import hasEngine           from '../../../../support/mixins/hasEngine';
import NotImplementedError from '../../../../foundation/exceptions/NotImplementedError';

/* istanbul ignore next */
/**
 * Abstract driver that defines the basic interface for a logger driver.
 *
 * @memberof log.services.Logger.drivers
 * @augments support.mixins.HasEngine
 * @abstract
 * @hideconstructor
 */
class Driver extends hasEngine() {

	/**
	 * Class dependencies: <code>['log.level']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['log.level']);
	}

	/**
	 * Log message with context for a given level.
	 *
	 * @param {number} level - The log level.
	 * @param {string} message - The message.
	 * @param {*} [context] - The context.
	 * @returns {Promise} The async process promise.
	 * @async
	 * @abstract
	 */
	log(level, message, context) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'log', 'Promise<any>');
	}

	/**
	 * Set configuration for the channel.
	 *
	 * @param {object} config - The driver configuration.
	 * @returns {log.services.Logger.drivers.Driver} The current driver instance.
	 */
	setConfig(config) {
		__(this).set('config', config);

		return this;
	}

	/**
	 * Driver configuration.
	 *
	 * @type {object}
	 */
	get config() {
		return __(this).get('config');
	}

	/**
	 * Log level enum.
	 *
	 * @type {log.enums.Level}
	 */
	get LEVEL() {
		return __(this).get('log.level');
	}

}


export default Driver;
