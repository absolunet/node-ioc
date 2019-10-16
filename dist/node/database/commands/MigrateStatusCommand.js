"use strict";

exports.default = void 0;

var _Command = _interopRequireDefault(require("../../console/Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Command - Migrate Fresh
//--------------------------------------------------------

/**
 * Command that shows the status of each migration.
 *
 * @memberof database.commands
 * @augments console.Command
 * @hideconstructor
 */
class MigrateStatusCommand extends _Command.default {
  /**
   * Class dependencies: <code>['config', 'db']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['config', 'db']);
  }
  /**
   * @inheritdoc
   */


  get policies() {
    return ['db'];
  }
  /**
   * @inheritdoc
   */


  get name() {
    return `${this.prefix}:migrate:status`;
  }
  /**
   * @inheritdoc
   */


  get description() {
    return 'Show the status of each migration.';
  }
  /**
   * Command prefix.
   *
   * @type {string}
   */


  get prefix() {
    return this.config.get('database.command_namespace', 'db');
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const connection = this.db.getConnection();
    const status = await this.db.getDriverForConnection(connection).migrationStatus(connection);
    this.table(['Ran?', 'Migration'], status.map(({
      ran,
      name
    }) => {
      return [ran ? 'Y' : 'N', name];
    }));
  }

}

var _default = MigrateStatusCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;