//--------------------------------------------------------
//-- Node IoC - Foundation - Kernel
//--------------------------------------------------------
'use strict';

const CacheServiceProvider       = require('../cache/CacheServiceProvider');
const DatabaseServiceProvider    = require('../database/DatabaseServiceProvider');
const HttpServiceProvider        = require('../http/HttpServiceProvider');
const LogServiceProvider         = require('../log/LogServiceProvider');
const RoutingServiceProvider     = require('../routing/RoutingServiceProvider');
const SecurityServiceProvider    = require('../security/SecurityServiceProvider');
const TestServiceProvider        = require('../test/TestServiceProvider');
const TranslationServiceProvider = require('../translation/TranslationServiceProvider');
const ValidationServiceProvider  = require('../validation/ValidationServiceProvider');
const ViewServiceProvider        = require('../view/ViewServiceProvider');


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
