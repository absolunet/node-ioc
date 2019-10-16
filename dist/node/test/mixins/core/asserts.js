"use strict";

exports.default = void 0;

var _mixinFactory = _interopRequireDefault(require("../../../support/mixins/concerns/mixinFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Asserts
//--------------------------------------------------------

/**
 * Asserts mixin.
 *
 * @class
 * @name Asserts
 * @memberof test.mixins.core
 * @hideconstructor
 */
const asserts = (0, _mixinFactory.default)(SuperClass => {
  /**
   * Asserts mixin.
   */
  return class AssertsMixin extends SuperClass {
    /**
     * Make assertion.
     *
     * @returns {Assert|null} - The assert object.
     * @memberof test.mixins.core.Asserts
     * @instance
     */
    assert() {
      return this.engine.assert;
    }

  };
});
var _default = asserts;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;