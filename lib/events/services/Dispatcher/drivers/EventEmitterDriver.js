//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Drivers - Event Emitter Driver
//--------------------------------------------------------
'use strict';

const __           = require('@absolunet/private-registry');
const EventEmitter = require('events');
const Driver       = require('./Driver');


class EventEmitterDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	init() {
		__(this).set('listeners', new WeakMap());
		this.setEngine(new EventEmitter());
	}

	/**
	 * {@inheritdoc}
	 */
	on(event, listener) {
		this.engine.on(event, this.makeListenerForEvent(event, listener));

		return this;
	}

	/**
	 * {@inheritdoc}
	 */
	once(event, listener) {
		this.engine.once(event, this.makeListenerForEvent(event, listener));

		return this;
	}

	/**
	 * {@inheritdoc}
	 */
	off(event, listener) {
		this.engine.off(event, __(this).get('listeners').get(listener) || listener);

		return this;
	}

	/**
	 * {@inheritdoc}
	 */
	removeListeners(event) {
		this.engine.removeAllListeners(event);

		return this;
	}

	/**
	 * Make and save a listener that will call the given listener with the event and the payload instead of the payload only.
	 *
	 * @param {string} event
	 * @param {Function} listener
	 * @returns {function}
	 */
	makeListenerForEvent(event, listener) {
		const realListener = (payload) => {
			return listener(event, payload);
		};

		__(this).get('listeners').set(listener, realListener);

		return realListener;
	}

}


module.exports = EventEmitterDriver;
