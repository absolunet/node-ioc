//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Sets up
//--------------------------------------------------------
'use strict';

const factory = require('../../../support/mixins/concerns/mixinFactory');
/**
 * Sets up mixin.
 *
 * @class
 * @name SetsUp
 * @memberof test.mixins.core
 * @hideconstructor
 */


const setsUp = factory(SuperClass => {
  /**
   * Sets up mixin.
   */
  return class SetsUpMixin extends SuperClass {
    /**
     * Setup before the first class test.
     *
     * @memberof test.mixins.core.SetsUp
     * @instance
     */
    beforeAll() {} //

    /**
     * Setup before any class test.
     *
     * @memberof test.mixins.core.SetsUp
     * @instance
     */


    beforeEach() {} //

    /**
     * Tear down after any class test.
     *
     * @memberof test.mixins.core.SetsUp
     * @instance
     */


    afterEach() {} //

    /**
     * Tear down after the last class test.
     *
     * @memberof test.mixins.core.SetsUp
     * @instance
     */


    afterAll() {//
    }

  };
});
module.exports = setsUp;