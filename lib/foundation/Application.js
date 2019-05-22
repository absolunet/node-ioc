//--------------------------------------------------------
//-- Node IoC - Foundation - Application
//--------------------------------------------------------
'use strict';

const EventEmitter = require('events');
const path         = require('path');
const slash        = require('slash');
const __           = require('@absolunet/private-registry');

const Container            = require('./../container/Container');
const ServiceProviderModel = require('./models/ServiceProvider');


const eventEmitter = new EventEmitter();






class Application extends Container {

	/**
	 * Register a service provider.
	 *
	 * @param {ServiceProvider} provider
	 */
	register(provider) {
		const model = new ServiceProviderModel(provider);
		__(this).get('providers').push(model);

		if (this.booted) {
			this.registerProvider(model);
			this.bootProvider(model);
		}
	}

	/**
	 * Boot the application.
	 *
	 * @returns {Container}
	 * @throws Error
	 */
	boot() {
		if (this.booted) {
			throw new Error('The container was already booted.');
		}

		eventEmitter.emit('application.booting', this);
		const providers = __(this).get('providers');

		let i;
		for (i = 0; i < providers.length; i++) {
			this.registerProvider(providers[i]);
		}
		for (i = 0; i < providers.length; i++) {
			this.bootProvider(providers[i]);
		}

		__(this).set('booted', true);
		eventEmitter.emit('application.booted', this);

		return this;
	}

	/**
	 * Register the given service provider.
	 *
	 * @param {ServiceProviderModel} model
	 */
	registerProvider(model) {
		const { provider, registered } = model;
		if (!registered) {
			const instance = this.make(provider);
			instance.app = this;
			model.instance = instance;

			if (typeof instance.register === 'function') {
				instance.register();
			}

			model.registered = true;
		}
	}

	/**
	 * Check if a given provider is registered.
	 *
	 * @param {ServiceProvider} provider
	 * @returns {boolean}
	 */
	isRegistered(provider) {
		return __(this).get('providers').some(({ provider: p }) => {
			return provider === p;
		});
	}

	/**
	 * Boot the given service provider.
	 *
	 * @param {ServiceProviderModel} model
	 */
	bootProvider(model) {
		const { instance, booted } = model;
		if (!booted) {
			if (typeof instance.boot === 'function') {
				instance.boot();
			}

			model.booted = true;
		}
	}

	/**
	 * Boot the container if it was not booted yet.
	 *
	 * @returns {Container}
	 */
	bootIfNotBooted() {
		if (!this.booted) {
			this.boot();
		}

		return this;
	}

	/**
	 * Configure application paths.
	 *
	 * @param {{string}|string|null} _paths
	 * @throws Error
	 */
	configurePaths(_paths = null) {
		const paths = typeof _paths === 'string' || _paths === null ? { base: _paths || process.cwd() } : _paths;

		if (!Object.prototype.hasOwnProperty.call(paths, 'base') && !this.isBound('path.base')) {
			throw new Error('Configured paths must define at least the base path.');
		}

		Object.keys(paths).forEach((p) => {
			this.bind(`path.${p}`, slash(paths[p]));
		});
	}

	/**
	 * Configure default paths within the container.
	 */
	configureDefaultPaths() {
		const basePath = process.cwd();

		this.configurePaths({
			base:    basePath,
			config:  slash(path.join(basePath, 'config')),
			command: slash(path.join(basePath, 'command'))
		});
	}

	/**
	 * Use base path for all registered paths.
	 *
	 * @param {string} basePath
	 */
	useBasePath(basePath) {
		const currentBasePath = this.make('path.base');
		this.getBounds().forEach((name) => {
			if ((/^path.?/u).test(name)) {
				this.bind(name, slash(this.make(name).replace(new RegExp(`^${currentBasePath}`, 'u'), basePath)));
			}
		});
	}

	/**
	 * {@inheritdoc}
	 */
	flush() {
		super.flush();
		__(this).set('providers', []);
		__(this).set('booted', false);
		this.configureDefaultPaths();
	}

	/**
	 * Register 'application.booting' callback.
	 *
	 * @param {Function} callback
	 * @returns {*}
	 */
	onBooting(callback) {
		return eventEmitter.on('application.booting', callback);
	}

	/**
	 * Register 'application.booted' callback.
	 * Will be instantly called if already booted.
	 *
	 * @param {Function} callback
	 * @returns {*}
	 */
	onBooted(callback) {
		if (this.booted) {
			return callback(this);
		}

		return eventEmitter.on('application.booted', callback);
	}

	/**
	 * Set current application version.
	 *
	 * @param {string|number} version
	 */
	setVersion(version) {
		if (version) {
			this.bind('version', version);
		}
	}

	/**
	 * Booted accessor.
	 *
	 * @returns {boolean}
	 */
	get booted() {
		return __(this).get('booted');
	}

	/**
	 * Current environment accessor.
	 *
	 * @returns {string}
	 */
	get environment() {
		const defaultEnvironment = 'production';

		if (this.isBound('config')) {
			return this.make('config').get('app.env', defaultEnvironment);
		}

		return __(this).get('env') || process.env.APP_ENV || defaultEnvironment;  // eslint-disable-line no-process-env
	}

	/**
	 * Current environment mutator.
	 *
	 * @param {string} environment
	 */
	set environment(environment) {
		__(this).set('env', environment);

		if (this.isBound('config')) {
			this.make('config').set('app.env', environment);
		}

		process.env.APP_ENV = environment;  // eslint-disable-line no-process-env
	}

}


module.exports = Application;
