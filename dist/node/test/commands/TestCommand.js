"use strict";

exports.default = void 0;

var _Command = _interopRequireDefault(require("../../console/Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Command - Test
//--------------------------------------------------------

/**
 * Command that tests the application.
 *
 * @memberof test.commands
 * @augments console.Command
 * @hideconstructor
 */
class TestCommand extends _Command.default {
  /**
   * Class dependencies: <code>['test.type']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['test.type']);
  }
  /**
   * @inheritdoc
   */


  get policies() {
    return ['public'];
  }
  /**
   * @inheritdoc
   */


  get name() {
    return 'test';
  }
  /**
   * @inheritdoc
   */


  get description() {
    return 'Test the application.';
  }
  /**
   * @inheritdoc
   */


  get options() {
    return [['engine', 'jest', 'Test engine to work with.'], ['type', null, 'Type of test to run.']];
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [[this.testType.UNIT, 'Run unit tests.'], [this.testType.FEATURE, 'Run feature tests.'], [this.testType.ENDTOEND, 'Run end-to-end tests.'], [this.testType.INTEGRATION, 'Run integration tests.']];
  }
  /**
   * @inheritdoc
   */


  handle() {
    return this.runTestEngine();
  }
  /**
   * Run test engine on the requested test classes.
   *
   * @returns {Promise} - The async process promise.
   */


  runTestEngine() {
    const repositoryName = this.getRepositoryName();
    this.storeRepositoryName(repositoryName);
    this.storeEngineName(this.getEngineName());
    this.formatArgv();
    const engine = this.getEngine();
    return this.run(`${engine.path} ${this.app.testPath('bootstrap')}`);
  }
  /**
   * Resolve repository name based on input.
   *
   * @returns {string} - The repository name.
   */


  getRepositoryName() {
    let type = this.option('type');
    const types = this.testType.values();

    if (type && !['all', ...types].includes(type)) {
      throw new TypeError(`You must run a valid test type in [${types.join(',')}]`);
    }

    if (!type) {
      type = types.find(flag => {
        return this.flag(flag);
      }) || 'all';
    }

    return this.repositories[type];
  }
  /**
   * Store repository name in current process environment.
   *
   * @param {string} repositoryName - The repository name.
   * @returns {TestCommand} - The current command instance.
   */


  storeRepositoryName(repositoryName) {
    process.env.TEST_REPOSITORY = repositoryName; // eslint-disable-line no-process-env

    return this;
  }
  /**
   * Resolve engine name based on input.
   *
   * @returns {string} - The engine short name.
   */


  getEngineName() {
    return this.option('engine');
  }
  /**
   * Get engine implementation from application.
   *
   * @returns {*} - The test engine instance.
   */


  getEngine() {
    return this.app.make(`test.engine.${this.getEngineName()}`);
  }
  /**
   * Store engine name in the current process environment variables.
   *
   * @param {string} engineName - The engine short name.
   * @returns {TestCommand} - The current command instance.
   */


  storeEngineName(engineName) {
    process.env.TEST_ENGINE = engineName; // eslint-disable-line no-process-env

    return this;
  }
  /**
   * Format current arguments to fit the engine CLI argument model.
   *
   * @returns {TestCommand} - The current command instance.
   */


  formatArgv() {
    const {
      argv
    } = process;
    process.env.TEST_ARGV = JSON.stringify(argv); // eslint-disable-line no-process-env

    const nameIndex = argv.indexOf(this.name);
    process.argv = nameIndex > -1 ? argv.slice(0, nameIndex + 1) : argv;
    return this;
  }
  /**
   * List of all available repositories associated to the type option possible value.
   *
   * @type {object<string, string>}
   */


  get repositories() {
    return {
      '': 'test',
      'all': 'test',
      [this.testType.UNIT]: 'test.unit',
      [this.testType.FEATURE]: 'test.feature',
      [this.testType.ENDTOEND]: 'test.endtoend',
      [this.testType.INTEGRATION]: 'test.integration'
    };
  }

}

var _default = TestCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;