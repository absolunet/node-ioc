//--------------------------------------------------------
//-- Node IoC - Test - Enums - Type
//--------------------------------------------------------
'use strict';


class TypeEnum {

	/**
	 * Unit tests.
	 *
	 * @returns {string}
	 * @static
	 */
	static get UNIT() { return 'unit'; }

	/**
	 * Feature tests.
	 *
	 * @returns {string}
	 * @static
	 */
	static get FEATURE() { return 'feature'; }

	/**
	 * Standards (linting, structure and meta) tests.
	 *
	 * @returns {string}
	 * @static
	 */
	static get STANDARDS() { return 'standards'; }

	/**
	 * End to end tests.
	 *
	 * @returns {string}
	 * @static
	 */
	static get E2E() { return 'e2e'; }

}

module.exports = TypeEnum;
