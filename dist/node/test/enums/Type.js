//--------------------------------------------------------
//-- Node IoC - Test - Enums - Type
//--------------------------------------------------------
'use strict';

const Enum = require('../../support/Enum');
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
   * @returns {string} - Unit test value.
   * @static
   */
  get UNIT() {
    return 'unit';
  }
  /**
   * Feature tests.
   *
   * @returns {string} - Feature test value.
   * @static
   */


  get FEATURE() {
    return 'feature';
  }
  /**
   * Standards (linting, structure and meta) tests.
   *
   * @returns {string} - Standards test value.
   * @static
   */


  get STANDARDS() {
    return 'standards';
  }
  /**
   * End to end tests.
   *
   * @returns {string} - End-To-End test value.
   * @static
   */


  get E2E() {
    return 'e2e';
  }

}

module.exports = Type;