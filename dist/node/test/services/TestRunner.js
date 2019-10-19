"use strict";

exports.default = void 0;

var _hasEngine = _interopRequireDefault(require("../../support/mixins/hasEngine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Service - Test runner
//--------------------------------------------------------

/**
 * Test runner that handles all the pipeline to run given tests.
 *
 * @memberof test.services
 * @augments support.mixins.HasEngine
 * @hideconstructor
 */
class TestRunner extends (0, _hasEngine.default)() {
  /**
   * Class dependencies: <code>['app']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app']);
  }
  /**
   * Run a list of tests.
   *
   * @param {Array<{instane: test.TestCase, name: string, namespace: string, tests: Array<{method: string, description: string}>}>} testList - List of tests.
   */


  run(testList = []) {
    testList.forEach(this.runTest.bind(this));
  }
  /**
   * Run every tests of a single test case instance.
   *
   * @param {{instance: test.TestCase, name: string, namespace: string, tests: Array<{method: string, description: string}>}} test - Single test.
   */


  runTest({
    instance,
    name,
    namespace,
    tests
  }) {
    if (typeof this.engine === 'undefined') {
      throw new TypeError('Test engine is not defined');
    }

    instance.setApp(this.app).setEngine(this.engine);
    this.describe(namespace, () => {
      this.describe(name, () => {
        this.beforeAll((...parameters) => {
          return instance.beforeAll(...parameters);
        });
        this.beforeEach((...parameters) => {
          return instance.beforeEach(...parameters);
        });
        tests.forEach(({
          method,
          description
        }) => {
          this.test(description, (...parameters) => {
            return instance[method](...parameters);
          });
        });
        this.afterEach((...parameters) => {
          return instance.afterEach(...parameters);
        });
        this.afterAll((...parameters) => {
          return instance.afterAll(...parameters);
        });
      });
    });
  }
  /**
   * Describe the inner tests.
   *
   * @param {...*} parameters - Call parameters.
   * @returns {*} The call returned value.
   */


  describe(...parameters) {
    return this.engine.describe(...parameters);
  }
  /**
   * Setup before the first inner test.
   *
   * @param {...*} parameters - Call parameters.
   * @returns {*} The call returned value.
   */


  beforeAll(...parameters) {
    return this.engine.beforeAll(...parameters);
  }
  /**
   * Setup before any inner test.
   *
   * @param {...*} parameters - Call parameters.
   * @returns {*} The call returned value.
   */


  beforeEach(...parameters) {
    return this.engine.beforeEach(...parameters);
  }
  /**
   * Tear down after the last inner test.
   *
   * @param {...*} parameters - Call parameters.
   * @returns {*} The call returned value.
   */


  afterAll(...parameters) {
    return this.engine.afterAll(...parameters);
  }
  /**
   * Tear down after any inner test.
   *
   * @param {...*} parameters - Call parameters.
   * @returns {*} The call returned value.
   */


  afterEach(...parameters) {
    return this.engine.afterEach(...parameters);
  }
  /**
   * Test a given case.
   *
   * @param {...*} parameters - Call parameters.
   * @returns {*} The call returned value.
   */


  test(...parameters) {
    return this.engine.test(...parameters);
  }

}

var _default = TestRunner;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;