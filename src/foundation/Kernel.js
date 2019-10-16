//--------------------------------------------------------
//-- Node IoC - Foundation - Kernel
//--------------------------------------------------------

import NotImplementedError        from './exceptions/NotImplementedError';
import CacheServiceProvider       from '../cache/CacheServiceProvider';
import DatabaseServiceProvider    from '../database/DatabaseServiceProvider';
import HttpServiceProvider        from '../http/HttpServiceProvider';
import LogServiceProvider         from '../log/LogServiceProvider';
import SecurityServiceProvider    from '../security/SecurityServiceProvider';
import TestServiceProvider        from '../test/TestServiceProvider';
import TranslationServiceProvider from '../translation/TranslationServiceProvider';
import ValidationServiceProvider  from '../validation/ValidationServiceProvider';
import ViewServiceProvider        from '../view/ViewServiceProvider';


/**
 * Default kernel bootstrappers.
 *
 * @type {Array<ServiceProvider>}
 * @ignore
 */
const coreBootstrappers = [
	CacheServiceProvider,
	LogServiceProvider,
	HttpServiceProvider,
	SecurityServiceProvider,
	DatabaseServiceProvider,
	TranslationServiceProvider,
	ValidationServiceProvider,
	ViewServiceProvider
];

/**
 * Default dev kernel bootstrappers.
 *
 * @type {Array<ServiceProvider>}
 * @ignore
 */
const coreDevelopmentBootstrappers = [
	TestServiceProvider
];


/**
 * The base kernel for a Node IoC application.
 * It bootstraps the basic service providers into the application in order to unleash the full Node IoC power.
 *
 * @memberof foundation
 * @abstract
 * @hideconstructor
 */
class Kernel {

	/**
	 * Class dependencies: <code>['app']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		coreBootstrappers.concat(this.bootstrappers)
			.forEach((bootstrapper) => {
				this.app.register(bootstrapper);
			});

		this.app.onBooted(() => {
			if (this.app.environment !== 'production') {
				coreDevelopmentBootstrappers.forEach((bootstrapper) => {
					this.app.register(bootstrapper);
				});
			}
		});
	}

	/**
	 * Handle the incoming request.
	 *
	 * @returns {Promise} - The async process promise.
	 * @async
	 * @abstract
	 */
	handle() {
		throw new NotImplementedError(this, 'handle');
	}

	/**
	 * Terminate the request handling.
	 */
	terminate() {
		//
	}

	/**
	 * Bootstrapper service providers accessor.
	 *
	 * @type {Array<ServiceProvider>}
	 */
	get bootstrappers() {
		return [];
	}

}


export default Kernel;
