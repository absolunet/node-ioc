"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _hasEngine = _interopRequireDefault(require("../support/mixins/hasEngine"));

var _asserts = _interopRequireDefault(require("./mixins/core/asserts"));

var _expects = _interopRequireDefault(require("./mixins/core/expects"));

var _setsUp = _interopRequireDefault(require("./mixins/core/setsUp"));

var _bindings = _interopRequireDefault(require("./mixins/expectations/bindings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Test Case
//--------------------------------------------------------

/**
 * Base test case class for the test system.
 *
 * @memberof test
 * @augments test.mixins.core.SetsUp
 * @augments test.mixins.core.Expects
 * @augments test.mixins.core.Asserts
 * @augments support.mixins.HasEngine
 * @hideconstructor
 */
class TestCase extends (0, _bindings.default)((0, _setsUp.default)((0, _expects.default)((0, _asserts.default)((0, _hasEngine.default)())))) {
  /**
   * Call make method from the current application.
   *
   * @param {*} abstract - An abstract that was bound to the container, or a class, closure or instance that can be built by the container.
   * @param {object<string, *>} [parameters={}] - Additional arguments to inject into the concrete when instantiating.
   * @returns {*} The instantiated or the singleton concrete.
   */
  make(abstract, parameters = {}) {
    return this.app.make(abstract, parameters);
  }
  /**
   * Set current application.
   *
   * @param {foundation.Application} app - The application instance.
   * @returns {test.TestCase} The current test case.
   */


  setApp(app) {
    (0, _privateRegistry.default)(this).set('app', app);
    return this;
  }
  /**
   * Current application accessor.
   *
   * @type {foundation.Application}
   */


  get app() {
    return (0, _privateRegistry.default)(this).get('app');
  }

}

var _default = TestCase;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;