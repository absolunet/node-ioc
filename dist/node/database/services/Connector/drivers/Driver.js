"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _NotImplementedError = _interopRequireDefault(require("../../../../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Connector - Driver
//--------------------------------------------------------

/* istanbul ignore next */

/**
 * Abstract database connector driver.
 *
 * @memberof database.services.Connector.drivers
 * @abstract
 * @hideconstructor
 */
class Driver {
  /**
   * Class dependencies: <code>['config', 'db.resolver', 'file']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['config', 'db.resolver', 'file'];
  }
  /**
   * Client to be used, such as "mysql", "sqlite3", etc.
   *
   * @type {string}
   * @abstract
   */


  get client() {
    throw new _NotImplementedError.default(this, 'client', 'string', 'accessor');
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    (0, _privateRegistry.default)(this).set('connections', {});
  }
  /**
   * Get Knex connection.
   *
   * @param {string} [name="default"] - The connection name.
   * @returns {Knex} - A Knex connection instance.
   */


  getConnection(name = 'default') {
    if (!this.hasConnection(name)) {
      throw new TypeError(`The [${name}] connection does not exists.`);
    }

    return (0, _privateRegistry.default)(this).get('connections')[name];
  }
  /**
   * Get default Knex connection.
   *
   * @returns {Knex} - A Knex connection instance.
   */


  getDefaultConnection() {
    return this.getConnection('default');
  }
  /**
   * Set Knex connection with name.
   *
   * @param {string} name - The connection name.
   * @param {Knex} connection - The Knex connection instance.
   * @returns {Driver} - The current driver instance.
   */


  setConnection(name, connection) {
    (0, _privateRegistry.default)(this).get('connections')[name] = connection;
    return this;
  }
  /**
   * Set default Knex connection instance.
   *
   * @param {Knex} connection - The Knex connection instance.
   * @returns {Driver} - The current driver instance.
   */


  setDefaultConnection(connection) {
    this.setConnection('default', connection);
    return this;
  }
  /**
   * Check if connection exists by name.
   *
   * @param {string} name - The connection name.
   * @returns {boolean} - Indicates that the connection exists.
   */


  hasConnection(name) {
    return Boolean((0, _privateRegistry.default)(this).get('connections')[name]);
  }
  /**
   * Get connection if it exists, otherwise create a new connection and returns it.
   *
   * @param {string} name - The connection name.
   * @param {object} config - The connection configuration.
   * @returns {Knex} - A Knex connection instance.
   */


  getOrCreateConnection(name, config) {
    if (this.hasConnection(name)) {
      return this.getConnection(name);
    }

    return this.createConnection(name, config);
  }
  /**
   * Create new connection and store it by name.
   *
   * @param {string} name - The connection name.
   * @param {object} config - The connection configuration.
   * @returns {Knex} - A Knex connection instance.
   */


  createConnection(name, config) {
    const connection = this.makeConnection(config);
    this.setConnection(name, connection);
    return connection;
  }
  /**
   * Make new Knex connection.
   *
   * @param {object} config - The connection configuration.
   * @returns {Knex} - A Knex instance.
   */


  makeConnection(config) {
    const connection = require('knex')(this.mapConfig(config)); // eslint-disable-line global-require


    (0, _privateRegistry.default)(connection).set('driver', this);
    return connection;
  }
  /**
   * Map configuration from the driver and given configuration into a Knex configuratioon model.
   *
   * @param {object} config - The connection configuration.
   * @returns {object} - The full Knex connection configuration.
   */


  mapConfig(config) {
    return {
      client: this.client,
      connection: config,
      migrations: {
        tableName: this.migrationsTable,
        directory: this.dbResolver.resolvePath('migrations')
      },
      seeds: {
        directory: this.dbResolver.resolvePath('seeds')
      }
    };
  }
  /**
   * Clean the database of existing data.
   * Keeps the tables.
   *
   * @see dropAll()
   * @param {Knex} [connection] - The Knex connection instance.
   * @param {object} [options] - The knex-clean options.
   * @returns {Promise<void>} - The async process promise.
   */


  async clean(connection = this.defaultConnection, options = {}) {
    const {
      migrationsTable
    } = this;
    await require('knex-cleaner').clean(connection, { // eslint-disable-line global-require
      ...options,
      ignoreTables: [...(options.ignoreTables || []), migrationsTable, `${migrationsTable}_lock`]
    });
  }
  /**
   * Drop all tables from the database.
   *
   * @param {Knex} [connection] - The Knex connection instance.
   * @param {object} [options] - The knex-clean options.
   * @returns {Promise<void>} - The async process promise.
   */


  async dropAll(connection, options = {}) {
    const tables = await require('knex-cleaner/lib/knex_tables').getTableNames(connection, options); // eslint-disable-line global-require

    await Promise.all(tables.map(tableName => {
      return connection.schema.dropTableIfExists(tableName);
    }));
  }
  /**
   * Get migration status.
   *
   * @param {Knex} connection - The Knex connection instance.
   * @returns {Promise<Array<{name: string, ran: boolean}>>} - The migration status.
   */


  async migrationStatus(connection) {
    const [migrationsPath] = connection.migrate.generator.config.migrationSource.migrationsPaths;
    const allMigrations = this.file.scandir(migrationsPath);
    const data = await connection.select().from(this.migrationsTable);
    const ranMigrations = data.map(({
      name
    }) => {
      return name;
    });
    return allMigrations.map(name => {
      const ran = ranMigrations.includes(name);
      return {
        name,
        ran
      };
    });
  }
  /**
   * The migration table name.
   *
   * @type {string}
   */


  get migrationsTable() {
    return this.config.get('database.migrations_table', 'migrations');
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;