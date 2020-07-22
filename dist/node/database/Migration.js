"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _Application = _interopRequireDefault(require("../foundation/Application"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Migration
//--------------------------------------------------------

/**
 * Abstract migration class.
 * Offers basic forwarding for up and down method to singleton instance.
 *
 * @memberof database
 * @abstract
 * @hideconstructor
 */
class Migration {
  /**
   * Call up method on instance.
   *
   * @param {Knex} connection - The Knex connection instance.
   * @returns {Promise} The async process promise.
   */
  static async up(connection) {
    await this.getInstance().setConnection(connection).up();
  }
  /**
   * Call down method on instance.
   *
   * @param {Knex} connection - The Knex connection instance.
   * @returns {Promise} The async process promise.
   */


  static async down(connection) {
    await this.getInstance().setConnection(connection).down();
  }
  /**
   * Get migration instance as a singleton.
   *
   * @returns {database.Migration} Migration singleton instance.
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
   * Set the current migration instance.
   *
   * @param {database.Migration} instance - Migration instance.
   * @throws {TypeError} Indicates that the default instance was not a migration instance.
   */


  static setDefaultInstance(instance) {
    if (!(instance instanceof this)) {
      throw new TypeError(`Default instance must be instance of ${this.name}.`);
    }

    (0, _privateRegistry.default)(this).set('instance', instance);
  }
  /**
   * Run the migrations.
   *
   * @returns {Promise} The async process promise.
   * @abstract
   */


  up() {} //

  /**
   * Reverse the migrations.
   *
   * @returns {Promise} The async process promise.
   * @abstract
   */


  down() {} //

  /**
   * Set current connection instance.
   *
   * @param {Knex} connection - The current connection instance.
   * @returns {database.Migration} Current migration instance.
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

var _default = Migration;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
