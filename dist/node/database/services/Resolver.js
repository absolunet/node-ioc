//--------------------------------------------------------
//-- Node IoC - Database - Services - Resolver
//--------------------------------------------------------
'use strict';
/**
 * Database path resolver that links the database path configuration through the container and allows resolving without the container.
 *
 * @memberof database.services
 * @hideconstructor
 */

class Resolver {
  /**
   * Class dependencies.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'config', 'config.grammar', 'helper.string'];
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    this.bindPaths();
  }
  /**
   * Get configured paths for the database files.
   *
   * @returns {{factories: string, models: string, migrations: string, seeds: string}} - The paths for every database folders.
   */


  resolvePaths() {
    const configuredPaths = this.config.get('database.paths', {});
    const pathKeys = [...new Set([...Object.keys(configuredPaths), 'factories', 'migrations', 'models', 'seeds'])].sort();
    return pathKeys.reduce((paths, type) => {
      paths[type] = this.configGrammar.format(paths[type] || `@/database/${type}`);
      return paths;
    }, configuredPaths);
  }
  /**
   * Get specific database files path.
   *
   * @param {string} name - The database folder name.
   * @returns {string} - The requested database folder path.
   */


  resolvePath(name) {
    return this.resolvePaths()[name];
  }
  /**
   * Bind paths into application.
   * This will bind "path.factory", "path.model", "path.migration" and "path.seed" and other
   * configured path within "database.paths" configuration.
   * The path keys will be converted to their singular form.
   */


  bindPaths() {
    Object.entries(this.resolvePaths()).forEach(([key, value]) => {
      const name = this.stringHelper.singular(key);
      this.app.configurePaths({
        [name]: value
      });
    });
  }
  /**
   * String helper.
   *
   * @type {StringHelper}
   */


  get stringHelper() {
    return this.helperString;
  }

}

module.exports = Resolver;