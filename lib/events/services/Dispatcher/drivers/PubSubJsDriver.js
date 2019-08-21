//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Drivers - PubSubJS Driver
//--------------------------------------------------------
'use strict';

const __     = require('@absolunet/private-registry');
const PubSub = require('pubsub-js');
const Driver = require('./Driver');


class PubSubJsDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	init() {
		__(this).set('tokens', {});
		this.setEngine(PubSub);
	}

	/**
	 * {@inheritdoc}
	 */
	on(event, listener) {
		this.saveTokenForCall(event, listener, 'subscribe');

		return this;
	}

	/**
	 * {@inheritdoc}
	 */
	once(event, listener) {
		this.saveTokenForCall(event, listener, 'subscribeOnce');

		return this;
	}

	/**
	 * {@inheritdoc}
	 */
	off(event, listener) {
		const tokenMap = __(this).get('tokens')[event];

		if (tokenMap) {
			const token = tokenMap.get(listener);

			if (token) {
				this.engine.unsubscribe(token);
			}
		}

		return this;
	}

	/**
	 * {@inheritdoc}
	 */
	removeListeners(event) {
		this.engine.clearSubscriptions(event);

		return this;
	}

	/**
	 * {@inheritdoc}
	 */
	removeAllListeners() {
		this.engine.clearAllSubscriptions();

		return this;
	}

	/**
	 * {@inheritdoc}
	 */
	emit(event, payload) {
		this.engine.publishSync(event, payload);

		return this;
	}

	/**
	 * Save token got from the given call on the engine.
	 *
	 * @param {string} event
	 * @param {Function} listener
	 * @param {string} method
	 * @returns {Driver}
	 */
	saveTokenForCall(event, listener, method) {
		const tokens = __(this).get('tokens');
		tokens[event] = tokens[event] || new Map();
		tokens[event].set(listener, this.engine[method](event, listener));

		return this;
	}

}


module.exports = PubSubJsDriver;
