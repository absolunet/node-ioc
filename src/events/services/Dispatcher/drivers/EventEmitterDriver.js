//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Drivers - Event Emitter Driver
//--------------------------------------------------------

import __           from '@absolunet/private-registry';
import EventEmitter from 'events';
import Driver       from './Driver';


/**
 * Dispatcher driver that uses the native EventEmitter from Node.js as dispatcher engine.
 *
 * @memberof events.services.Dispatcher.drivers
 * @augments events.services.Dispatcher.drivers.Driver
 * @hideconstructor
 */
class EventEmitterDriver extends Driver {

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		__(this).set('listeners', new WeakMap());
		this.setEngine(new EventEmitter());
	}

	/**
	 * @inheritdoc
	 */
	on(event, listener) {
		this.engine.on(event, this.makeListenerForEvent(event, listener));

		return this;
	}

	/**
	 * @inheritdoc
	 */
	once(event, listener) {
		this.engine.once(event, this.makeListenerForEvent(event, listener));

		return this;
	}

	/**
	 * @inheritdoc
	 */
	off(event, listener) {
		this.engine.off(event, __(this).get('listeners').get(listener) || listener);

		return this;
	}

	/**
	 * @inheritdoc
	 */
	emit(event, payload = null) {
		this.engine.emit(event, payload);

		return this;
	}

	/**
	 * @inheritdoc
	 */
	removeListeners(event) {
		this.engine.removeAllListeners(event);

		return this;
	}

	/**
	 * @inheritdoc
	 */
	removeAllListeners() {
		this.engine.removeAllListeners();

		return this;
	}

	/**
	 * Make and save a listener that will call the given listener with the event and the payload instead of the payload only.
	 *
	 * @param {string} event - The event to listen.
	 * @param {Function} listener - The listener.
	 * @returns {Function} The listener wrapper acting as the listener singleton inside the EventEmitter instance.
	 */
	makeListenerForEvent(event, listener) {
		const realListener = (payload) => {
			return listener(event, payload);
		};

		__(this).get('listeners').set(listener, realListener);

		return realListener;
	}

}


export default EventEmitterDriver;
