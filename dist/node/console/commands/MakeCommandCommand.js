"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
  get name() {
    return 'make:command';
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [['generator', this.t('commands.make-command.flags.generator')], ['private', this.t('commands.make-command.flags.private')]];
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
    const type = this.flag('generator') ? 'generator' : this.flag('private') ? 'private' : 'base';
    const name = this.parameter('class');
    this.debug(this.t('commands.make-command.messages.generating', {
      type,
      name
    }));
    await this.generate(type);
    this.info(this.t('commands.make-command.messages.success', {
      type,
      name
    }));
  }

}

var _default = MakeCommandCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;