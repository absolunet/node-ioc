//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Date
//--------------------------------------------------------
'use strict';
/**
 * Date helper.
 *
 * @memberof support.helpers
 * @hideconstructor
 */

class DateHelper {
  /**
   * DateHelper constructor.
   *
   * @returns {moment} - The Moment class.
   */
  constructor() {
    return require('moment'); // eslint-disable-line global-require
  }

}

module.exports = DateHelper;