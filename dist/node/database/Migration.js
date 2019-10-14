//--------------------------------------------------------
//-- Node IoC - Database - Migration
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const Application = require('../foundation/Application');
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
    let instance = __(this).get('instance');

    if (!instance) {
      instance = Application.getInstance().make(this);
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

    __(this).set('instance', instance);
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

module.exports = Migration;