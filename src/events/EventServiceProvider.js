//--------------------------------------------------------
//-- Node IoC - Events - Event Service Provider
//--------------------------------------------------------

import ServiceProvider from '../foundation/ServiceProvider';
import Dispatcher      from './services/Dispatcher';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The event service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="events.services.Dispatcher.html">event</a></li>
 * </ul>
 * It also uses configuration under "event" namespace.
 *
 * @memberof events
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class EventServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'Node IoC - Events';
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.loadAndPublishConfig(this.app.formatPath(__dirname, 'config'));
		this.bindEventDispatcher();
	}

	/**
	 * Bind event dispatcher.
	 */
	bindEventDispatcher() {
		this.app.singleton('event', Dispatcher);
	}

}


export default EventServiceProvider;
