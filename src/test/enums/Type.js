//--------------------------------------------------------
//-- Node IoC - Test - Enums - Type
//--------------------------------------------------------

import Enum from '../../support/Enum';


/**
 * Test type enum.
 *
 * @memberof test.enums
 * @augments support.Enum
 * @hideconstructor
 */
class Type extends Enum {

	/**
	 * Unit tests.
	 *
	 * @type {string} - Unit test value.
	 */
	get UNIT() { return 'unit'; }

	/**
	 * Feature tests.
	 *
	 * @type {string} - Feature test value.
	 */
	get FEATURE() { return 'feature'; }

	/**
	 * End to end tests.
	 *
	 * @type {string} - End-To-End test value.
	 */
	get ENDTOEND() { return 'endtoend'; }


	/**
	 * Integration tests.
	 *
	 * @type {string}
	 */
	get INTEGRATION() { return 'integration'; }

}


export default Type;
