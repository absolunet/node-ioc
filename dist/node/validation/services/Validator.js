"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - Validation - Services - Validator
//--------------------------------------------------------

/**
 * Validator that decorates Hapi Joi module.
 *
 * @memberof validation.services
 * @hideconstructor
 */
class Validator {
  /**
   * Validator constructor.
   *
   * @returns {joi} - Hapi Joi module.
   */
  constructor() {
    return require('@hapi/joi'); // eslint-disable-line global-require
  }

}

var _default = Validator;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;