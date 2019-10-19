"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _Level = _interopRequireDefault(require("./enums/Level"));

var _Logger = _interopRequireDefault(require("./services/Logger"));

var _LogTableCommand = _interopRequireDefault(require("./commands/LogTableCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Log - Log Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The log service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="log.services.Logger.html">log</a></li>
 *     <li><a href="log.enums.Level.html">log.level</a></li>
 * </ul>
 * It also offers these commands:
 * <ul>
 *     <li><a href="log.commands.LogTableCommand.html">log:table</a></li>
 * </ul>
 * It also uses configuration under "log" namespace.
 *
 * @memberof log
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class LogServiceProvider extends _ServiceProvider.default {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('log', _Logger.default);
    this.app.singleton('log.level', _Level.default);
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.loadConfig();
    this.loadCommands([_LogTableCommand.default]);
  }
  /**
   * Load configuration file.
   */


  loadConfig() {
    if (this.app.isBound('config')) {
      this.app.make('config').loadConfigFromFolder(this.app.formatPath(__dirname, '..', 'config'));
    }
  }

}

var _default = LogServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;