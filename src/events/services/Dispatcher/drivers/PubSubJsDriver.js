//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Drivers - PubSubJS Driver
//--------------------------------------------------------

import __     from '@absolunet/private-registry';
import PubSub from 'pubsub-js';
import Driver from './Driver';


/**
 * Dispatcher driver that uses PubSubJS as dispatcher engine.
 *
 * @memberof events.services.Dispatcher.drivers
 * @augments events.services.Dispatcher.drivers.Driver
 * @hideconstructor
 */
class PubSubJsDriver extends Driver {

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		__(this).set('tokens', {});
		this.setEngine(PubSub);
	}

	/**
	 * @inheritdoc
	 */
	on(event, listener) {
		this.saveTokenForCall(event, listener, 'subscribe');

		return this;
	}

	/**
	 * @inheritdoc
	 */
	once(event, listener) {
		this.saveTokenForCall(event, listener, 'subscribeOnce');

		return this;
	}

	/**
	 * @inheritdoc
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
	 * @inheritdoc
	 */
	removeListeners(event) {
		this.engine.clearSubscriptions(event);

		return this;
	}

	/**
	 * @inheritdoc
	 */
	removeAllListeners() {
		this.engine.clearAllSubscriptions();

		return this;
	}

	/**
	 * @inheritdoc
	 */
	emit(event, payload) {
		this.engine.publishSync(event, payload);

		return this;
	}

	/**
	 * Save token got from the given call on the engine.
	 *
	 * @param {string} event - The event to listen.
	 * @param {Function} listener - The listener.
	 * @param {string} method - The method to use on the engine.
	 * @returns {Driver} - The current driver instance.
	 */
	saveTokenForCall(event, listener, method) {
		const tokens = __(this).get('tokens');
		tokens[event] = tokens[event] || new Map();
		tokens[event].set(listener, this.engine[method](event, listener));

		return this;
	}

}


export default PubSubJsDriver;
