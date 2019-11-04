//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher
//--------------------------------------------------------

import hasDriver          from '../../../support/mixins/hasDriver';
import DispatcherProxy    from './DispatcherProxy';
import EventEmitterDriver from './drivers/EventEmitterDriver';
import PubSubJsDriver     from './drivers/PubSubJsDriver';


/**
 * Event dispatcher that manages the events publishing and subscribing.
 *
 * @memberof events.services
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Dispatcher extends hasDriver() {

	/**
	 * Dispatcher constructor.
	 *
	 * @param {...*} parameters - Injected parameters.
	 * @returns {event.services.Dispatcher} The dispatcher instance wrapped by a proxy.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new DispatcherProxy());
	}

	/**
	 * @inheritdoc
	 * @private
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
	 * Get default driver for forward calls.
	 *
	 * @returns {event.services.Dispatcher.drivers.Driver} The default driver instance.
	 */
	getForward() {
		return this.driver();
	}

}


export default Dispatcher;
