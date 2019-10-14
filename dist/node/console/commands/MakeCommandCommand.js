//--------------------------------------------------------
//-- Node IoC - Console - Command - Make Command
//--------------------------------------------------------
'use strict';

const GeneratorCommand = require('../GeneratorCommand');
/**
 * Command that makes a command class file inside the application commands folder.
 *
 * @memberof console.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */


class MakeCommandCommand extends GeneratorCommand {
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
      'public': this.app.formatPath(__dirname, 'stubs', 'PublicCommand.stub'),
      'generator': this.app.formatPath(__dirname, 'stubs', 'GeneratorCommand.stub')
    };
  }
  /**
   * @inheritdoc
   */


  get destination() {
    return this.app.commandPath();
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const type = this.flag('generator') ? 'generator' : this.flag('public') ? 'public' : 'base'; // eslint-disable-line unicorn/no-nested-ternary

    this.debug(`Generating ${type} command file.`);
    await this.generate(type);
    this.info(`Command ${this.parameter('class')} file successfully generated!`);
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [['generator', 'Generate a generator command class.'], ['public', 'Generate a public command class.']];
  }

}

module.exports = MakeCommandCommand;