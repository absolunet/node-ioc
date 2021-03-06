"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _GeneratorCommand = _interopRequireDefault(require("../../console/GeneratorCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Migration
//--------------------------------------------------------

/**
 * Command that makes a migration class file inside the database migrations folder.
 *
 * @memberof database.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeMigrationCommand extends _GeneratorCommand.default {
  /**
   * @inheritdoc
   */
  get policies() {
    return (super.policies || []).concat(['db']);
  }
  /**
   * @inheritdoc
   */


  get name() {
    return 'make:migration';
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return super.flags.concat([['stub', this.t('commands.make-migration.flags.stub')]]);
  }
  /**
   * @inheritdoc
   */


  get files() {
    return {
      'create': this.app.formatPath(__dirname, 'stubs', 'MigrationCreate.stub'),
      'alter': this.app.formatPath(__dirname, 'stubs', 'MigrationAlter.stub'),
      'drop': this.app.formatPath(__dirname, 'stubs', 'MigrationDrop.stub'),
      'delete': this.app.formatPath(__dirname, 'stubs', 'MigrationDrop.stub')
    };
  }
  /**
   * @inheritdoc
   */


  get destination() {
    return this.app.make('db.resolver').resolveSourcePath('migrations');
  }
  /**
   * @inheritdoc
   */


  get fileName() {
    const prefix = this.app.make('helper.date')().format('YYYYMMDDHHmmss');
    return `${prefix}_${this.parameter('class')}.${this.flag('stub') ? 'stub' : 'js'}`;
  }
  /**
   * @inheritdoc
   */


  get patterns() {
    return {
      TABLE: this.getTableName()
    };
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const name = this.parameter('class');
    this.debug(this.t('commands.make-migration.messages.generating', {
      name
    }));
    await this.generate(this.getAction());
    this.info(this.t('commands.make-migration.messages.success', {
      name
    }));
  }
  /**
   * Get guessed table name based on the class name.
   *
   * @returns {string} The database table name.
   */


  getTableName() {
    const table = (/.+(?<table>[A-Z][a-zA-Z]+)Table$/u.exec(this.parameter('class')) || {
      groups: {}
    }).groups.table || 'Table';
    return this.app.make('helper.string').slug(table);
  }
  /**
   * Get guessed action based on the class name.
   *
   * @returns {string} The action that the migration is doing.
   */


  getAction() {
    const {
      action = 'Alter'
    } = (/^(?<action>[A-Z][a-z]+)/u.exec(this.parameter('class')) || {
      groups: {}
    }).groups;
    const supported = Object.keys(this.files);
    const slug = this.app.make('helper.string').slug(action);
    return supported.includes(slug) ? slug : supported[0];
  }

}

var _default = MakeMigrationCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;