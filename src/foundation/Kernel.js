//--------------------------------------------------------
//-- Node IoC - Foundation - Kernel
//--------------------------------------------------------
'use strict';

const NotImplementedError = require('./exceptions/NotImplementedError');

const CacheServiceProvider       = require('../cache/CacheServiceProvider');
const DatabaseServiceProvider    = require('../database/DatabaseServiceProvider');
const HttpServiceProvider        = require('../http/HttpServiceProvider');
const LogServiceProvider         = require('../log/LogServiceProvider');
const SecurityServiceProvider    = require('../security/SecurityServiceProvider');
const TestServiceProvider        = require('../test/TestServiceProvider');
const TranslationServiceProvider = require('../translation/TranslationServiceProvider');
const ValidationServiceProvider  = require('../validation/ValidationServiceProvider');
const ViewServiceProvider        = require('../view/ViewServiceProvider');


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
	 * Class dependencies.
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

	// eslint-disable-next-line jsdoc/require-returns-check
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


module.exports = Kernel;
