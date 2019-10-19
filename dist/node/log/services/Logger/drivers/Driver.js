"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _hasEngine = _interopRequireDefault(require("../../../../support/mixins/hasEngine"));

var _NotImplementedError = _interopRequireDefault(require("../../../../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger - Drivers - Driver
//--------------------------------------------------------

/* istanbul ignore next */

/**
 * Abstract driver that defines the basic interface for a logger driver.
 *
 * @memberof log.services.Logger.drivers
 * @augments support.mixins.HasEngine
 * @abstract
 * @hideconstructor
 */
class Driver extends (0, _hasEngine.default)() {
  /**
   * Class dependencies: <code>['log.level']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['log.level']);
  }
  /**
   * Log message with context for a given level.
   *
   * @param {number} level - The log level.
   * @param {string} message - The message.
   * @param {*} [context] - The context.
   * @returns {Promise} The async process promise.
   * @async
   * @abstract
   */


  log(level, message, context) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'log', 'Promise<any>');
  }
  /**
   * Set configuration for the channel.
   *
   * @param {object} config - The driver configuration.
   * @returns {log.services.Logger.drivers.Driver} The current driver instance.
   */


  setConfig(config) {
    (0, _privateRegistry.default)(this).set('config', config);
    return this;
  }
  /**
   * Driver configuration.
   *
   * @type {object}
   */


  get config() {
    return (0, _privateRegistry.default)(this).get('config');
  }
  /**
   * Log level enum.
   *
   * @type {log.enums.Level}
   */


  get LEVEL() {
    return (0, _privateRegistry.default)(this).get('log.level');
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;