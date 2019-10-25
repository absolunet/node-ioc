"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Date
//--------------------------------------------------------

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
   * @returns {moment} The Moment class.
   */
  constructor() {
    return require('moment'); // eslint-disable-line global-require
  }

}

var _default = DateHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;