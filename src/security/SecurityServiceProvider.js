//--------------------------------------------------------
//-- Node IoC - Security - Security Service Provider
//--------------------------------------------------------

import Gate            from './services/Gate';
import ServiceProvider from '../foundation/ServiceProvider';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The security service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="security.services.Gate.html">gate</a></li>
 * </ul>
 *
 * @memberof security
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class SecurityServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'Node IoC - Security';
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.bindGateService();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.defineBasicPolicies();
	}

	/**
	 * Bind gate service.
	 */
	bindGateService() {
		this.app.singleton('gate', Gate);
	}

	/**
	 * Define basic policy rules.
	 */
	defineBasicPolicies() {
		const gate = this.app.make('gate');

		gate.policy('public', () => {
			return true;
		});

		gate.policy('private', () => {
			return false;
		});

		gate.policy('env', (environment) => {
			return this.app.environment === environment;
		});
	}

}


export default SecurityServiceProvider;
