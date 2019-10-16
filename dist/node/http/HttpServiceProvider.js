"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _Client = _interopRequireDefault(require("./services/Client"));

var _Server = _interopRequireDefault(require("./services/Server"));

var _Handler = _interopRequireDefault(require("./services/Handler"));

var _Router = _interopRequireDefault(require("./services/Router"));

var _RouteRepository = _interopRequireDefault(require("./repositories/RouteRepository"));

var _ControllerRepository = _interopRequireDefault(require("./repositories/ControllerRepository"));

var _RedirectController = _interopRequireDefault(require("./controllers/RedirectController"));

var _StaticController = _interopRequireDefault(require("./controllers/StaticController"));

var _MakeControllerCommand = _interopRequireDefault(require("./commands/MakeControllerCommand"));

var _ServeCommand = _interopRequireDefault(require("./commands/ServeCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - HTTP Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The HTTP service provider.
 * It bind these following services:
 * <ul>
 *     <li><a href="http.services.Client.html">http</a></li>
 *     <li><a href="http.services.Server.html">server</a></li>
 *     <li><a href="http.services.Router.html">router</a></li>
 *     <li><a href="http.services.Handler.html">router.handler</a></li>
 *     <li><a href="http.repositories.RouteRepository.html">router.route</a></li>
 *     <li><a href="http.repositories.ControllerRepository.html">route.controller</a></li>
 * </ul>
 * It also offers these commands:
 * <ul>
 *     <li><a href="http.commands.MakeControllerCommand.html">make:controller</a></li>
 *     <li><a href="http.commands.ServeCommand.html">serve</a></li>
 * </ul>
 * It also uses configuration under "http" namespace.
 *
 * @memberof http
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class HttpServiceProvider extends _ServiceProvider.default {
  /**
   * Register the service provider.
   */
  register() {
    this.registerServices();
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.loadConfig();
    this.createPolicies();
    this.bootDefaultControllers();
    this.loadCommands([_MakeControllerCommand.default, _ServeCommand.default]);
  }
  /**
   * Register HTTP services.
   */


  registerServices() {
    this.app.singleton('http', _Client.default);
    this.app.singleton('server', _Server.default);
    this.app.singleton('router', _Router.default);
    this.app.singleton('router.handler', _Handler.default);
    this.app.singleton('router.route', _RouteRepository.default);
    this.app.singleton('router.controller', _ControllerRepository.default);
  }
  /**
   * Load configuration file.
   */


  loadConfig() {
    if (this.app.isBound('config')) {
      this.app.make('config').loadConfigFromFolder(this.app.formatPath(__dirname, '..', 'config'));
    }
  }
  /**
   * Create database related policies.
   */


  createPolicies() {
    if (this.app.isBound('gate')) {
      this.app.make('gate').policy('http', () => {
        return this.app.make('config').get('http.enabled', false);
      });
    }
  }
  /**
   * Boot the default controllers.
   */


  bootDefaultControllers() {
    const controllerRepository = this.app.make('router.controller');
    controllerRepository.group(controllerRepository.coreNamespace, () => {
      controllerRepository.add('StaticController', _StaticController.default);
      controllerRepository.add('RedirectController', _RedirectController.default);
    });
  }

}

var _default = HttpServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;