//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Drivers - Driver
//--------------------------------------------------------
'use strict';

const hasEngine = require('../../../../support/mixins/hasEngine');


class Driver extends hasEngine() {

	/**
	 * Add event listener.
	 *
	 * @param {string} event
	 * @param {Function} listener
	 * @returns {Driver}
	 */
	on(event, listener) {
		this.engine.on(event, listener);

		return this;
	}

	/**
	 * Remove event listener for single listener.
	 *
	 * @param {string} event
	 * @param {Function} listener
	 * @returns {Driver}
	 */
	off(event, listener) {
		this.engine.off(event, listener);

		return this;
	}

	/**
	 * Add event listener for first event dispatch only.
	 *
	 * @param {string} event
	 * @param {Function} listener
	 * @returns {Driver}
	 */
	once(event, listener) {
		this.engine.once(event, listener);

		return this;
	}

	/**
	 * Dispatch an event with a given payload.
	 *
	 * @param {string} event
	 * @param {*} payload
	 * @returns {Driver}
	 */
	emit(event, payload = null) {
		this.engine.emit(event, payload);

		return this;
	}

	/**
	 * Remove listeners for a given event.
	 *
	 * @param {string} event
	 * @returns {Driver}
	 */
	removeListeners(event) {
		this.engine.removeListeners(event);

		return this;
	}

	/**
	 * Remove all listeners for all events.
	 *
	 * @returns {Driver}
	 */
	removeAllListeners() {
		this.engine.removeAllListeners();

		return this;
	}

}


module.exports = Driver;
