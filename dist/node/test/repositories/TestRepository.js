"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _getsMethods = _interopRequireDefault(require("../../support/mixins/getsMethods"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Repository - Abstract Test repository
//--------------------------------------------------------

/**
 * Base test repository, that scopes to the whole test folder.
 *
 * @memberof test.repositories
 * @hideconstructor
 */
class TestRepository extends (0, _getsMethods.default)() {
  /**
   * Class dependencies: <code>['app', 'file', 'helper.path', 'helper.string']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'file', 'helper.path', 'helper.string'];
  }
  /**
   * Folder scope accessor.
   * Should be a valid folder in the test directory.
   *
   * @type {string}
   */


  get scope() {
    return '';
  }
  /**
   * Get all the tests from the root namespace.
   *
   * @returns {Array<{file: string, instance: TestCase, name: string, namespace: string, tests: Array<{ method: string, description: string}>}>} All tests.
   */


  all() {
    return this.fromNamespace();
  }
  /**
   * Get all the tests from the given namespace.
   *
   * @param {string} [testNamespace] - The namespace folder.
   * @returns {Array<{file: string, instance: TestCase, name: string, namespace: string, tests: Array<{ method: string, description: string}>}>} All tests from namespace.
   */


  fromNamespace(testNamespace = '') {
    return this.getFilesFrom(testNamespace).map(file => {
      const instance = this.app.make(file);
      const namespace = this.getFormattedNamespaceFromFile(file);
      const name = this.getFormattedNameFromFile(file);
      const tests = this.getTestsFromInstance(instance);
      return {
        file,
        instance,
        name,
        namespace,
        tests
      };
    });
  }
  /**
   * Get a file list that matches the test class pattern.
   *
   * @returns {Array<string>} The files from the root folder.
   */


  getFiles() {
    return this.getFilesFrom('');
  }
  /**
   * Get a file list from the given folder that matches the test class pattern.
   *
   * @param {string} [folder=""] - The folder to search.
   * @returns {Array<string>} The files from the searched folder.
   */


  getFilesFrom(folder = '') {
    const directory = this.app.formatPath(this.basePath, this.scope, folder);
    const options = {
      recursive: true,
      fullPath: true
    };
    const regex = new RegExp(this.pattern, 'u');
    return this.file.scandir(directory, 'file', options).filter(regex.test.bind(regex));
  }
  /**
   * Get the namespace from full file path.
   *
   * @param {string} file - The test file path.
   * @returns {string} The file namespace.
   */


  getNamespaceFromFile(file) {
    return this.pathHelper.relative(this.basePath, file).replace(/\/[^/]+.js$/u, '');
  }
  /**
   * Get human-readable namespace from full file path.
   *
   * @param {string} file - The test file path.
   * @returns {string} The formatted namespace.
   */


  getFormattedNamespaceFromFile(file) {
    return this.stringHelper.title(this.getNamespaceFromFile(file).replace(/\//gu, ' > '));
  }
  /**
   * Get human-readable name from full file path.
   *
   * @param {string} file - The test file path.
   * @returns {string} The formatted name.
   */


  getFormattedNameFromFile(file) {
    const fileName = file.replace(/^.*[/\\](?<name>[A-z]+)(?:Test)?.js$/u, '$<name>');
    return this.stringHelper.title(fileName.replace(/Test$/u, ''));
  }
  /**
   * Get all the test methods and their descriptions of a given TestCase instance.
   *
   * @param {test.TestCase} instance - The test case instance.
   * @returns {Array<{method: string, description: string}>} The tests methods and descriptions from the test case instance.
   */


  getTestsFromInstance(instance) {
    return this.getTestMethods(instance).map(method => {
      const description = this.getFormattedDescription(method);
      return {
        method,
        description
      };
    });
  }
  /**
   * Get all instance methods that are actual test cases.
   *
   * @param {test.TestCase} instance - The test case instance.
   * @returns {Array<string>} List of all instance test methods.
   */


  getTestMethods(instance) {
    return this.getMethods(instance).filter(name => {
      return this.testMethodName(name);
    });
  }
  /**
   * Test method name to verify if its a test case method name.
   *
   * @param {string} methodName - The method name.
   * @returns {boolean} Indicates that the method name is a valid test method name.
   */


  testMethodName(methodName) {
    return methodName.startsWith('test');
  }
  /**
   * Get human-readable test case description.
   *
   * @param {string} methodName - The method name.
   * @returns {string} The formatted description based on method name.
   */


  getFormattedDescription(methodName) {
    return this.stringHelper.sentence(methodName.replace(/^test/u, ''));
  }
  /**
   * Set current base path.
   *
   * @param {string} basePath - Base test path.
   * @returns {test.repositories.TestRepository} Current test repository instance.
   */


  setBasePath(basePath) {
    (0, _privateRegistry.default)(TestRepository).set('basePath', basePath);
    return this;
  }
  /**
   * Set current regular expression pattern to test test case classes.
   *
   * @param {string|RegExp} pattern - Test file pattern.
   * @returns {test.repositories.TestRepository} Current test repository instance.
   */


  setPattern(pattern) {
    (0, _privateRegistry.default)(TestRepository).set('pattern', pattern);
    return this;
  }
  /**
   * Reset test repository static base path and pattern.
   */


  reset() {
    this.setBasePath(undefined);
    this.setPattern(undefined);
  }
  /**
   * String helper.
   *
   * @type {support.helpers.StringHelper}
   */


  get stringHelper() {
    return this.helperString;
  }
  /**
   * Path helper.
   *
   * @type {support.helpers.PathHelper}
   */


  get pathHelper() {
    return this.helperPath;
  }
  /**
   * Current base path accessor.
   *
   * @type {string}
   */


  get basePath() {
    return (0, _privateRegistry.default)(TestRepository).get('basePath') || this.app.testPath();
  }
  /**
   * Current pattern accessor.
   *
   * @type {string|RegExp}
   */


  get pattern() {
    return (0, _privateRegistry.default)(TestRepository).get('pattern') || '[A-Z]\\w*Test.js$';
  }

}

var _default = TestRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;