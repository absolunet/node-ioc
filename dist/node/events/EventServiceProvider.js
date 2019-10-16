"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _Dispatcher = _interopRequireDefault(require("./services/Dispatcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Events - Event Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The event service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="events.services.Dispatcher.html">event</a></li>
 * </ul>
 * It also uses configuration under "event" namespace.
 *
 * @memberof events
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class EventServiceProvider extends _ServiceProvider.default {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('event', _Dispatcher.default);
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.loadConfig();
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

var _default = EventServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;