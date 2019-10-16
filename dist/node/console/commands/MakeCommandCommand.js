"use strict";

exports.default = void 0;

var _GeneratorCommand = _interopRequireDefault(require("../GeneratorCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Command - Make Command
//--------------------------------------------------------

/**
 * Command that makes a command class file inside the application commands folder.
 *
 * @memberof console.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeCommandCommand extends _GeneratorCommand.default {
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
    return 'make:command';
  }
  /**
   * @inheritdoc
   */


  get files() {
    return {
      'base': this.app.formatPath(__dirname, 'stubs', 'BaseCommand.stub'),
      'private': this.app.formatPath(__dirname, 'stubs', 'PrivateCommand.stub'),
      'generator': this.app.formatPath(__dirname, 'stubs', 'GeneratorCommand.stub')
    };
  }
  /**
   * @inheritdoc
   */


  get destination() {
    return this.app.sourcePath('command', '');
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const type = this.flag('generator') ? 'generator' : this.flag('private') ? 'private' : 'base'; // eslint-disable-line unicorn/no-nested-ternary

    this.debug(`Generating ${type} command file.`);
    await this.generate(type);
    this.info(`Command ${this.parameter('class')} file successfully generated!`);
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [['generator', 'Generate a generator command class.'], ['private', 'Generate a private command class.']];
  }

}

var _default = MakeCommandCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;