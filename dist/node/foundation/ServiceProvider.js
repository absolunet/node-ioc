"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Foundation - Service Provider
//--------------------------------------------------------

/**
 * Base service provider class.
 *
 * @memberof foundation
 * @abstract
 * @hideconstructor
 */
class ServiceProvider {
  /**
   * Get all service providers that publish content.
   *
   * @returns {Array<foundation.ServiceProvider>} The publishable service provider instances.
   */
  static publishableProviders() {
    return [...(0, _privateRegistry.default)(ServiceProvider).get('publishable').entries()].filter(([, publishable]) => {
      return publishable.length > 0;
    }).map(([provider]) => {
      return provider;
    });
  }
  /**
   * Get all tags for published content.
   *
   * @returns {Array<string>} The publishable tags.
   */


  static publishableTags() {
    return [...new Set([...(0, _privateRegistry.default)(ServiceProvider).get('publishable').values()].flat().filter(({
      tag
    }) => {
      return Boolean(tag);
    }).map(({
      tag
    }) => {
      return tag;
    }))];
  }
  /**
   * Get all publishable files and folders for a given provider.
   *
   * @param {foundation.ServiceProvider} provider - The service provider instance.
   * @returns {object<string, string>} A dictionary associating the source paths to the destination paths.
   */


  static getPublishableByProvider(provider) {
    const publishable = (0, _privateRegistry.default)(ServiceProvider).get('publishable').get(provider) || [];
    return Object.fromEntries(publishable.map(({
      from,
      to
    }) => {
      return [from, to];
    }));
  }
  /**
   * Get all publishable files and folders for a given tag.
   *
   * @param {string} tag - The tag to get pûblishables from.
   * @returns {object<string, string>} A dictionary associating the source paths to the destination paths.
   */


  static getPublishableByTag(tag) {
    return Object.fromEntries([...(0, _privateRegistry.default)(ServiceProvider).get('publishable').values()].flat().filter(({
      tag: publishableTag
    }) => {
      return tag === publishableTag;
    }).map(({
      from,
      to
    }) => {
      return [from, to];
    }));
  }
  /**
   * Get all publishable files and folders.
   *
   * @returns {object<string, string>} A dictionary associating the source paths to the destination paths.
   */


  static getAllPublishable() {
    return Object.fromEntries([...(0, _privateRegistry.default)(ServiceProvider).get('publishable').values()].flat().map(({
      from,
      to
    }) => {
      return [from, to];
    }));
  }
  /**
   * Name of the service provider.
   * Will be use for display only.
   *
   * @type {string}
   */


  get name() {
    return this.constructor.name;
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    (0, _privateRegistry.default)(ServiceProvider).get('publishable').set(this, []);
  }
  /**
   * Load configuration file from given folder path.
   *
   * @param {string} configPath - The configuration folder path.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  loadConfig(configPath) {
    if (this.app.isBound('config')) {
      this.app.make('config').loadConfigFromFolder(configPath);
    }

    return this;
  }
  /**
   * Load commands into the registrar.
   *
   * @param {Array<Function>} commands - List of all commands that must be registered.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  loadCommands(commands) {
    if (this.app.isBound('command')) {
      const commandRepository = this.app.make('command');
      commands.forEach(command => {
        commandRepository.add(command);
      });
    }

    return this;
  }
  /**
   * Load translations into the translator.
   *
   * @param {string} translationsPath - The translations folder path.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  loadTranslations(translationsPath) {
    if (this.app.isBound('file') && this.app.isBound('translator')) {
      const file = this.app.make('file');
      const translator = this.app.make('translator');
      const translations = file.loadRecursivelyInFolder(translationsPath);
      translator.addTranslations(translations);
    }

    return this;
  }
  /**
   * Add views path in the resolver.
   * If given, it will add the views path as a namespace.
   *
   * @param {string} viewsPath - The views path.
   * @param {string} [namespace] - The views namespace.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  loadViews(viewsPath, namespace) {
    if (this.app.isBound('view.resolver')) {
      const resolver = this.app.make('view.resolver');

      if (namespace) {
        resolver.namespace(namespace, viewsPath);
      } else {
        resolver.addPath(viewsPath);
      }
    }

    return this;
  }
  /**
   * Publish paths, with an optional tag.
   *
   * @param {object<string, string>} publications - Dictionary representing the published paths, the "from" as keys and the "to" as values.
   * @param {string} [tag] - The tag to give to the publications.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  publish(publications, tag) {
    (0, _privateRegistry.default)(ServiceProvider).get('publishable').get(this).push(...Object.entries(publications).map(([from, to]) => {
      return {
        from,
        to,
        tag
      };
    }));
    return this;
  }
  /**
   * Publish static assets from given absolute folder path.
   * Can store assets in a subfolder of the application's public directory if needed.
   *
   * @param {string} staticPath - The absolute assets folder path to publish.
   * @param {string} [folder=""] - The folder to store the assets when publishing.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  publishAssets(staticPath, folder = '') {
    return this.publish({
      [staticPath]: this.app.publicPath(folder)
    }, 'assets');
  }
  /**
   * Publish configuration files from given absolute folder path.
   *
   * @param {string} configPath - The absolute configuration folder path to publish.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  publishConfig(configPath) {
    return this.publish({
      [configPath]: this.app.configPath()
    }, 'config');
  }
  /**
   * Publish migration stub files from given absolute folder path.
   * Will only accept ".stub" files.
   *
   * @param {string} migrationsPath - The absolute migrations folder path to publish.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  publishMigrations(migrationsPath) {
    const required = ['file', 'helper.date', 'helper.path', 'db.resolver'];

    if (required.every(dependency => {
      return this.app.isBound(dependency);
    })) {
      this.app.make('db.resolver').bindPaths();
      const file = this.app.make('file');
      const pathHelper = this.app.make('helper.path');
      const prefix = this.app.make('helper.date')().format('YYYYMMDDHHmmss');
      const migrations = file.scandir(migrationsPath, 'file', {
        recursive: true,
        fullPath: true
      }).filter(migration => {
        return migration.endsWith('.stub');
      });
      this.publish(Object.fromEntries(migrations.map(migration => {
        const fileName = pathHelper.relative(migrationsPath, migration).replace(/\d{14}/u, prefix).replace('.stub', '.js');
        return [migration, this.app.sourcePath('migration', fileName)];
      })), 'migrations');
    }

    return this;
  }
  /**
   * Publish translations files from given absolute folder path.
   *
   * @param {string} translationsPath - The absolute translations folder path to publish.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  publishTranslations(translationsPath) {
    return this.publish({
      [translationsPath]: this.app.langPath()
    }, 'translations');
  }
  /**
   * Publish views files from given absolute folder path.
   * Can store views in a subfolder of the application's views directory if needed.
   *
   * @param {string} viewsPath - The absolute views folder path to publish.
   * @param {string} [folder=""] - The folder to store the views when publishing.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  publishViews(viewsPath, folder = '') {
    return this.publish({
      [viewsPath]: this.app.viewPath(folder)
    }, 'views');
  }
  /**
   * Load and publish configuration files.
   *
   * @param {string} configPath - The configuration folder path.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  loadAndPublishConfig(configPath) {
    this.loadConfig(configPath);
    this.publishConfig(configPath);
    return this;
  }
  /**
   * Load and publish translations from folder path.
   *
   * @param {string} translationsPath - The translations folder path.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  loadAndPublishTranslations(translationsPath) {
    this.loadTranslations(translationsPath);
    this.publishTranslations(translationsPath);
    return this;
  }
  /**
   * Load and publish views with namespace from folder path, with an optional folder destination name.
   *
   * @param {string} viewsPath - The absolute views folder path.
   * @param {string} [namespace] - The views namespace for resolver and the folder to create for publishing.
   * @returns {foundation.ServiceProvider} The current service provider instance.
   */


  loadAndPublishViews(viewsPath, namespace) {
    this.loadViews(viewsPath, namespace);
    this.publishViews(viewsPath, namespace);
    this.loadViews(this.app.viewPath(namespace), namespace);
    return this;
  }

}

(0, _privateRegistry.default)(ServiceProvider).set('publishable', new Map());
var _default = ServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;