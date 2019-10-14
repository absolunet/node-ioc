//--------------------------------------------------------
//-- Node IoC - Database - Command - Migrate Rollback
//--------------------------------------------------------
'use strict';

const Command = require('../../console/Command');
/**
 * Command that rollbacks the last database migrations.
 *
 * @memberof database.commands
 * @augments console.Command
 * @hideconstructor
 */


class MigrateRollbackCommand extends Command {
  /**
   * Class dependencies.
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
    return `${this.prefix}:migrate:rollback`;
  }
  /**
   * @inheritdoc
   */


  get description() {
    return 'Rollback the last database migrations.';
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
    this.info('Rolling back last migration batch');
    const {
      batch,
      migrations,
      output
    } = await this.rollback(connection);
    output.forEach(string => {
      this.warning(string);
    });

    if (migrations.length === 0) {
      this.info('No migration rollback to run');
    } else {
      this.info(`Migration #${batch} rollback successful!`);
      migrations.forEach(migration => {
        this.success(`Rolled back: ${migration}`);
      });
    }
  }
  /**
   * Rollback the database migrations.
   *
   * @param {Connector} connection - The database connection to use.
   * @returns {Promise<{output: *, migrations: *, batch: *}>} - The migrations that ran, the current batch and the output made by Knex.
   */


  async rollback(connection) {
    this.terminalInterceptor.startCapture();
    const [batch, migrations] = await connection.migrate.rollback();
    const output = this.terminalInterceptor.stopCapture();
    return {
      batch,
      migrations,
      output
    };
  }

}

module.exports = MigrateRollbackCommand;