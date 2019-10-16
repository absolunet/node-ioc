"use strict";

exports.default = void 0;

var _GeneratorCommand = _interopRequireDefault(require("../../console/GeneratorCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Command - Make Test
//--------------------------------------------------------

/**
 * Command that makes a test class file inside the test folder.
 *
 * @memberof test.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeTestCommand extends _GeneratorCommand.default {
  /**
   * Class dependencies: <code>['helper.path', 'helper.string', 'test.type']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['helper.path', 'helper.string', 'test.type']);
  }
  /**
   * @inheritdoc
   */


  get policies() {
    return ['env:local'];
  }
  /**
   * @inheritdoc
   */


  get name() {
    return 'make:test';
  }
  /**
   * @inheritdoc
   */


  get files() {
    const types = this.testTypes.map(name => {
      const typeClassName = `${name[0].toUpperCase()}${name.slice(1)}Test`;
      return {
        [name]: this.app.formatPath(__dirname, 'stubs', `${typeClassName}.stub`)
      };
    });
    return Object.assign({}, ...types);
  }
  /**
   * @inheritdoc
   */


  get destination() {
    return this.app.testPath(this.testTypeName, this.getNamespace());
  }
  /**
   * @inheritdoc
   */


  get options() {
    return super.options.concat([['type', '', 'Indicates the test type.'], ['for', '', 'Indicates the file or the class the test is intended for.']]);
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return this.testTypes.map(type => {
      return [type, `Generate a ${type} test class.`];
    });
  }
  /**
   * @inheritdoc
   */


  get patterns() {
    return {
      TEST_CASE_PATH: this.app.formatPath(this.pathHelper.relative(this.pathHelper.dirname(this.getDestination()), this.app.testPath('TestCase')))
    };
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const type = this.testTypeName;
    this.debug(`Generating ${this.stringHelper.lower(type)} test file.`);
    await this.generate(type);
    this.info(`${this.stringHelper.pascal(type)} test ${this.parameter('class')} file successfully generated!`);
  }
  /**
   * Get the test namespace, which could be a class in the application.
   *
   * @returns {string} - The namespace.
   */


  getNamespace() {
    return this.option('for') || '';
  }
  /**
   * Get the test type.
   *
   * @type {string}
   */


  get testTypeName() {
    for (const value of this.testTypes) {
      if (this.flag(value)) {
        return value;
      }
    }

    const type = this.option('type');
    return this.testTypes.includes(type) ? type : this.defaultType;
  }
  /**
   * Get available test types.
   *
   * @type {Array<string>}
   */


  get testTypes() {
    return this.testType.values();
  }
  /**
   * Default type accessor.
   *
   * @type {string}
   */


  get defaultType() {
    return this.testType.UNIT;
  }
  /**
   * String helper.
   *
   * @type {StringHelper}
   */


  get stringHelper() {
    return this.helperString;
  }
  /**
   * Path helper.
   *
   * @type {PathHelper}
   */


  get pathHelper() {
    return this.helperPath;
  }

}

var _default = MakeTestCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;