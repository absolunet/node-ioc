//--------------------------------------------------------
//-- Node IoC - Support - Helpers - String
//--------------------------------------------------------
'use strict';

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
	 * Convert to pascal case.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	pascal(string) {
		return to.pascal(string);
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

}

module.exports = StringHelper;
