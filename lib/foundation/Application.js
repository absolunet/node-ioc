//--------------------------------------------------------
//-- Node IoC - Foundation - Application
//--------------------------------------------------------
'use strict';

const os    = require('os');
const path  = require('path');
const slash = require('slash');
const __    = require('@absolunet/private-registry');

const Container = require('../container/Container');

const ConfigServiceProvider  = require('../config/ConfigServiceProvider');
const EventServiceProvider   = require('../events/EventServiceProvider');
const FileServiceProvider    = require('../file/FileServiceProvider');
const SupportServiceProvider = require('../support/SupportServiceProvider');

const coreProviders = [
	EventServiceProvider,
	FileServiceProvider,
	SupportServiceProvider,
	ConfigServiceProvider
];


class Application extends Container {

	/**
	 * Register a service provider.
	 *
	 * @param {ServiceProvider} provider
	 */
	register(provider) {
		if (this.isRegistered(provider)) {
			return;
		}

		const model = this.pushProvider(provider);

		if (this.booted) {
			this.registerProvider(model);
			this.bootProvider(model);
		}
	}

	/**
	 * Get provider model object.
	 *
	 * @param {ServiceProvider} provider
	 * @returns {{instance: null, provider: *, registered: boolean, booted: boolean}}
	 */
	getProviderModel(provider) {
		return {
			provider:   provider,
			registered: false,
			booted:     false,
			instance:   null
		};
	}

	/**
	 * Ensure that a provider can be properly registered,
	 * either before or after booting, but not during providers booting phase.
	 * @throws
	 */
	ensureProviderCanBeRegistered() {
		if (!this.booted) {
			const providers = __(this).get('providers');
			const wereAllRegistered = providers.length > 0 && providers.every(({ registered }) => {
				return registered;
			});

			if (wereAllRegistered) {
				throw new TypeError('Cannot register a service provider during the booting phase. Register provider in the registering phase, either from configuration or inside a [register] method of another service provider, or after the application is booted, from the application [onBooted] method.');
			}
		}
	}

	/**
	 * Insert service provider in the application at the end of the list.
	 *
	 * @param {ServiceProvider} provider
	 * @returns {ServiceProviderModel}
	 */
	pushProvider(provider) {
		this.ensureProviderCanBeRegistered();
		const model = this.getProviderModel(provider);
		__(this).get('providers').push(model);

		return model;
	}

	/**
	 * Insert service provider in the application at the beginning of the list.
	 *
	 * @param {ServiceProvider} provider
	 * @returns {ServiceProviderModel}
	 */
	unshiftProvider(provider) {
		this.ensureProviderCanBeRegistered();
		const model = this.getProviderModel(provider);
		__(this).get('providers').unshift(model);

		return model;
	}

	/**
	 * Boot the application.
	 *
	 * @returns {Container}
	 * @throws Error
	 */
	boot() {
		if (this.booted) {
			throw new TypeError('The container was already booted.');
		}

		this.bootCoreProviders();

		const dispatcher = this.make('event');
		__(this).get('onBooting').forEach((callback) => {
			dispatcher.on('application.booting', callback);
		});
		__(this).get('onBooted').forEach((callback) => {
			dispatcher.on('application.booted', callback);
		});

		dispatcher.emit('application.booting', this);
		const providers = __(this).get('providers');


		// We use a for loop instead of a forEach to allow providers to register other providers,
		// so they can be properly registered and booted during application boot process.
		let i;
		for (i = coreProviders.length; i < providers.length; i++) {
			this.registerProvider(providers[i]);
		}
		for (i = 0; i < providers.length; i++) {
			this.bootProvider(providers[i]);
		}

		__(this).set('booted', true);
		this.make('event').emit('application.booted', this);

		return this;
	}

	/**
	 * Boot core service providers.
	 */
	bootCoreProviders() {
		if (this.booted) {
			throw new TypeError('The container was already booted.');
		}

		if (!__(this).get('booted.core')) {
			[...coreProviders]
				.reverse()
				.map((provider) => {
					return this.unshiftProvider(provider);
				})
				.reverse()
				.forEach((providerModel) => {
					this.registerProvider(providerModel);
				});
			__(this).set('booted.core', true);
		}
	}

	/**
	 * Register the given service provider.
	 *
	 * @param {ServiceProviderModel} model
	 */
	registerProvider(model) {
		const { provider, registered } = model;
		if (!registered) {
			const instance = this.make(provider, { app: this });
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
	 * @returns {Container}
	 * @throws Error
	 */
	configurePaths(_paths = null) {
		const paths = typeof _paths === 'string' || _paths === null ? { base: _paths || process.cwd() } : _paths;

		if (!Object.prototype.hasOwnProperty.call(paths, 'base') && !this.isBound('path.base')) {
			throw new TypeError('Configured paths must define at least the base path.');
		}

		Object.keys(paths).forEach((p) => {
			this.bind(`path.${p}`, this.formatPath(paths[p]));
		});
	}

	/**
	 * Configure default paths within the container.
	 *
	 * @returns {Container}
	 */
	configureDefaultPaths() {
		const basePath = process.cwd();

		this.configurePaths({
			'base':      this.formatPath(basePath),
			'config':    this.formatPath(basePath, 'config'),
			'database':  this.formatPath(basePath, 'database'),
			'lang':      this.formatPath(basePath, 'resources', 'lang'),
			'public':    this.formatPath(basePath, 'resources', 'static'),
			'resources': this.formatPath(basePath, 'resources'),
			'routes':    this.formatPath(basePath, 'routes'),
			'storage':   this.formatPath(basePath, 'storage'),
			'test':      this.formatPath(basePath, 'test'),
			'view':      this.formatPath(basePath, 'resources', 'views')
		});

		this.useAppPath('app');
		this.useHomePath(os.homedir());

		return this;
	}

	/**
	 * Use specific home path.
	 *
	 * @param homePath
	 * @returns {Container}
	 */
	useHomePath(homePath) {
		this.configurePaths({ home: homePath });

		return this;
	}

	/**
	 * Use base path for all registered paths.
	 *
	 * @param {string} basePath
	 * @returns {Container}
	 */
	useBasePath(basePath) {
		const currentBasePath = this.make('path.base');

		this.getBounds().forEach((name) => {
			if ((/^path.?/u).test(name)) {
				this.bind(name, this.formatPath(this.make(name).replace(new RegExp(`^${currentBasePath}`, 'u'), basePath)));
			}
		});

		return this;
	}

	/**
	 * Use application path for all application-related registered paths.
	 *
	 * @param {string} appPath
	 * @returns {Application}
	 */
	useAppPath(appPath) {
		const basePath    = this.make('path.base');
		const baseAppPath = this.formatPath(basePath, appPath);

		this.configurePaths({
			app:        baseAppPath,
			command:    this.formatPath(baseAppPath, 'commands'),
			controller: this.formatPath(baseAppPath, 'http', 'controllers'),
			provider:   this.formatPath(baseAppPath, 'providers')
		});

		return this;
	}

	/**
	 * Format given path.
	 *
	 * @param {...Array<string>} segments
	 * @returns {string}
	 */
	formatPath(...segments) {
		return slash(path.join(...segments));
	}

	/**
	 * Get full path from given base path type.
	 *
	 * @param {string} type
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	path(type, relativePath = '') {
		const basePath = this.make(`path.${type}`);
		const relativePathSegments = Array.isArray(relativePath) ? relativePath : [relativePath];

		return this.formatPath(basePath, ...relativePathSegments);
	}

	/**
	 * Get full path from home path.
	 *
	 * @param {string|Array<string>} relativePath
	 * @returns {string}
	 */
	homePath(relativePath) {
		return this.path('home', relativePath);
	}

	/**
	 * Get full path from base path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	basePath(relativePath) {
		return this.path('base', relativePath);
	}

	/**
	 * Get full path from config path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	configPath(relativePath) {
		return this.path('config', relativePath);
	}

	/**
	 * Get full path from controller path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	controllerPath(relativePath) {
		return this.path('controller', relativePath);
	}

	/**
	 * Get full path from command path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	commandPath(relativePath) {
		return this.path('command', relativePath);
	}

	/**
	 * Get full path from database path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	databasePath(relativePath) {
		return this.path('database', relativePath);
	}

	/**
	 * Get full path from lang path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	langPath(relativePath) {
		return this.path('lang', relativePath);
	}

	/**
	 * Get full path from provider path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	providerPath(relativePath) {
		return this.path('provider', relativePath);
	}

	/**
	 * Get full path from public path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	publicPath(relativePath) {
		return this.path('public', relativePath);
	}

	/**
	 * Get full path from resources path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	resourcesPath(relativePath) {
		return this.path('resources', relativePath);
	}

	/**
	 * Get full path from routes path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	routesPath(relativePath) {
		return this.path('routes', relativePath);
	}

	/**
	 * Get full path from storage path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	storagePath(relativePath) {
		return this.path('storage', relativePath);
	}

	/**
	 * Get full path from test path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	testPath(relativePath) {
		return this.path('test', relativePath);
	}

	/**
	 * Get full path from view path.
	 *
	 * @param {string|Array<string>} [relativePath]
	 * @returns {string}
	 */
	viewPath(relativePath) {
		return this.path('view', relativePath);
	}

	/**
	 * {@inheritdoc}
	 */
	flush() {
		if (this.isBound('event')) {
			this.make('event').removeAllListeners();
		}

		super.flush();

		__(this).set('providers', []);
		__(this).set('booted', false);
		__(this).set('booted.core', false);
		__(this).set('onBooting', []);
		__(this).set('onBooted', []);

		this.configureDefaultPaths();
	}

	/**
	 * Register 'application.booting' callback.
	 *
	 * @param {Function} callback
	 * @returns {Application}
	 */
	onBooting(callback) {
		__(this).get('onBooting').push(callback);

		return this;
	}

	/**
	 * Register 'application.booted' callback.
	 * Will be instantly called if already booted.
	 *
	 * @param {Function} callback
	 * @returns {Application}
	 */
	onBooted(callback) {
		if (this.booted) {
			return callback(this);
		}

		__(this).get('onBooted').push(callback);

		return this;
	}

	/**
	 * Set current application version.
	 *
	 * @param {string|number} [version]
	 * @returns {Container}
	 */
	setVersion(version) {
		this.bind('version', (version || this.make(this.basePath('package.json')).version).toString());

		return this;
	}

	/**
	 * Set the current environment.
	 *
	 * @param {string} environment
	 * @returns {Application}
	 */
	setEnvironment(environment) {
		__(this).set('env', environment);

		if (this.isBound('config')) {
			this.make('config').set('app.env', environment);
		}

		process.env.APP_ENV = environment;  // eslint-disable-line no-process-env

		return this;
	}

	/**
	 * Get current application version.
	 *
	 * @type {string}
	 */
	get version() {
		if (!this.isBound('version')) {
			this.setVersion();
		}

		return this.make('version');
	}

	/**
	 * Booted accessor.
	 *
	 * @type {boolean}
	 */
	get booted() {
		return __(this).get('booted');
	}

	/**
	 * Current environment accessor.
	 *
	 * @type {string}
	 */
	get environment() {
		const defaultEnvironment = process.env.APP_ENV || process.env.NODE_ENV || 'production';

		if (this.isBound('config')) {
			return this.make('config').get('app.env', defaultEnvironment);
		}

		return __(this).get('env') || defaultEnvironment;
	}

	/**
	 * Current environment mutator.
	 *
	 * @param {string} environment
	 */
	set environment(environment) {
		this.setEnvironment(environment);
	}

}


module.exports = Application;
