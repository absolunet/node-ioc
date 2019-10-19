"use strict";

exports.default = void 0;

var _NotImplementedError = _interopRequireDefault(require("../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Factory
//--------------------------------------------------------

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
    throw new _NotImplementedError.default(this, 'model', 'string', 'accessor');
  }
  /**
   * Factory model attributes.
   *
   * @param {faker} faker - A Faker instance.
   * @returns {object} The factoried model data.
   * @abstract
   */


  make(faker) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'make', 'attributes object');
  }

}

var _default = Factory;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;