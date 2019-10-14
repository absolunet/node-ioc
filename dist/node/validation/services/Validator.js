//--------------------------------------------------------
//-- Node IoC - Validation - Services - Validator
//--------------------------------------------------------
'use strict';
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

module.exports = Validator;