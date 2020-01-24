"use strict";

exports.default = void 0;

var _GeneratorCommand = _interopRequireDefault(require("../../console/GeneratorCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Command - Make Mixin
//--------------------------------------------------------

/**
 * Command that makes a mixin scaffold inside application bootstrapper.
 *
 * @memberof support.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeMixinCommand extends _GeneratorCommand.default {
  /**
   * @inheritdoc
   */
  get name() {
    return 'make:mixin';
  }
  /**
   * @inheritdoc
   */


  get destination() {
    return this.app.sourcePath('bootstrap', 'mixins');
  }
  /**
   * @inheritdoc
   */


  get files() {
    return {
      base: this.app.formatPath(__dirname, 'stubs', 'mixin.stub')
    };
  }
  /**
   * @inheritdoc
   */


  get parameters() {
    return [['name', true, null, this.t('commands.make-mixin.parameters.name')]];
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [['noBootstrap', this.t('commands.make-mixin.flags.no-bootstrap')]];
  }
  /**
   * @inheritdoc
   */


  get fileName() {
    return `${this.parameter('name')}.js`;
  }
  /**
   * @inheritdoc
   */


  get patterns() {
    return {
      CLASS: this.getClassName(),
      NAME: this.getMixinName()
    };
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const name = this.parameter('name');
    this.debug(this.t('commands.make-mixin.messages.generating', {
      name
    }));
    await this.generate('base');
    this.info(this.t('commands.make-mixin.messages.success', {
      name
    }));
    await this.bootstrapMixin();
  }
  /**
   * Bootstrap the mixin in the application.
   *
   * @returns {Promise} The async process promise.
   */


  async bootstrapMixin() {
    if (!this.flag('noBootstrap')) {
      const fileDriver = this.app.make('file').driver();
      const mixinBootstrapperPath = this.app.sourcePath('bootstrap', ['mixins', 'index.js']);
      const importStatement = `import './${this.parameter('name')}';`;
      const mixinBootstrapper = await fileDriver.loadAsync(mixinBootstrapperPath);

      if (!mixinBootstrapper.includes(importStatement)) {
        this.debug(this.t('commands.make-mixin.messages.bootstrapping'));
        await fileDriver.writeAsync(mixinBootstrapperPath, `${mixinBootstrapper}${importStatement}\n`);
        this.info(this.t('commands.make-mixin.messages.bootstrapped'));
      }
    } else {
      this.info(this.t('commands.make-mixin.messages.manual-bootstrap'));
    }
  }
  /**
   * Get class name from mixin name.
   *
   * @returns {string} The mixin class name.
   */


  getClassName() {
    return this.app.make('helper.string').pascal(`${this.getMixinName()}Mixin`);
  }
  /**
   * Get mixin name.
   *
   * @returns {string} The mixin name.
   */


  getMixinName() {
    return this.parameter('name').split('/').pop();
  }

}

var _default = MakeMixinCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;