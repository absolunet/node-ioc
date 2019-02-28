//--------------------------------------------------------
//-- Spark IoC - Foundation - Application
//--------------------------------------------------------
'use strict';

const EventEmitter = require('events');
const Container = require('./../container/Container');
const ServiceProviderModel = require('./models/ServiceProvider');
const __ = require('@absolunet/private-registry');

const eventEmitter = new EventEmitter();


class Application extends Container {

	/**
	 * Application constructor.
	 */
	constructor() {
		super();
		this.configurePaths();
	}

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
			throw new Error('The containerwas already booted.');
		}

		eventEmitter.emit('application.booting', this);
		this.configurePaths();
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
			model.instance = instance;

			if (typeof instance.register === 'function') {
				instance.register(this);
			}

			model.registered = true;
		}
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
				instance.boot(this);
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
	 * @param {{[string]:[string]}|string|null} _paths
	 * @throws Error
	 */
	configurePaths(_paths = null) {
		const paths = typeof _paths === 'string' || _paths === null ? { base:_paths || process.cwd() } : _paths;

		if (!Object.prototype.hasOwnProperty.call(paths, 'base')) {
			throw new Error('Configured paths must define at least the base path.');
		}

		Object.keys(paths).forEach((p) => {
			this.bind(`path.${p}`, paths[p]);
		});
	}

	/**
	 * {@inheritdoc}
	 */
	flush() {
		super.flush();
		__(this).set('providers', []);
		__(this).set('booted', false);
	}

	/**
	 * Register "application.booting" callback.
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
	 * Booted accessor.
	 *
	 * @returns {boolean}
	 */
	get booted() {
		return __(this).get('booted');
	}

}

module.exports = Application;
