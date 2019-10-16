"use strict";

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
   * @param {Knex} connection - The current database connection.
   * @returns {Promise<void>} - The async process promise.
   */
  static async up(connection) {
    await this.getInstance().up(connection);
  }
  /**
   * Call down method on instance.
   *
   * @param {Knex} connection - The current database connection.
   * @returns {Promise<void>} - The async process promise.
   */


  static async down(connection) {
    await this.getInstance().down(connection);
  }
  /**
   * Get migration instance as a singleton.
   *
   * @returns {Migration} - Migration singleton instance.
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
   * @param {Migration} instance - Migration instance.
   * @throws TypeError - Indicates that the default instance was not a migration instance.
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
   * @param {Knex} connection - The current database connection.
   * @returns {Promise<void>} - The async process promise.
   * @abstract
   */


  up(connection) {} // eslint-disable-line no-unused-vars
  //

  /**
   * Reverse the migrations.
   *
   * @param {Knex} connection - The current database connection.
   * @returns {Promise<void>} - The async process promise.
   * @abstract
   */


  down(connection) {// eslint-disable-line no-unused-vars
    //
  }

}

var _default = Migration;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;