//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher
//--------------------------------------------------------
'use strict';

const hasDriver          = require('../../../support/mixins/hasDriver');
const forwardCalls       = require('../../../support/mixins/forwardCalls');
const DispatcherProxy    = require('./DispatcherProxy');
const EventEmitterDriver = require('./drivers/EventEmitterDriver');
const PubSubJsDriver     = require('./drivers/PubSubJsDriver');


class Dispatcher extends forwardCalls(hasDriver()) {

	/**
	 * Dispatcher constructor.
	 *
	 * @returns {Dispatcher}
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new DispatcherProxy());
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		super.init();

		this.addDriver('emitter',  EventEmitterDriver);
		this.addDriver('pubsubjs', PubSubJsDriver);

		const { app } = this;
		const defaultDriver = app.isBound('config') ? app.make('config').get('events.default', 'emitter') : 'emitter';

		this.setDefaultDriver(defaultDriver);
	}

	/**
	 * {@inheritdoc}
	 */
	getForward() {
		return this.driver();
	}

}


module.exports = Dispatcher;
