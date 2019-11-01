//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher
//--------------------------------------------------------

import hasDriver          from '../../../support/mixins/hasDriver';
import forwardsCalls      from '../../../support/mixins/forwardsCalls';
import DispatcherProxy    from './DispatcherProxy';
import EventEmitterDriver from './drivers/EventEmitterDriver';
import PubSubJsDriver     from './drivers/PubSubJsDriver';


/**
 * Event dispatcher that manages the events publishing and subscribing.
 *
 * @memberof events.services
 * @augments support.mixins.ForwardsCalls
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Dispatcher extends forwardsCalls(hasDriver()) {

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
	 * @inheritdoc
	 */
	getForward() {
		return this.driver();
	}

}


export default Dispatcher;
