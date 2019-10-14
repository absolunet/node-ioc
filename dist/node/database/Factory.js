//--------------------------------------------------------
//-- Node IoC - Database - Factory
//--------------------------------------------------------
'use strict';

const NotImplementedError = require('../foundation/exceptions/NotImplementedError');
/**
 * Model factory base class.
 *
 * @memberof database
 * @abstract
 * @hideconstructor
 */


class Factory {
  /**
   * Name of the associated model.
   *
   * @type {string}
   * @abstract
   */
  get model() {
    throw new NotImplementedError(this, 'model', 'string', 'accessor');
  }
  /**
   * Factory model attributes.
   *
   * @param {faker} faker - A Faker instance.
   * @returns {object} - The factoried model data.
   * @abstract
   */


  make(faker) {
    // eslint-disable-line no-unused-vars
    throw new NotImplementedError(this, 'make', 'attributes object');
  }

}

module.exports = Factory;