"use strict";

exports.default = void 0;

var _Command = _interopRequireDefault(require("../../console/Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Command - Seed
//--------------------------------------------------------

/**
 * Class that seeds the database with records.
 *
 * @memberof database.commands
 * @augments console.Command
 * @hideconstructor
 */
class SeedCommand extends _Command.default {
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
    return `${this.prefix}:seed`;
  }
  /**
   * @inheritdoc
   */


  get description() {
    return 'Seed the database with records.';
  }
  /**
   * @inheritdoc
   */


  get options() {
    return [['file', 'DatabaseSeeder', 'The file to run']];
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


  async handle() {
    const connection = await this.db.getConnection();
    this.info('Seeding database');
    const {
      seeds,
      output
    } = await this.seed(connection);
    output.forEach(string => {
      this.warning(string);
    });
    this.info('Seed successful!');
    seeds.forEach(seed => {
      this.success(`Seeded: ${seed.replace('\\', '/').split('/').pop()}`);
    });
  }
  /**
   * Seed the database.
   *
   * @param {database.services.Connector} connection - The database connection to use.
   * @returns {Promise<{output: *, seeds: *}>} The seeders that ran and the output made by Knex.
   */


  async seed(connection) {
    this.terminalInterceptor.startCapture();
    const specific = `${this.option('file').replace(/\.js$/u, '')}.js`;
    const [seeds] = await connection.seed.run({
      specific
    });
    const output = this.terminalInterceptor.stopCapture();
    return {
      seeds,
      output
    };
  }

}

var _default = SeedCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;