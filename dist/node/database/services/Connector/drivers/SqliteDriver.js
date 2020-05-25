"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Connector - Sqlite Driver
//--------------------------------------------------------

/**
 * SQLite connector driver.
 *
 * @memberof database.services.Connector.drivers
 * @augments database.services.Connector.drivers.Driver
 * @hideconstructor
 */
class SqliteDriver extends _Driver.default {
  /**
   * @inheritdoc
   */
  get client() {
    return 'sqlite3';
  }
  /**
   * @inheritdoc
   */


  mapConfig(config) {
    const data = super.mapConfig(config);
    return { ...data,
      useNullAsDefault: true,
      connection: { ...data.connection,
        filename: config.filename
      }
    };
  }
  /**
   * @inheritdoc
   */


  async dropAll(connection, options = {}) {
    await super.dropAll(connection, { ...options,
      ignoreTables: [...(options.ignoreTables || []), 'sqlite_master', 'sqlite_sequence']
    });
  }

}

var _default = SqliteDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;