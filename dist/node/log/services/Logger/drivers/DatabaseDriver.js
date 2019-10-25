"use strict";

exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger - Drivers - File Driver
//--------------------------------------------------------

/**
 * Driver that logs into a database table.
 *
 * @memberof log.services.Logger.drivers
 * @augments log.services.Logger.drivers.Driver
 * @hideconstructor
 */
class DatabaseDriver extends _Driver.default {
  /**
   * Class dependencies: <code>['app', 'db', 'log.level', 'terminal']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'db', 'terminal']);
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    this.setConfig({
      connection: 'default',
      table: 'logs'
    });
  }
  /**
   * @inheritdoc
   */


  async log(level, message, context) {
    await this.storeLog(level, message, context);
    await this.cleanPastLogs();
  }
  /**
   * Store log in database.
   *
   * @param {number} level - The log level.
   * @param {string} message - The message.
   * @param {*} [context] - The context.
   * @returns {Promise} The async process promise.
   */


  async storeLog(level, message, context) {
    const {
      connection,
      config: {
        table
      }
    } = this;
    await connection(table).insert({
      level: this.getFormattedLevel(level),
      version: this.getFormattedVersion(),
      message: this.getFormattedMessage(message),
      command: this.getFormattedCommand(),
      context: this.getFormattedContext(context),
      created_at: connection.fn.now(),
      // eslint-disable-line camelcase
      updated_at: connection.fn.now() // eslint-disable-line camelcase

    });
  }
  /**
   * Clear past logs in the database, starting by the least recent ones.
   *
   * @returns {Promise} The async process promise.
   */


  async cleanPastLogs() {
    const {
      connection,
      config: {
        table,
        limit
      }
    } = this;
    const [{
      count
    }] = await connection.select().from(table).count('id as count');

    if (count > limit) {
      const results = await connection.select('id').from(table).orderBy('id').limit(count - limit);
      const [{
        id
      }] = results.reverse();
      await connection(table).delete().where('id', '<', id);
    }
  }
  /**
   * Get formatted level value.
   *
   * @param {number|string} level - The level value.
   * @returns {number} The formatted level value.
   */


  getFormattedLevel(level) {
    return typeof level === 'number' ? level : this.LEVEL[level.toUpperCase()];
  }
  /**
   * Get formatted version value.
   *
   * @returns {string} The application version.
   */


  getFormattedVersion() {
    return this.app.version;
  }
  /**
   * Get formatted message value.
   *
   * @param {string} message - The original message.
   * @returns {string} The formatted message.
   */


  getFormattedMessage(message) {
    return message.toString();
  }
  /**
   * Get formatted current command.
   *
   * @returns {string} The command.
   */


  getFormattedCommand() {
    return this.terminal.command || '';
  }
  /**
   * Get formatted context by converting it into JSON.
   *
   * @param {*} context - The context.
   * @returns {string} The formatted context.
   */


  getFormattedContext(context) {
    return JSON.stringify(typeof context === 'undefined' ? null : context);
  }
  /**
   * The connection to use based on driver configuration.
   *
   * @type {Knex}
   */


  get connection() {
    return this.db.getConnection(this.config.connection);
  }

}

var _default = DatabaseDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;