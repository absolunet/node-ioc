"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Date
//--------------------------------------------------------

/**
 * File helper.
 *
 * @memberof support.helpers
 * @hideconstructor
 */
class FileHelper {
  /**
   * Get a human readable file size.
   *
   * @param {number} size - The size to format.
   * @param {object} [options] - The options.
   * @param {number} [options.decimalPlaces] - Maximum number of decimal places to include in output.
   * @param {number} [options.fixedDecimals] - Whether to always display the maximum number of decimal places.
   * @param {string} [options.thousandsSeparator] - The thousand separator, such as " ", "," and ".".
   * @param {string} [options.unit] - The unit in which the result will be returned (B/KB/MB/GB/TB).
   * @param {string} [options.unitSeparator] - Separator to use between number and unit.
   *
   * @returns {string|null} The formatted value.
   */
  formatSize(size, options) {
    return this.bytes.format(size, options);
  }
  /**
   * Parse a human readable file size to bytes number value.
   *
   * @param {string|number} size - The size to parse.
   * @returns {number|null} The parsed size.
   */


  parseSize(size) {
    return this.bytes.parse(size);
  }
  /**
   * The bytes module.
   *
   * @type {bytes}
   */


  get bytes() {
    return require('bytes'); // eslint-disable-line global-require
  }

}

var _default = FileHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;