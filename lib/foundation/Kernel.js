//--------------------------------------------------------
//-- Node IoC - Foundation - Kernel
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const ConfigServiceProvider = require('./../config/providers/ConfigServiceProvider');
const FileServiceProvider = require('./../file/providers/FileServiceProvider');
const HttpServiceProvider = require('./../http/providers/HttpServiceProvider');
const SecurityServiceProvider = require('./../security/providers/SecurityServiceProvider');


/**
 * Default kernel bootstrappers.
 *
 * @type {ServiceProvider[]}
 */
const coreBootstrappers = [
	FileServiceProvider,
	ConfigServiceProvider,
	HttpServiceProvider,
	SecurityServiceProvider
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
	terminate() { // eslint-disable-line no-empty-function
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
