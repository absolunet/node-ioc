//--------------------------------------------------------
//-- Node IoC - Test - Service - Tester
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const hasEngine = require('../../support/mixins/hasEngine');
/**
 * Tester that runs tests through test repositories.
 *
 * @memberof test.services
 * @augments support.mixins.HasEngine
 * @hideconstructor
 */


class Tester extends hasEngine() {
  /**
   * Class dependencies.
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
    __(this).set('booted', true);

    this.app.make('kernel.console');
    this.app.bootIfNotBooted();
    this.app.singleton('tester', this);
    this.createFreshApplication();
  }
  /**
   * Boot the tester if it was not booted yet.
   */


  bootIfNotBooted() {
    if (!__(this).get('booted')) {
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
    app.make(this.app.make('kernel.console').constructor);
    app.bootIfNotBooted();
  }
  /**
   * Set test runner instance.
   * It allows the tester to keep a singleton even if the application is flushed after every test.
   *
   * @param {TestRunner} runner - Test runner instance.
   */


  setRunner(runner) {
    __(this).set('test.runner', runner);
  }
  /**
   * Set the application kernel.
   * It allows the tester to keep a singleton of the kernel constructor even if
   * the application and the cache are flushed after every test.
   *
   * @param {Kernel} kernel - The kernel instance.
   */


  setKernel(kernel) {
    __(this).set('kernel', kernel.constructor);
  }
  /**
   * Test runner accessor.
   *
   * @type {TestRunner}
   */


  get runner() {
    const name = 'test.runner';

    const runner = __(this).get(name);

    if (!runner) {
      this.setRunner(this.app.make(name));
      return __(this).get(name);
    }

    return runner;
  }
  /**
   * Current kernel accessor.
   *
   * @type {Kernel}
   */


  get kernel() {
    return __(this).get('kernel');
  }

}

module.exports = Tester;