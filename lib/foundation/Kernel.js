//--------------------------------------------------------
//-- Node IoC - Foundation - Kernel
//--------------------------------------------------------
'use strict';

const ConfigServiceProvider   = require('./../config/providers/ConfigServiceProvider');
const FileServiceProvider     = require('./../file/providers/FileServiceProvider');
const HttpServiceProvider     = require('./../http/providers/HttpServiceProvider');
const RoutingServiceProvider  = require('./../routing/providers/RoutingServiceProvider');
const SecurityServiceProvider = require('./../security/providers/SecurityServiceProvider');
const TestServiceProvider     = require('./../test/providers/TestServiceProvider');


/**
 * Default kernel bootstrappers.
 *
 * @type {ServiceProvider[]}
 */
const coreBootstrappers = [
	FileServiceProvider,
	ConfigServiceProvider,
	HttpServiceProvider,
	RoutingServiceProvider,
	SecurityServiceProvider
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
