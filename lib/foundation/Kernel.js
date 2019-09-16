//--------------------------------------------------------
//-- Node IoC - Foundation - Kernel
//--------------------------------------------------------
'use strict';

const CacheServiceProvider       = require('../cache/providers/CacheServiceProvider');
const DatabaseServiceProvider    = require('../database/providers/DatabaseServiceProvider');
const HttpServiceProvider        = require('../http/providers/HttpServiceProvider');
const LogServiceProvider         = require('../log/providers/LogServiceProvider');
const RoutingServiceProvider     = require('../routing/providers/RoutingServiceProvider');
const SecurityServiceProvider    = require('../security/providers/SecurityServiceProvider');
const TestServiceProvider        = require('../test/providers/TestServiceProvider');
const TranslationServiceProvider = require('../translation/providers/TranslationServiceProvider');
const ValidationServiceProvider  = require('../validation/providers/ValidationServiceProvider');
const ViewServiceProvider        = require('../view/providers/ViewServiceProvider');


/**
 * Default kernel bootstrappers.
 *
 * @type {ServiceProvider[]}
 */
const coreBootstrappers = [
	CacheServiceProvider,
	LogServiceProvider,
	HttpServiceProvider,
	RoutingServiceProvider,
	SecurityServiceProvider,
	DatabaseServiceProvider,
	TranslationServiceProvider,
	ValidationServiceProvider,
	ViewServiceProvider
];

/**
 * Default dev kernel bootstrappers.
 *
 * @type {ServiceProvider[]}
 */
const coreDevelopmentBootstrappers = [
	TestServiceProvider
];






class Kernel {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * Kernel initializer.
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
	 * @returns {Promise<void>}
	 * @throws Error
	 */
	handle() {
		throw new Error('Method [handle] must be implemented');
	}

	/**
	 * Terminate the request handling.
	 *
	 * @returns {void}
	 */
	terminate() {
		//
	}

	/**
	 * Get bootstrapper service providers.
	 *
	 * @returns {ServiceProvider[]}
	 */
	get bootstrappers() {
		return [];
	}

}


module.exports = Kernel;
