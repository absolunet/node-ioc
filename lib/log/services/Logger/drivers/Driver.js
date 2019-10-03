//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger - Drivers - Driver
//--------------------------------------------------------
'use strict';

const __                  = require('@absolunet/private-registry');
const hasEngine           = require('../../../../support/mixins/hasEngine');
const NotImplementedError = require('../../../../foundation/exceptions/NotImplementedError');

/* istanbul ignore next */
class Driver extends hasEngine() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['log.level']);
	}

	/**
	 * Log message with context for a given level.
	 *
	 * @async
	 * @abstract
	 */
	log() {
		throw new NotImplementedError(this, 'log', 'Promise<any>');
	}

	/**
	 * Set configuration for the channel.
	 *
	 * @param {object} config
	 * @returns {Driver}
	 */
	setConfig(config) {
		__(this).set('config', config);

		return this;
	}

	/**
	 * @type {object}
	 */
	get config() {
		return __(this).get('config');
	}

	/**
	 * @type {Level}
	 */
	get LEVEL() {
		return __(this).get('log.level');
	}

}


module.exports = Driver;
