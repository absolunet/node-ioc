//--------------------------------------------------------
//-- Node IoC - Support - Helpers - String
//--------------------------------------------------------

import StringHelperProxy from './StringHelperProxy';


/**
 * String helper.
 *
 * @memberof support.helpers
 * @hideconstructor
 */
class StringHelper {

	/**
	 * StringHelper constructor.
	 */
	constructor() {
		return new Proxy(this, new StringHelperProxy());
	}

	/**
	 * Convert to plural version of the string.
	 *
	 * @param {string} [string] - The word to pluralize.
	 * @param {number} [quantity] - How many of the word exist.
	 * @returns {string} The pluralized word.
	 */
	plural(string, quantity = 2) {
		return require('pluralize')(string, quantity); // eslint-disable-line global-require
	}

	/**
	 * Convert to singular version of the string.
	 *
	 * @param {string} string - The word to singularize.
	 * @returns {string} The singularized word.
	 */
	singular(string) {
		return this.plural(string, 1);
	}

	/**
	 * Get to-case package for forward calls.
	 *
	 * @returns {ToCase} The to-case package.
	 */
	getForward() {
		return require('to-case'); // eslint-disable-line global-require
	}

}


export default StringHelper;
