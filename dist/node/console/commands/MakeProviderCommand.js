"use strict";

exports.default = void 0;

var _GeneratorCommand = _interopRequireDefault(require("../GeneratorCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Command - Make Provider
//--------------------------------------------------------

/**
 * Command that makes a service provider class file inside the application providers folder.
 *
 * @memberof console.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeProviderCommand extends _GeneratorCommand.default {
  /**
   * Class dependencies: <code>['helper.string']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['helper.string'];
  }
  /**
   * @inheritdoc
   */


  get name() {
    return 'make:provider';
  }
  /**
   * @inheritdoc
   */


  get files() {
    return {
      base: this.app.formatPath(__dirname, 'stubs', 'ServiceProvider.stub')
    };
  }
  /**
   * @inheritdoc
   */


  get destination() {
    return this.app.sourcePath('provider', '');
  }
  /**
   * @inheritdoc
   */


  get patterns() {
    return {
      NAME: this.getProviderName()
    };
  }
  /**
   * @inheritdoc
   */


  async handle() {
    this.debug(`Generating ${this.parameter('class')} service provider file.`);
    await this.generate('base');
    this.info(`${this.parameter('class')} service provider file successfully generated!`);
  }
  /**
   * Get provider human-readable name.
   *
   * @returns {string} The provider guessed name.
   */


  getProviderName() {
    return this.stringHelper.capital(this.parameter('class').replace(/ServiceProvider$/u, ''));
  }

}

var _default = MakeProviderCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;