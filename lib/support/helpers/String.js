//--------------------------------------------------------
//-- Node IoC - Support - Helpers - String
//--------------------------------------------------------
'use strict';

const pluralize = require('pluralize');
const to = require('to-case');


class StringHelper {

	/**
	 * Convert to camel case.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	camel(string) {
		return to.camel(string);
	}

	/**
	 * Convert to constant case.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	constant(string) {
		return to.constant(string);
	}

	/**
	 * Convert to dot case.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	dot(string) {
		return to.dot(string);
	}

	/**
	 * Convert to lowercase space-separated string.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	lower(string) {
		return to.lower(string);
	}

	/**
	 * Convert to pascal case.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	pascal(string) {
		return to.pascal(string);
	}

	/**
	 * Convert to plural version of the string.
	 *
	 * @param {string} [string]
	 * @param {number} [quantity]
	 */
	plural(string, quantity = 2) {
		return pluralize(string, quantity);
	}

	/**
	 * Convert to sentence case.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	sentence(string) {
		return to.sentence(string);
	}

	/**
	 * Convert to singular version of the string.
	 *
	 * @param string
	 * @returns {string}
	 */
	singular(string) {
		return this.plural(string, 1);
	}

	/**
	 * Convert to slug case.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	slug(string) {
		return to.slug(string);
	}

	/**
	 * Convert to snake case.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	snake(string) {
		return to.snake(string);
	}

	/**
	 * Convert to title case.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	title(string) {
		return to.title(string);
	}

	/**
	 * Convert to uppercase space-separated string.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	upper(string) {
		return to.upper(string);
	}

}

module.exports = StringHelper;
