"use strict";

exports.default = void 0;

var _mixinFactory = _interopRequireDefault(require("../../../support/mixins/concerns/mixinFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Expects
//--------------------------------------------------------

/**
 * Expects mixin.
 *
 * @class
 * @name Expects
 * @memberof test.mixins.core
 * @hideconstructor
 */
const expects = (0, _mixinFactory.default)(SuperClass => {
  /**
   * Expects mixin.
   */
  return class ExpectsMixin extends SuperClass {
    /**
     * Make expect assertion.
     *
     * @param {...*} parameters - Call parameters.
     * @returns {Matchers} - Test engine expect matcher instance.
     * @memberof test.mixins.core.Expects
     * @instance
     */
    expect(...parameters) {
      return this.engine.expect(...parameters);
    }

  };
});
var _default = expects;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;