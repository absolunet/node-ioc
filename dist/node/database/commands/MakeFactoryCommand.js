"use strict";

exports.default = void 0;

var _GeneratorCommand = _interopRequireDefault(require("../../console/GeneratorCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Factory
//--------------------------------------------------------

/**
 * Command that makes a model factory class file inside the database factories folder.
 *
 * @memberof database.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeFactoryCommand extends _GeneratorCommand.default {
  /**
   * @inheritdoc
   */
  get policies() {
    return ['db', 'env:local'];
  }
  /**
   * @inheritdoc
   */


  get name() {
    return 'make:factory';
  }
  /**
   * @inheritdoc
   */


  get files() {
    return {
      base: this.app.formatPath(__dirname, 'stubs', 'Factory.stub')
    };
  }
  /**
   * @inheritdoc
   */


  get destination() {
    return this.app.make('db.resolver').resolveSourcePath('factories');
  }
  /**
   * @inheritdoc
   */


  get patterns() {
    return {
      MODEL: this.getModelName()
    };
  }
  /**
   * @inheritdoc
   */


  async handle() {
    this.debug(`Generating ${this.parameter('class')} model factory file.`);
    await this.generate('base');
    this.info(`${this.parameter('class')} model factory file successfully generated!`);
  }
  /**
   * Get guessed model name based on the class name.
   *
   * @returns {string} The model name.
   */


  getModelName() {
    const regex = /^(?<model>[A-Z][A-Za-z]+)Factory$/u;
    const {
      model = 'model'
    } = (regex.exec(this.parameter('class')) || {}).groups || {};
    return this.app.make('helper.string').slug(model);
  }

}

var _default = MakeFactoryCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;