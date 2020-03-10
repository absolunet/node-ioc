"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _GeneratorCommand = _interopRequireDefault(require("../../console/GeneratorCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Command - Cache Table
//--------------------------------------------------------

/**
 * Command that creates the migration for "cache" database table.
 *
 * @memberof cache.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class CacheTableCommand extends _GeneratorCommand.default {
  /**
   * @inheritdoc
   */
  get policies() {
    return (super.policies || []).concat(['cache', 'db']);
  }
  /**
   * @inheritdoc
   */


  get name() {
    return 'cache:table';
  }
  /**
   * @inheritdoc
   */


  get description() {
    return this.t('commands.cache-table.description');
  }
  /**
   * @inheritdoc
   */


  get files() {
    return {
      base: this.app.formatPath(__dirname, 'stubs', 'CreateCacheTable.stub')
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
    const name = this.getClassName();
    return `${prefix}_${name}.js`;
  }
  /**
   * @inheritdoc
   */


  get patterns() {
    return {
      TABLE: this.getCacheTableName(),
      CLASS: this.getClassName()
    };
  }
  /**
   * @inheritdoc
   */


  get parameters() {
    return [];
  }
  /**
   * @inheritdoc
   */


  get options() {
    return [];
  }
  /**
   * @inheritdoc
   */


  async handle() {
    this.debug(this.t('commands.cache-table.messages.generating'));

    if (this.migrationExists()) {
      this.warning(this.t('commands.cache-table.messages.already-exists'));
      return;
    }

    await this.generate('base');
    this.info(this.t('commands.cache-table.messages.success'));
    this.info(this.t('commands.cache-table.messages.reminder'));
  }
  /**
   * Check if migration already exists in configured directory.
   *
   * @returns {boolean} The flag indicating if migration exists.
   */


  migrationExists() {
    const {
      destination: folder
    } = this;
    const end = this.fileName.split('_').pop();
    const files = this.app.make('file').scandir(folder);
    return files.some(name => {
      return name.endsWith(end);
    });
  }
  /**
   * Get the cache table name, "cache" by default.
   *
   * @returns {string} The cache table name.
   */


  getCacheTableName() {
    return this.app.make('config').get('cache.stores.database.table', 'cache');
  }
  /**
   * Get the migration class name.
   *
   * @returns {string} The migration class name.
   */


  getClassName() {
    return `Create${this.app.make('helper.string').pascal(this.getCacheTableName())}Table`;
  }

}

var _default = CacheTableCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;