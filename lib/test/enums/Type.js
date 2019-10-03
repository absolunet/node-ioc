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
	get UNIT() { return 'unit'; }

	/**
	 * Feature tests.
	 *
	 * @returns {string}
	 * @static
	 */
	get FEATURE() { return 'feature'; }

	/**
	 * Standards (linting, structure and meta) tests.
	 *
	 * @returns {string}
	 * @static
	 */
	get STANDARDS() { return 'standards'; }

	/**
	 * End to end tests.
	 *
	 * @returns {string}
	 * @static
	 */
	get E2E() { return 'e2e'; }

}


module.exports = TypeEnum;
