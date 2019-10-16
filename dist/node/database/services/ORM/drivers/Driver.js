"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _hasEngine = _interopRequireDefault(require("../../../../support/mixins/hasEngine"));

var _NotImplementedError = _interopRequireDefault(require("../../../../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Services - ORM - Drivers - Driver
//--------------------------------------------------------

/* istanbul ignore next */

/**
 * Abstract ORM driver.
 *
 * @abstract
 * @memberof database.services.ORM.drivers
 * @augments support.mixins.HasEngine
 * @hideconstructor
 */
class Driver extends (0, _hasEngine.default)() {
  /**
   * Class dependencies: <code>['app', 'connection', 'db.resolver', 'file', 'helper.string']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'connection', 'db.resolver', 'file', 'helper.string']);
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    this.setEngine(this.buildEngine(this.connection));
    const models = (0, _privateRegistry.default)(this.constructor).get('models') || {};
    (0, _privateRegistry.default)(this.constructor).set('models', models);
    Object.entries(models).forEach(([name, model]) => {
      this.model(name, model);
    });
  }
  /**
   * Build an engine with given connection.
   *
   * @param {Knex} connection - The Knex connection instance.
   * @returns {*} - The ORM engine.
   * @abstract
   */


  buildEngine(connection) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'buildEngine', 'ORM engine');
  }
  /**
   * Get ORM driver with given connection.
   *
   * @param {Knex} connection - The Knex connection instance.
   * @returns {Driver} - A newly created Driver with a given connection.
   */


  withConnection(connection) {
    return this.app.make(this.constructor, {
      connection
    });
  }
  /**
   * Get and/or set model.
   * If name and model are provided, the model is registered as name in the engine.
   *
   * @param {string} name - The model name.
   * @param {Model} [Model] - The model class.
   * @returns {Model} - Model instance.
   */


  model(name, Model) {
    if (!Model) {
      return this.getModel(name);
    }

    (0, _privateRegistry.default)(this.constructor).get('models')[name] = Model;
    const model = this.buildModel(Model);
    this.setModel(name, model);
    return model;
  }
  /**
   * Get model by name.
   *
   * @param {string} name - The model name.
   * @returns {Model|null} - The model instance, or null if it was not found.
   */


  getModel(name) {
    return this.engine.model(name);
  }
  /**
   * Set model with given name.
   *
   * @param {string} name - The model name.
   * @param {Model} model - The model instance.
   */


  setModel(name, model) {
    this.engine.model(name, model);
  }
  /**
   * Resolve model instance by name from the models path in the database resolver.
   *
   * @param {string} name - The model name.
   * @returns {Model|null} - A model instance.
   */


  resolveModel(name) {
    const fullModelPath = this.app.formatPath(this.dbResolver.resolvePath('models'), `${this.getFormattedModelClassName(name)}.js`);
    return this.file.exists(fullModelPath) ? this.buildModel(this.file.load(fullModelPath)) : null;
  }
  /**
   * Build model.
   *
   * @param {Model} model - The model instance.
   * @returns {Model} - The built model instance.
   */


  buildModel(model) {
    return model;
  }
  /**
   * Get formatted model class name.
   *
   * @param {string} name - The model name.
   * @returns {string} - The formatted model name.
   */


  getFormattedModelClassName(name) {
    return this.stringHelper.pascal(name);
  }
  /**
   * String helper instance.
   *
   * @type {StringHelper}
   */


  get stringHelper() {
    return this.helperString;
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;