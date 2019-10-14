//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Drivers - Driver
//--------------------------------------------------------
'use strict';

const hasEngine = require('../../../../support/mixins/hasEngine');
const NotImplementedError = require('../../../../foundation/exceptions/NotImplementedError');

/* istanbul ignore next */
/**
 * Abstract driver that defines the basic interface for an event dispatcher driver.
 *
 * @memberof events.services.Dispatcher.drivers
 * @augments support.mixins.HasEngine
 * @abstract
 * @hideconstructor
 */
class Driver extends hasEngine() {

	/**
	 * Add event listener.
	 *
	 * @param {string} event - The event to listen.
	 * @param {Function} listener - The listener.
	 * @returns {Driver} - The current driver instance.
	 * @abstract
	 */
	on(event, listener) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'on', 'Driver');
	}

	/**
	 * Remove event listener for single listener.
	 *
	 * @param {string} event - The event that has been listen.
	 * @param {Function} listener - The listener.
	 * @returns {Driver} - The current driver instance.
	 * @abstract
	 */
	off(event, listener) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'off', 'Driver');
	}

	/**
	 * Add event listener for first event dispatch only.
	 *
	 * @param {string} event - The event to listen.
	 * @param {Function} listener - The listener.
	 * @returns {Driver} - The current driver instance.
	 * @abstract
	 */
	once(event, listener) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'once', 'Driver');
	}

	/**
	 * Dispatch an event with a given payload.
	 *
	 * @param {string} event - The event to dispatch.
	 * @param {*} [payload] - The payload to send into the listeners.
	 * @returns {Driver} - The current driver instance.
	 * @abstract
	 */
	emit(event, payload) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'emit', 'Driver');
	}

	/**
	 * Remove listeners for a given event.
	 *
	 * @param {string} event - The event that has been listen.
	 * @returns {Driver} - The current driver instance.
	 * @abstract
	 */
	removeListeners(event) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'removeListeners', 'Driver');
	}

	/**
	 * Remove all listeners for all events.
	 *
	 * @returns {Driver} - The current driver instance.
	 * @abstract
	 */
	removeAllListeners() {
		throw new NotImplementedError(this, 'removeAllListeners', 'Driver');
	}

}


module.exports = Driver;
