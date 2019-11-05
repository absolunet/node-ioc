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


  async handle() {
    this.debug(`Generating ${this.parameter('class')} service provider file.`);
    await this.generate('base');
    this.info(`${this.parameter('class')} service provider file successfully generated!`);
  }

}

var _default = MakeProviderCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;