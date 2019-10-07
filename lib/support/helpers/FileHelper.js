//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Date
//--------------------------------------------------------
'use strict';


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
		return this.bytes.format(size, options);
	}

	/**
	 * Parse a human readable file size to bytes number value.
	 *
	 * @param {string|number} size
	 * @returns {number|null}
	 */
	parseSize(size) {
		return this.bytes.parse(size);
	}

	/**
	 * @type {bytes}
	 */
	get bytes() {
		return require('bytes'); // eslint-disable-line global-require
	}

}


module.exports = FileHelper;
