"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _Application = _interopRequireDefault(require("../foundation/Application"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Seeder
//--------------------------------------------------------

/**
 * Abstract seeder class.
 * Offers basic forwarding for seed method to singleton instance.
 *
 * @memberof database
 * @abstract
 * @hideconstructor
 */
class Seeder {
  /**
   * Class dependencies: <code>['app', 'db.model', 'db.factory']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'db.model', 'db.factory'];
  }
  /**
   * Call seed method on instance.
   *
   * @param {Knex} connection - The Knex connection instance.
   * @returns {Promise} The async process promise.
   */


  static async seed(connection) {
    await this.getInstance().setConnection(connection).seed();
  }
  /**
   * Get seeder instance as a singleton.
   *
   * @returns {database.Seeder} Seeder singleton instance.
   */


  static getInstance() {
    let instance = (0, _privateRegistry.default)(this).get('instance');

    if (!instance) {
      instance = _Application.default.getInstance().make(this);
      this.setDefaultInstance(instance);
    }

    return instance;
  }
  /**
   * Set the current Seeder instance.
   *
   * @param {database.Seeder} instance - Seeder instance.
   * @throws {TypeError} Indicates that the default instance was not a seeder instance.
   */


  static setDefaultInstance(instance) {
    if (!(instance instanceof this)) {
      throw new TypeError(`Default instance must be instance of ${this.name}.`);
    }

    (0, _privateRegistry.default)(this).set('instance', instance);
  }
  /**
   * Seed the application's database.
   *
   * @returns {Promise} The async process promise.
   * @async
   * @abstract
   */


  seed() {} //

  /**
   * Retrieve the model by name.
   *
   * @param {string} model - The model name.
   * @returns {database.Model} The model instance.
   */


  model(model) {
    return this.dbModel.get(model);
  }
  /**
   * Get a factory for a model by name.
   *
   * @param {string} model - The model name.
   * @param {object<string, *>|number} [parameters] - The parameters to put into the model manually, overwriting matching factoried values. Can also be the times if no parameter are given.
   * @param {number} [times] - The quantity of models that needed to be factoried. Minimum 1 model is required.
   * @returns {Model|Collection} Either a single Model instance or a Model Collection instance, containing N times the requested model.
   */


  factory(model, parameters, times) {
    return this.dbFactory.make(model, parameters, times);
  }
  /**
   * Run seeders.
   *
   * @param {Array<string|Seeder>} seeders - The seeders to run.
   * @returns {Promise} The async process promise.
   */


  async run(seeders) {
    const {
      app,
      connection
    } = this;
    await Promise.all(seeders.map(async seeder => {
      const instance = app.make(typeof seeder === 'string' ? app.path('seed', seeder) : seeder);
      await instance.setConnection(connection).seed();
    }));
  }
  /**
   * Set current connection instance.
   *
   * @param {Knex} connection - The current connection instance.
   * @returns {database.Seeder} Current seeder instance.
   */


  setConnection(connection) {
    (0, _privateRegistry.default)(this).set('connection', connection);
    return this;
  }
  /**
   * The current connection instance.
   *
   * @type {Knex}
   */


  get connection() {
    return (0, _privateRegistry.default)(this).get('connection');
  }

}

var _default = Seeder;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;