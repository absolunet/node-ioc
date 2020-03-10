"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Command = _interopRequireDefault(require("../../console/Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Command - Migrate
//--------------------------------------------------------

/**
 * Command that runs the database migrations.
 *
 * @memberof database.commands
 * @augments console.Command
 * @hideconstructor
 */
class MigrateCommand extends _Command.default {
  /**
   * Class dependencies: <code>['config', 'db', 'terminal.interceptor']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['config', 'db', 'terminal.interceptor']);
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
    return `${this.prefix}:migrate`;
  }
  /**
   * @inheritdoc
   */


  get description() {
    return this.t('commands.db-migrate.description');
  }
  /**
   * Command prefix.
   *
   * @type {string}
   */


  get prefix() {
    return this.config.get('database.command_namespace');
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [['seed', this.t('commands.db-migrate.flags.seed')]];
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const connection = await this.db.getConnection();
    this.info(this.t('commands.db-migrate.messages.migrating'));
    const {
      migrations,
      output
    } = await this.migrate(connection);
    output.forEach(string => {
      this.warning(string);
    });

    if (migrations.length === 0) {
      this.info(this.t('commands.db-migrate.messages.up-to-date'));
    } else {
      migrations.forEach(migration => {
        this.success(this.t('commands.db-migrate.messages.migrated', {
          migration
        }));
      });
    }

    if (this.flag('seed')) {
      await this.call(`${this.prefix}:seed`);
    }
  }
  /**
   * Run database migrations.
   *
   * @param {database.services.Connector} connection - The database connection to use.
   * @returns {Promise<{output: *, migrations: *, batch: *}>} The migrations that ran, the current batch and the output made by Knex.
   */


  async migrate(connection) {
    this.terminalInterceptor.startCapture();
    const [batch, migrations] = await connection.migrate.latest();
    const output = this.terminalInterceptor.stopCapture();
    return {
      batch,
      migrations,
      output
    };
  }

}

var _default = MigrateCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;