//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Date
//--------------------------------------------------------
'use strict';

const bytes = require('bytes');

class FileHelper {

	/**
	 * Get a human readable file size.
	 *
	 * @param {number} size
	 * @param {object} [options]
	 * @param {number} [options.decimalPlaces]
	 * @param {number} [options.fixedDecimals]
	 * @param {string} [options.thousandsSeparator]
	 * @param {string} [options.unit]
	 * @param {string} [options.unitSeparator]
	 *
	 * @returns {string|null}
	 */
	formatSize(size, options) {
		return bytes.format(size, options);
	}

	/**
	 * Parse a human readable file size to bytes number value.
	 *
	 * @param {string|number} size
	 * @returns {number|null}
	 */
	parseSize(size) {
		return bytes.parse(size);
	}

}


module.exports = FileHelper;
