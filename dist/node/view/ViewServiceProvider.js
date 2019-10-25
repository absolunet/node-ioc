"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _Engine = _interopRequireDefault(require("./services/Engine"));

var _Factory = _interopRequireDefault(require("./services/Factory"));

var _Resolver = _interopRequireDefault(require("./services/Resolver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - View - View Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The view service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="view.services.Factory.html">view</a></li>
 *     <li><a href="view.services.Engine.html">view.engine</a></li>
 *     <li><a href="view.services.Resolver.html">view.factory</a></li>
 * </ul>
 * It also uses configuration under "view" namespace.
 *
 * @memberof view
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class ViewServiceProvider extends _ServiceProvider.default {
  /**
   * Register the service provider.
   */
  register() {
    this.loadConfigFromFolder(__dirname, '..', 'config');
    this.bindViewFactory();
    this.bindViewEngine();
    this.bindViewResolver();
  }
  /**
   * Bind view factory service.
   */


  bindViewFactory() {
    this.app.singleton('view', _Factory.default);
  }
  /**
   * Bind view engine.
   */


  bindViewEngine() {
    this.app.singleton('view.engine', _Engine.default);
  }
  /**
   * Bind view path resolver service.
   */


  bindViewResolver() {
    this.app.singleton('view.resolver', _Resolver.default);
  }

}

var _default = ViewServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;