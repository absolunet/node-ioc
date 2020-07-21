"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hasDriver = _interopRequireDefault(require("../../../support/mixins/hasDriver"));

var _ConnectorProxy = _interopRequireDefault(require("./ConnectorProxy"));

var _SqliteDriver = _interopRequireDefault(require("./drivers/SqliteDriver"));

var _MySQLDriver = _interopRequireDefault(require("./drivers/MySQLDriver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector
//--------------------------------------------------------

/**
 * Connector that decorates a Knex connection through a driver.
 *
 * @memberof database.services
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Connector extends (0, _hasDriver.default)() {
  /**
   * Connector constructor.
   *
   * @param {...*} parameters - The injected parameters.
   * @returns {database.services.Connector} A connector instance wrapped by a forward proxy.
   */
  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new _ConnectorProxy.default());
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    super.init();
    this.addDriver('sqlite', _SqliteDriver.default);
    this.addDriver('mysql', _MySQLDriver.default);
  }

}

var _default = Connector;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;