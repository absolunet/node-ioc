"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _ConfigRepository = _interopRequireDefault(require("./repositories/ConfigRepository"));

var _ConfigGrammar = _interopRequireDefault(require("./services/ConfigGrammar"));

var _EnvironmentRepository = _interopRequireDefault(require("./repositories/EnvironmentRepository"));

var _Evaluator = _interopRequireDefault(require("./services/Evaluator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The config service provider.
 * It binds the following services:
 *	<ul>
 *	   <li><a href="config.repositories.ConfigRepository.html">config</a></li>
 *	   <li><a href="config.repositories.EnvironmentRepository.html">env</a></li>
 *	   <li><a href="config.services.ConfigGrammar.html">config.grammar</a></li>
 *	   <li><a href="config.services.Evaluator.html">evaluator</a></li>
 * </ul>
 * Also, during register phase, it reads the "app.providers" configuration to register all listed service providers into the application.
 *
 * @memberof config
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class ConfigServiceProvider extends _ServiceProvider.default {
  /**
   * @inheritdoc
   */
  get name() {
    return 'Node IoC - Config';
  }
  /**
   * Register the service provider.
   */


  register() {
    this.bindConfigGrammar();
    this.bindEvaluator();
    this.bindConfigRepository();
    this.bindEnvironmentRepository();
    this.registerConfiguredProviders();
  }
  /**
   * Bind config grammar service.
   */


  bindConfigGrammar() {
    this.app.singleton('config.grammar', _ConfigGrammar.default);
  }
  /**
   * Bind evaluator service.
   */


  bindEvaluator() {
    this.app.singleton('evaluator', _Evaluator.default);
  }
  /**
   * Bind configuration repository.
   */


  bindConfigRepository() {
    this.app.singleton('config', _ConfigRepository.default);
  }
  /**
   * Bind environment repository.
   */


  bindEnvironmentRepository() {
    this.app.singleton('env', _EnvironmentRepository.default);
  }
  /**
   * Register service providers from configuration file.
   */


  registerConfiguredProviders() {
    this.app.make('config').get('app.providers', []).forEach(provider => {
      this.app.register(provider);
    });
  }

}

var _default = ConfigServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;