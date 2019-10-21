"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _TestRepository = _interopRequireDefault(require("./repositories/TestRepository"));

var _UnitTestRepository = _interopRequireDefault(require("./repositories/UnitTestRepository"));

var _FeatureTestRepository = _interopRequireDefault(require("./repositories/FeatureTestRepository"));

var _EndToEndTestRepository = _interopRequireDefault(require("./repositories/EndToEndTestRepository"));

var _IntegrationTestRepository = _interopRequireDefault(require("./repositories/IntegrationTestRepository"));

var _TestRunner = _interopRequireDefault(require("./services/TestRunner"));

var _Tester = _interopRequireDefault(require("./services/Tester"));

var _JestEngine = _interopRequireDefault(require("./engines/JestEngine"));

var _Type = _interopRequireDefault(require("./enums/Type"));

var _MakeTestCommand = _interopRequireDefault(require("./commands/MakeTestCommand"));

var _TestCommand = _interopRequireDefault(require("./commands/TestCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Test Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The test service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="test.enums.Type.html">test.type</a></li>
 *     <li><a href="test.services.TestRunner.html">test.runner</a></li>
 *     <li><a href="test.services.Tester.html">tester</a></li>
 *     <li><a href="test.engines.JestEngine.html">test.engine.jest</a></li>
 *     <li><a href="test.repositories.TestRepository.html">test</a></li>
 *     <li><a href="test.repositories.UnitTestRepository.html">test.unit</a></li>
 *     <li><a href="test.repositories.FeatureTestRepository.html">test.feature</a></li>
 *     <li><a href="test.repositories.EndToEndTestRepository.html">test.e2e</a></li>
 * </ul>
 * It also binds these tags:
 * <ul>
 *     <li>tests
 *     		<ul>
 *     		 	<li><a href="test.repositories.UnitTestRepository.html">test.unit</a></li>
 *     		 	<li><a href="test.repositories.FeatureTestRepository.html">test.feature</a></li>
 *     		 	<li><a href="test.repositories.EndToEndTestRepository.html">test.e2e</a></li>
 *     		</ul>
 *     </li>
 * </ul>
 * It also offers these commands:
 * <ul>
 *     <li><a href="test.commands.MakeTestCommand.html">make:test</a></li>
 *     <li><a href="test.commands.TestCommand.html">test</a></li>
 * </ul>
 *
 * @memberof test
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class TestServiceProvider extends _ServiceProvider.default {
  /**
   * Register the service provider.
   */
  register() {
    this.bindTestRepository();
    this.bindUnitTestRepository();
    this.bindFeatureTestRepository();
    this.bindIntegrationTestRepository();
    this.bindEndToEndRepository();
    this.tagTestRepositories();
    this.bindTestRunner();
    this.bindTester();
    this.bindTestTypeEnum();
    this.bindJestEngine();
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.loadCommands([_MakeTestCommand.default, _TestCommand.default]);
  }
  /**
   * Bind base test repository.
   */


  bindTestRepository() {
    this.app.singleton('test', _TestRepository.default);
  }
  /**
   * Bind unit test repository.
   */


  bindUnitTestRepository() {
    this.app.singleton('test.unit', _UnitTestRepository.default);
  }
  /**
   * Bind feature test repository.
   */


  bindFeatureTestRepository() {
    this.app.singleton('test.feature', _FeatureTestRepository.default);
  }
  /**
   * Bind integration test repository.
   */


  bindIntegrationTestRepository() {
    this.app.singleton('test.integration', _IntegrationTestRepository.default);
  }
  /**
   * Bind end-to-end test repository.
   */


  bindEndToEndRepository() {
    this.app.singleton('test.endtoend', _EndToEndTestRepository.default);
  }
  /**
   * Tag all scoped test repositories.
   */


  tagTestRepositories() {
    this.app.tag(['test.unit', 'test.feature', 'test.integration', 'test.endtoend'], 'tests');
  }
  /**
   * Bind test runner service.
   */


  bindTestRunner() {
    this.app.singleton('test.runner', _TestRunner.default);
  }
  /**
   * Bind tester service.
   */


  bindTester() {
    this.app.singleton('tester', _Tester.default);
  }
  /**
   * Bind test type enum.
   */


  bindTestTypeEnum() {
    this.app.singleton('test.type', _Type.default);
  }
  /**
   * Bind Jest test engine.
   */


  bindJestEngine() {
    this.app.singleton('test.engine.jest', _JestEngine.default);
  }

}

var _default = TestServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;