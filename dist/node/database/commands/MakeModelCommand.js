"use strict";

exports.default = void 0;

var _GeneratorCommand = _interopRequireDefault(require("../../console/GeneratorCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Model
//--------------------------------------------------------

/**
 * Command that makes a model class file inside the database models folder.
 *
 * @memberof database.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeModelCommand extends _GeneratorCommand.default {
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
    return 'make:model';
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [['all', 'Generate factory, migration and seeder classes for the generated model.'], ['factory', 'Generate a factory class for the generated model.'], ['migration', 'Generate a migration class for the generated model.'], ['seeder', 'Generate a seeder class for the generated model.']];
  }
  /**
   * @inheritdoc
   */


  get files() {
    return {
      base: this.app.formatPath(__dirname, 'stubs', 'Model.stub')
    };
  }
  /**
   * @inheritdoc
   */


  get destination() {
    return this.app.make('db.resolver').resolveSourcePath('models');
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const model = this.parameter('class');
    const table = this.app.make('helper.string').plural(model);
    this.debug(`Generating ${model} model file.`);
    await this.generate('base');
    this.info(`${model} model file successfully generated!`);
    const all = this.flag('all');

    if (all || this.flag('factory')) {
      await this.call(`make:factory ${model}Factory`);
    }

    if (all || this.flag('migration')) {
      await this.call(`make:migration Create${table}Table`);
    }

    if (all || this.flag('seeder')) {
      await this.call(`make:seeder ${table}TableSeeder`);
    }
  }

}

var _default = MakeModelCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;