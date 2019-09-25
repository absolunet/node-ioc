//--------------------------------------------------------
//-- Node IoC - Test - Enums - Type
//--------------------------------------------------------
'use strict';

const Enum = require('../../support/Enum');


class TypeEnum extends Enum {

	/**
	 * Unit tests.
	 *
	 * @returns {string}
	 * @static
	 */
	static UNIT() { return 'unit'; }

	/**
	 * Feature tests.
	 *
	 * @returns {string}
	 * @static
	 */
	static FEATURE() { return 'feature'; }

	/**
	 * Standards (linting, structure and meta) tests.
	 *
	 * @returns {string}
	 * @static
	 */
	static STANDARDS() { return 'standards'; }

	/**
	 * End to end tests.
	 *
	 * @returns {string}
	 * @static
	 */
	static E2E() { return 'e2e'; }

}

module.exports = TypeEnum;
