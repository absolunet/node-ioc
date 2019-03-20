//--------------------------------------------------------
//-- Node IoC - Foundation - Kernel
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const ConfigServiceProvider = require('./../config/providers/ConfigServiceProvider');
const FileServiceProvider = require('./../file/providers/FileServiceProvider');
const HttpServiceProvider = require('./../http/providers/HttpServiceProvider');


/**
 * Default kernel bootstrappers.
 *
 * @type {ServiceProvider[]}
 */
const coreBootstrappers = [
	FileServiceProvider,
	ConfigServiceProvider,
	HttpServiceProvider
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
	 * Kernel constructor.
	 *
	 * @param {Application} app
	 */
	constructor(app) {
		__(this).set('app', app);
		coreBootstrappers.concat(this.bootstrappers)
			.forEach((bootstrapper) => {
				app.register(bootstrapper);
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
	 * Application accessor.
	 *
	 * @returns {Application}
	 */
	get app() {
		return __(this).get('app');
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
