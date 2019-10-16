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
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('event', Dispatcher);
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.loadConfig();
	}

	/**
	 * Load configuration file.
	 */
	loadConfig() {
		if (this.app.isBound('config')) {
			this.app.make('config').loadConfigFromFolder(this.app.formatPath(__dirname, '..', 'config'));
		}
	}

}


export default EventServiceProvider;
