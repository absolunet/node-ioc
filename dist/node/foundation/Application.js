"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var os = _interopRequireWildcard(require("os"));

var path = _interopRequireWildcard(require("path"));

var _slash = _interopRequireDefault(require("slash"));

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _ApplicationBootingError = _interopRequireDefault(require("./exceptions/ApplicationBootingError"));

var _ServiceProvider = _interopRequireDefault(require("./ServiceProvider"));

var _Container = _interopRequireDefault(require("../container/Container"));

var _ConfigServiceProvider = _interopRequireDefault(require("../config/ConfigServiceProvider"));

var _EventServiceProvider = _interopRequireDefault(require("../events/EventServiceProvider"));

var _FileServiceProvider = _interopRequireDefault(require("../file/FileServiceProvider"));

var _SupportServiceProvider = _interopRequireDefault(require("../support/SupportServiceProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

//--------------------------------------------------------
//-- Node IoC - Foundation - Application
//--------------------------------------------------------

/**
 * Base application service providers.
 *
 * @type {Array<foundation.ServiceProvider>}
 * @ignore
 */
const coreProviders = [_EventServiceProvider.default, _FileServiceProvider.default, _SupportServiceProvider.default, _ConfigServiceProvider.default];
/**
 * The main Node IoC application class that does all the bootstrapping over core providers and allow module registration.
 *
 * @memberof foundation
 * @augments container.Container
 * @hideconstructor
 */

class Application extends _Container.default {
  /**
   * Register a service provider.
   *
   * @param {foundation.ServiceProvider} provider - The service provider class to register.
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
   * @param {foundation.ServiceProvider} provider - The service provider class.
   * @returns {{instance: null, provider: *, registered: boolean, booted: boolean}} The provider model.
   */


  getProviderModel(provider) {
    return {
      provider,
      registered: false,
      booted: false,
      instance: null
    };
  }
  /**
   * Ensure that a provider can be properly registered,
   * either before or after booting, but not during providers booting phase.
   *
   * @throws {TypeError} Indicates that the provider was register during booting process.
   */


  ensureProviderCanBeRegistered() {
    if (!this.booted) {
      const providers = (0, _privateRegistry.default)(this).get('providers');
      const wereAllRegistered = providers.length > 0 && providers.every(({
        registered
      }) => {
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
   * @param {foundation.ServiceProvider} provider - The service provider class.
   * @returns {{instance: null, provider: *, registered: boolean, booted: boolean}} The provider model.
   */


  pushProvider(provider) {
    this.ensureProviderCanBeRegistered();
    const model = this.getProviderModel(provider);
    (0, _privateRegistry.default)(this).get('providers').push(model);
    return model;
  }
  /**
   * Insert service provider in the application at the beginning of the list.
   *
   * @param {foundation.ServiceProvider} provider - The service provider class.
   * @returns {{instance: null, provider: *, registered: boolean, booted: boolean}} The provider model.
   */


  unshiftProvider(provider) {
    this.ensureProviderCanBeRegistered();
    const model = this.getProviderModel(provider);
    (0, _privateRegistry.default)(this).get('providers').unshift(model);
    return model;
  }
  /**
   * Boot the application.
   *
   * @returns {foundation.Application} The current application instance.
   * @throws {TypeError} Indicates that the application was already booted.
   */


  boot() {
    if (this.booted) {
      throw new TypeError('The container was already booted.');
    }

    try {
      this.bootCoreProviders();
      const dispatcher = this.make('event');
      (0, _privateRegistry.default)(this).get('onBooting').forEach(callback => {
        dispatcher.once('application.booting', callback);
      });
      (0, _privateRegistry.default)(this).get('onBooted').forEach(callback => {
        dispatcher.once('application.booted', callback);
      });
      dispatcher.emit('application.booting', this);
      const providers = (0, _privateRegistry.default)(this).get('providers'); // We use a for loop instead of a forEach to allow providers to register other providers,
      // so they can be properly registered and booted during application boot process.

      let i;

      for (i = coreProviders.length; i < providers.length; i++) {
        this.registerProvider(providers[i]);
      }

      for (i = 0; i < providers.length; i++) {
        this.bootProvider(providers[i]);
      }

      (0, _privateRegistry.default)(this).set('booted', true);
      this.make('event').emit('application.booted', this);
    } catch (error) {
      throw new _ApplicationBootingError.default(error);
    }

    return (0, _privateRegistry.default)(this).get('proxy');
  }
  /**
   * Boot core service providers.
   */


  bootCoreProviders() {
    if (this.booted) {
      throw new TypeError('The container was already booted.');
    }

    if (!(0, _privateRegistry.default)(this).get('booted.core')) {
      [...coreProviders].reverse().map(provider => {
        return this.unshiftProvider(provider);
      }).reverse().forEach(providerModel => {
        this.registerProvider(providerModel);
      });
      (0, _privateRegistry.default)(this).set('booted.core', true);
    }
  }
  /**
   * Register the given service provider.
   *
   * @param {{instance: null, provider: *, registered: boolean, booted: boolean}} model - The provider model.
   */


  registerProvider(model) {
    const {
      provider,
      registered
    } = model;

    if (!registered) {
      const instance = this.make(provider, {
        app: (0, _privateRegistry.default)(this).get('proxy')
      });
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
   * @param {foundation.ServiceProvider} provider - The service provider class.
   * @returns {boolean} Indicates that the service provider was already registered.
   */


  isRegistered(provider) {
    return (0, _privateRegistry.default)(this).get('providers').map(({
      provider: p
    }) => {
      return p;
    }).concat(coreProviders).some(p => {
      return provider === p;
    });
  }
  /**
   * Boot the given service provider.
   *
   * @param {{instance: null, provider: *, registered: boolean, booted: boolean}} model - The provider model.
   */


  bootProvider(model) {
    const {
      instance,
      booted
    } = model;

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
   * @returns {foundation.Application} The current application instance.
   */


  bootIfNotBooted() {
    if (!this.booted) {
      this.boot();
    }

    return (0, _privateRegistry.default)(this).get('proxy');
  }
  /**
   * Configure application paths.
   *
   * @param {object<string, string>|string|null} paths - The paths to configure into the application.
   * @returns {foundation.Application} The current application instance.
   * @throws {TypeError} Indicates that the base path was never defined.
   */


  configurePaths(paths = null) {
    const pathsToConfigure = typeof paths === 'string' || paths === null ? {
      base: paths || process.cwd()
    } : paths;

    if (!Object.prototype.hasOwnProperty.call(pathsToConfigure, 'base') && !this.isBound('path.base')) {
      throw new TypeError('Configured paths must define at least the base path.');
    }

    Object.keys(pathsToConfigure).forEach(p => {
      this.bind(`path.${p}`, this.formatPath(pathsToConfigure[p]));
    });
    return (0, _privateRegistry.default)(this).get('proxy');
  }
  /**
   * Configure application namespaces.
   *
   * @param {object<string, string>} namespaces - The namespaces to configure into the application.
   * @returns {foundation.Application} The current application instance.
   */


  configureNamespaces(namespaces) {
    Object.keys(namespaces).forEach(namespace => {
      this.bind(`namespace.${namespace}`, namespaces[namespace]);
    });
    return (0, _privateRegistry.default)(this).get('proxy');
  }
  /**
   * Configure default paths within the container.
   *
   * @returns {foundation.Application} The current application instance.
   */


  configureDefaultPaths() {
    const basePath = process.cwd();
    const appNamespace = 'app';
    const sourceNamespace = 'src';
    const distributionNamespace = this.formatPath('dist', 'node');
    this.configureNamespaces({
      app: appNamespace,
      src: sourceNamespace,
      // eslint-disable-line unicorn/prevent-abbreviations
      dist: distributionNamespace
    });
    return this.configurePaths({
      'home': os.homedir(),
      'base': this.formatPath(basePath),
      'config': this.formatPath(basePath, 'config'),
      'lang': this.formatPath(basePath, 'resources', 'lang'),
      'public': this.formatPath(basePath, 'resources', 'static'),
      'resources': this.formatPath(basePath, 'resources'),
      'storage': this.formatPath(basePath, 'storage'),
      'test': this.formatPath(basePath, 'test'),
      'upload': this.formatPath(basePath, 'storage', 'uploads'),
      'view': this.formatPath(basePath, 'resources', 'views'),
      'dist': this.formatPath(basePath, distributionNamespace),
      'bootstrap': this.formatPath(basePath, distributionNamespace, 'bootstrap'),
      'database': this.formatPath(basePath, distributionNamespace, 'database'),
      'routes': this.formatPath(basePath, distributionNamespace, 'routes'),
      'app': this.formatPath(basePath, distributionNamespace, appNamespace),
      'command': this.formatPath(basePath, distributionNamespace, appNamespace, 'console', 'commands'),
      'controller': this.formatPath(basePath, distributionNamespace, appNamespace, 'http', 'controllers'),
      'policy': this.formatPath(basePath, distributionNamespace, appNamespace, 'policies'),
      'provider': this.formatPath(basePath, distributionNamespace, appNamespace, 'providers'),
      'src': this.formatPath(basePath, sourceNamespace),
      'src.bootstrap': this.formatPath(basePath, sourceNamespace, 'bootstrap'),
      'src.database': this.formatPath(basePath, sourceNamespace, 'database'),
      'src.routes': this.formatPath(basePath, sourceNamespace, 'routes'),
      'src.app': this.formatPath(basePath, sourceNamespace, appNamespace),
      'src.command': this.formatPath(basePath, sourceNamespace, appNamespace, 'console', 'commands'),
      'src.controller': this.formatPath(basePath, sourceNamespace, appNamespace, 'http', 'controllers'),
      'src.policy': this.formatPath(basePath, sourceNamespace, appNamespace, 'policies'),
      'src.provider': this.formatPath(basePath, sourceNamespace, appNamespace, 'providers')
    });
  }
  /**
   * Replace bound paths that matches the given original one by a new one.
   *
   * @example
   * this.bind('app.foo', '/base/foo/path');
   * this.bind('app.bar', '/base/bar/path');
   * this.bind('app.baz', '/some/baz/path');
   * this.replacePaths('/base/', '/new/');
   * this.make('app.foo'); // "/new/foo/path"
   * this.make('app.bar'); // "/new/bar/path"
   * this.make('app.baz'); // "/some/baz/path" (hasn't changed since not matching)
   *
   * @param {string} from - The original path to replace.
   * @param {string} to - The new path that replaces the older.
   * @param {boolean} isSource - Indicates that the replacement must affect.
   * @returns {foundation.Application} The current application instance.
   */


  replacePaths(from, to, isSource = false) {
    this.getBounds().forEach(name => {
      if (new RegExp(`^path\\.${isSource ? 'src\\.?' : '?(?!src\\.)'}`, 'u').test(name)) {
        this.bind(name, this.formatPath(this.make(name).replace(new RegExp(`^${from}`, 'u'), to)));
      }
    });
    return (0, _privateRegistry.default)(this).get('proxy');
  }
  /**
   * Use specific home path.
   *
   * @param {string} homePath - The new home path.
   * @returns {foundation.Application} The current application instance.
   */


  useHomePath(homePath) {
    return this.configurePaths({
      home: homePath
    });
  }
  /**
   * Use base path for all registered paths.
   *
   * @param {string} basePath - The new base path.
   * @returns {foundation.Application} The current application instance.
   */


  useBasePath(basePath) {
    return this.replacePaths(this.basePath(), basePath);
  }
  /**
   * Use application path for all application-related registered paths.
   *
   * @param {string} appPath - The new application relative path.
   * @returns {foundation.Application} The current application instance.
   */


  useAppPath(appPath) {
    this.configureNamespaces({
      app: appPath
    });
    this.replacePaths(this.sourcePath('app', ''), this.sourcePath(appPath), true);
    this.replacePaths(this.distributionPath('app', ''), this.distributionPath(appPath));
    return (0, _privateRegistry.default)(this).get('proxy');
  }
  /**
   * Use source path for all application-related registered paths.
   *
   * @param {string} sourcePath - The new source path.
   * @returns {foundation.Application} The current application instance.
   */


  useSourcePath(sourcePath) {
    this.configureNamespaces({
      src: sourcePath
    }); // eslint-disable-line unicorn/prevent-abbreviations

    return this.replacePaths(this.sourcePath(), this.basePath(sourcePath));
  }
  /**
   * Use source path for all application-related registered paths.
   *
   * @param {string} distributionPath - The new distribution path.
   * @returns {foundation.Application} The current application instance.
   */


  useDistributionPath(distributionPath) {
    this.configureNamespaces({
      dist: distributionPath
    });
    return this.replacePaths(this.distributionPath(), this.basePath(distributionPath));
  }
  /**
   * Format given path or path segments.
   *
   * @param {...string} segments - The segments to join when formatting.
   * @returns {string} The formatted path.
   */


  formatPath(...segments) {
    return (0, _slash.default)(path.join(...segments));
  }
  /**
   * Get full path from given base path type.
   *
   * @param {string} type - The path type to use.
   * @param {string|Array<string>} [relativePath] - The relative path or path segments from the path type.
   * @returns {string} The formatted path from the path type.
   */


  path(type, relativePath = '') {
    const basePath = this.make(`path.${type}`);
    const relativePathSegments = Array.isArray(relativePath) ? relativePath : [relativePath];
    return this.formatPath(basePath, ...relativePathSegments);
  }
  /**
   * Get full path from home path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from home path.
   * @returns {string} The formatted path from home path.
   */


  homePath(relativePath) {
    return this.path('home', relativePath);
  }
  /**
   * Get full path from app path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from app path.
   * @returns {string} The formatted path from app path.
   */


  appPath(relativePath) {
    return this.path('app', relativePath);
  }
  /**
   * Get full path from base path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from base path.
   * @returns {string} The formatted path from base path.
   */


  basePath(relativePath) {
    return this.path('base', relativePath);
  }
  /**
   * Get full path from config path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from config path.
   * @returns {string} The formatted path from config path.
   */


  configPath(relativePath) {
    return this.path('config', relativePath);
  }
  /**
   * Get full path from controller path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from controller path.
   * @returns {string} The formatted path from controller path.
   */


  controllerPath(relativePath) {
    return this.path('controller', relativePath);
  }
  /**
   * Get full path from command path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from command path.
   * @returns {string} The formatted path from command path.
   */


  commandPath(relativePath) {
    return this.path('command', relativePath);
  }
  /**
   * Get full path from database path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from database path.
   * @returns {string} The formatted path from database path.
   */


  databasePath(relativePath) {
    return this.path('database', relativePath);
  }
  /**
   * Get full path from distribution path.
   * If a type is provided first, the relative path to the source folder type will be returned.
   * Otherwise, the full path from the source folder will be returned.
   *
   * @param {string} [type] - Either the source type name, or the relative path.
   * @param {string} [relativePath] - The relative path from the given source folder type.
   * @returns {string} The formatted path from distribution path.
   */


  distributionPath(type, relativePath) {
    if (typeof relativePath === 'undefined') {
      return this.path('dist', type);
    }

    return this.path(type, relativePath);
  }
  /**
   * Get full path from lang path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from lang path.
   * @returns {string} The formatted path from lang path.
   */


  langPath(relativePath) {
    return this.path('lang', relativePath);
  }
  /**
   * Get full path from policies path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from policies path.
   * @returns {string} The formatted path from policies path.
   */


  policyPath(relativePath) {
    return this.path('policy', relativePath);
  }
  /**
   * Get full path from provider path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from provider path.
   * @returns {string} The formatted path from provider path.
   */


  providerPath(relativePath) {
    return this.path('provider', relativePath);
  }
  /**
   * Get full path from public path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from public path.
   * @returns {string} The formatted path from public path.
   */


  publicPath(relativePath) {
    return this.path('public', relativePath);
  }
  /**
   * Get full path from resources path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from resources path.
   * @returns {string} The formatted path from resources path.
   */


  resourcesPath(relativePath) {
    return this.path('resources', relativePath);
  }
  /**
   * Get full path from routes path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from resources path.
   * @returns {string} The formatted path from resources path.
   */


  routesPath(relativePath) {
    return this.path('routes', relativePath);
  }
  /**
   * Get full path from source path.
   * If a type is provided first, the relative path to the source folder type will be returned.
   * Otherwise, the full path from the source folder will be returned.
   *
   * @param {string} [type] - Either the source type name, or the relative path.
   * @param {string} [relativePath] - The relative path from the given source folder type.
   * @returns {string} The formatted path from source path.
   */


  sourcePath(type, relativePath) {
    if (typeof relativePath === 'undefined') {
      return this.path('src', type);
    }

    return this.path(`src.${type}`, relativePath);
  }
  /**
   * Get full path from storage path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from storage path.
   * @returns {string} The formatted path from storage path.
   */


  storagePath(relativePath) {
    return this.path('storage', relativePath);
  }
  /**
   * Get full path from test path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from test path.
   * @returns {string} The formatted path from test path.
   */


  testPath(relativePath) {
    return this.path('test', relativePath);
  }
  /**
   * Get full path from upload path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from upload path.
   * @returns {string} The formatted path from upload path.
   */


  uploadPath(relativePath) {
    return this.path('upload', relativePath);
  }
  /**
   * Get full path from view path.
   *
   * @param {string|Array<string>} [relativePath] - The relative path from view path.
   * @returns {string} The formatted path from view path.
   */


  viewPath(relativePath) {
    return this.path('view', relativePath);
  }
  /**
   * @inheritdoc
   */


  flush() {
    if (this.isBound('event')) {
      this.make('event').removeAllListeners();
    }

    super.flush();
    (0, _privateRegistry.default)(_ServiceProvider.default).get('publishable').clear();

    const _this = (0, _privateRegistry.default)(this);

    _this.set('providers', []);

    _this.set('booted', false);

    _this.set('booted.core', false);

    _this.set('onBooting', []);

    _this.set('onBooted', []);

    this.configureDefaultPaths();
  }
  /**
   * Register 'application.booting' callback.
   *
   * @param {Function} callback - The listener.
   * @returns {foundation.Application} The current application instance.
   */


  onBooting(callback) {
    (0, _privateRegistry.default)(this).get('onBooting').push(callback);
    return (0, _privateRegistry.default)(this).get('proxy');
  }
  /**
   * Register 'application.booted' callback.
   * Will be instantly called if already booted.
   *
   * @param {Function} callback - The listener.
   * @returns {foundation.Application} The current application instance.
   */


  onBooted(callback) {
    if (this.booted) {
      return callback(this);
    }

    (0, _privateRegistry.default)(this).get('onBooted').push(callback);
    return (0, _privateRegistry.default)(this).get('proxy');
  }
  /**
   * Set current application version.
   *
   * @param {string|number} [version] - The application version.
   * @returns {foundation.Application} The current application instance.
   */


  setVersion(version) {
    return this.bind('version', (version || this.getIocVersion()).toString());
  }
  /**
   * Current Node IoC version.
   *
   * @returns {string} The current Node IoC version.
   */


  getIocVersion() {
    return this.make(this.basePath('package.json')).version;
  }
  /**
   * Set the current environment.
   *
   * @param {string} environment - The environment.
   * @returns {foundation.Application} The current application instance.
   */


  setEnvironment(environment) {
    (0, _privateRegistry.default)(this).set('env', environment);

    if (this.isBound('config')) {
      this.make('config').set('app.env', environment);
    }

    process.env.APP_ENV = environment; // eslint-disable-line no-process-env

    return (0, _privateRegistry.default)(this).get('proxy');
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
    return (0, _privateRegistry.default)(this).get('booted');
  }
  /**
   * Current environment accessor.
   *
   * @type {string}
   */


  get environment() {
    const defaultEnvironment = process.env.APP_ENV || process.env.NODE_ENV || 'production'; // eslint-disable-line no-process-env

    if (this.isBound('config')) {
      return this.make('config').get('app.env', defaultEnvironment);
    }

    return (0, _privateRegistry.default)(this).get('env') || defaultEnvironment;
  }
  /**
   * Current environment mutator.
   *
   * @param {string} environment - The environment.
   */


  set environment(environment) {
    this.setEnvironment(environment);
  }

}

var _default = Application;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;