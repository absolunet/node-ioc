"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mixinFactory = _interopRequireDefault(require("../../../support/mixins/concerns/mixinFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Mixins - Sets up
//--------------------------------------------------------

/**
 * Sets up mixin.
 *
 * @class
 * @name SetsUp
 * @memberof test.mixins.core
 * @hideconstructor
 */
const setsUp = (0, _mixinFactory.default)(SuperClass => {
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
    beforeAll() {//
    }
    /**
     * Setup before any class test.
     *
     * @memberof test.mixins.core.SetsUp
     * @instance
     */


    beforeEach() {//
    }
    /**
     * Tear down after any class test.
     *
     * @memberof test.mixins.core.SetsUp
     * @instance
     */


    afterEach() {//
    }
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
var _default = setsUp;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;