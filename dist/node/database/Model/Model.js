"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _ModelProxy = _interopRequireDefault(require("./ModelProxy"));

var _getsMethods = _interopRequireDefault(require("../../support/mixins/getsMethods"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Model
//--------------------------------------------------------

/**
 * Database model that implements ORM features to transact with Knex with an Active Record Pattern (ARP) approach.
 *
 * @memberof database
 * @augments {support.mixins.GetsMethod}
 * @abstract
 */
class Model extends (0, _getsMethods.default)() {
  /**
   * Class dependencies: <code>['app', 'engine']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'engine'];
  }
  /**
   * Default values.
   *
   * @type {object}
   */


  get defaults() {
    return {};
  }
  /**
   * Flag that indicates if the model has timestamp columns.
   *
   * @type {boolean}
   */


  get timestamps() {
    return true;
  }
  /**
   * Primary key column name.
   *
   * @type {string}
   */


  get key() {
    return 'id';
  }
  /**
   * Primary key column type.
   *
   * @type {string}
   */


  get keyType() {
    return 'uuid';
  }
  /**
   * Table name.
   *
   * @type {string}
   */


  get table() {
    const stringHelper = this.app.make('helper.string');
    return stringHelper.snake(stringHelper.plural(this.constructor.name));
  }
  /**
   * Model constructor.
   *
   * @param {foundation.Application} app - The current application instance.
   * @param {*} engine - The engine that exposes the base model.
   * @returns {Function} An engine model factory, wrapped by a proxy.
   */


  constructor(app, engine) {
    super();
    const {
      Model: model
    } = engine;
    const self = this;

    const factory = function () {
      return self;
    };

    Object.defineProperty(factory, 'name', {
      get: () => {
        return this.constructor.name;
      }
    });
    (0, _privateRegistry.default)(this).set('app', app);
    (0, _privateRegistry.default)(this).set('super', model.prototype);
    (0, _privateRegistry.default)(this).set('model', model.extend(this.definition));
    return new Proxy(factory, new _ModelProxy.default());
  }
  /**
   * Boot the model on initialization.
   */


  boot() {} //

  /**
   * Get default values.
   *
   * @returns {object} The default values.
   */


  getDefaults() {
    return this.defaults;
  }
  /**
   * Get if the model has timestamp columns.
   *
   * @returns {boolean} Indicates that the model uses timestamps.
   */


  getHasTimestamps() {
    return this.timestamps;
  }
  /**
   * Get primary key column name.
   *
   * @returns {string} The primary column name.
   */


  getIdAttribute() {
    return this.key;
  }
  /**
   * Get primary key column type.
   *
   * @returns {string} The primary column type.
   */


  getIdType() {
    return this.keyType;
  }
  /**
   * Get a list of all processors.
   *
   * @returns {object<string, Function>} The processors list for each columns.
   */


  getProcessors() {
    const date = this.app.make('helper.date');
    return { ...Object.fromEntries(['created_at', 'updated_at'].map(timestamp => {
        return [timestamp, value => {
          return date(value).format('YYYY-MM-DD HH:mm:ss');
        }];
      })),
      ...this.processors
    };
  }
  /**
   * Get table name.
   *
   * @returns {string} The table name.
   */


  getTableName() {
    return this.table;
  }
  /**
   * Get ORM model for forward calls.
   *
   * @returns {*} The ORM model instance.
   */


  getForward() {
    return (0, _privateRegistry.default)(this).get('model');
  }
  /**
   * Get relation builders that maps relation names with their query builder.
   *
   * @returns {object<string, Function>} The mapped relations with their builder.
   */


  getRelationBuilders() {
    const self = this;
    const relationEntries = this.getMethods(this).filter(method => {
      return method.endsWith('Relation');
    }).map(method => {
      return [method.replace(/Relation$/u, ''), function (...parameters) {
        return self[method](this, ...parameters);
      }];
    });
    return Object.fromEntries(relationEntries);
  }
  /**
   * Create a new record in the database.
   *
   * @param {object} attributes - The attributes to create the model with.
   * @returns {Promise<database.Model>} The newly created model instance.
   */


  async create(attributes) {
    await this.getForward().forge(attributes).save();
    return this;
  }
  /**
   * Get model definition for the underlying model system.
   *
   * @type {object}
   */


  get definition() {
    const self = this;
    return {
      defaults: this.getDefaults(),
      hasTimestamps: this.getHasTimestamps(),
      idAttribute: this.getIdAttribute(),
      processors: this.getProcessors(),
      tableName: this.getTableName(),
      uuid: this.getIdType() === 'uuid',

      initialize() {
        (0, _privateRegistry.default)(self).get('super').initialize.call(this);
        return self.boot(this);
      },

      ...this.getRelationBuilders()
    };
  }
  /**
   * Application accessor.
   *
   * @type {foundation.Application}
   */


  get app() {
    return (0, _privateRegistry.default)(this).get('app');
  }

}

var _default = Model;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;