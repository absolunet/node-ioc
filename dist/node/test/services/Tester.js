"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _hasEngine = _interopRequireDefault(require("../../support/mixins/hasEngine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Service - Tester
//--------------------------------------------------------

/**
 * Tester that runs tests through test repositories.
 *
 * @memberof test.services
 * @augments support.mixins.HasEngine
 * @hideconstructor
 */
class Tester extends (0, _hasEngine.default)() {
  /**
   * Class dependencies: <code>['app']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app']);
  }
  /**
   * Boot the tester and create a fresh application instance.
   */


  boot() {
    (0, _privateRegistry.default)(this).set('booted', true);
    this.app.make('kernel');
    this.app.bootIfNotBooted();
    this.app.singleton('tester', this);
    this.createFreshApplication();
  }
  /**
   * Boot the tester if it was not booted yet.
   */


  bootIfNotBooted() {
    if (!(0, _privateRegistry.default)(this).get('booted')) {
      this.boot();
    }
  }
  /**
   * Run tests from a given repository abstract name.
   *
   * @param {string} [repositoryName="test"] - The test repository short name.
   */


  run(repositoryName = 'test') {
    this.bootIfNotBooted();
    this.engine.beforeEach(() => {
      this.createFreshApplication();
    });
    const repository = this.app.make(repositoryName);
    this.runner.run(repository.all());
  }
  /**
   * Set current test engine.
   * Set runner test engine as well.
   *
   * @param {string|Engine} engineName - Either a test engine short name, such as "jest", or a test engine instance.
   */


  setEngine(engineName) {
    let engine = engineName;

    if (typeof engine === 'string') {
      engine = this.app.make(`test.engine.${engineName}`);
    }

    super.setEngine(engine);
    this.runner.setEngine(engine);
  }
  /**
   * Create a fresh application by flushing all existing bindings.
   */


  createFreshApplication() {
    const Application = this.app.constructor;
    const app = Application.make();
    Application.setDefaultInstance(app);
    app.setContext(this.app.getContext());
    app.setEnvironment('test');
    this.app.singleton('app', app);
    app.make(this.app.make('kernel').constructor);
    app.bootIfNotBooted();
  }
  /**
   * Set test runner instance.
   * It allows the tester to keep a singleton even if the application is flushed after every test.
   *
   * @param {test.services.TestRunner} runner - Test runner instance.
   */


  setRunner(runner) {
    (0, _privateRegistry.default)(this).set('test.runner', runner);
  }
  /**
   * Set the application kernel.
   * It allows the tester to keep a singleton of the kernel constructor even if
   * the application and the cache are flushed after every test.
   *
   * @param {foundation.Kernel} kernel - The kernel instance.
   */


  setKernel(kernel) {
    (0, _privateRegistry.default)(this).set('kernel', kernel.constructor);
  }
  /**
   * Test runner accessor.
   *
   * @type {test.services.TestRunner}
   */


  get runner() {
    const name = 'test.runner';
    const runner = (0, _privateRegistry.default)(this).get(name);

    if (!runner) {
      this.setRunner(this.app.make(name));
      return (0, _privateRegistry.default)(this).get(name);
    }

    return runner;
  }
  /**
   * Current kernel accessor.
   *
   * @type {foundation.Kernel}
   */


  get kernel() {
    return (0, _privateRegistry.default)(this).get('kernel');
  }

}

var _default = Tester;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;