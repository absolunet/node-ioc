"use strict";

exports.default = void 0;

var _mixinFactory = _interopRequireDefault(require("../../../support/mixins/concerns/mixinFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Expectations - Bindings
//--------------------------------------------------------

/**
 * Bindings mixin.
 *
 * @class
 * @name Bindings
 * @memberof test.mixins.expectations
 * @hideconstructor
 */
const bindings = (0, _mixinFactory.default)(SuperClass => {
  /**
   * Bindings mixin.
   */
  return class BindingsMixin extends SuperClass {
    /**
     * Assert that the abstract is bound to the container.
     *
     * @param {string} abstract - The abstract to check.
     * @param {boolean} [bound] - Expected result.
     * @memberof test.mixins.expectations.Bindings
     * @instance
     */
    expectBound(abstract, bound = true) {
      this.expect(this.app.isBound(abstract)).toBe(bound);
    }
    /**
     * Assert that the abstract is not bound to the container.
     *
     * @param {string} abstract - The abstract to check.
     * @memberof test.mixins.expectations.Bindings
     * @instance
     */


    expectNotBound(abstract) {
      this.expectBound(abstract, false);
    }

  };
});
var _default = bindings;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;