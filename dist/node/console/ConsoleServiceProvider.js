"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _CommandRepository = _interopRequireDefault(require("./repositories/CommandRepository"));

var _CommandRegistrar = _interopRequireDefault(require("./services/CommandRegistrar"));

var _CommandRunner = _interopRequireDefault(require("./services/CommandRunner"));

var _Terminal = _interopRequireDefault(require("./services/Terminal"));

var _Interceptor = _interopRequireDefault(require("./services/Interceptor"));

var _YargsEngine = _interopRequireDefault(require("./services/YargsEngine"));

var _CaptureInterceptor = _interopRequireDefault(require("./interceptors/CaptureInterceptor"));

var _EnvironmentCommand = _interopRequireDefault(require("./commands/EnvironmentCommand"));

var _ListCommand = _interopRequireDefault(require("./commands/ListCommand"));

var _MakeCommandCommand = _interopRequireDefault(require("./commands/MakeCommandCommand"));

var _MakeProviderCommand = _interopRequireDefault(require("./commands/MakeProviderCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Console Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The console service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="console.repositories.CommandRepository.html">command</a></li>
 *     <li><a href="console.services.CommandRegistrar.html">command.registrar</a></li>
 *     <li><a href="console.services.CommandRunner.html">command.runner</a></li>
 *     <li><a href="console.services.Terminal.html">terminal</a></li>
 *     <li><a href="console.services.Interceptor.html">terminal.interceptor</a></li>
 *     <li><a href="console.interceptors.CaptureInterceptor.html">terminal.interceptor.capture</a></li>
 *     <li><a href="console.services.YargsEngine.html">yargs</a></li>
 * </ul>
 * It also offers these commands:
 * <ul>
 *     <li><a href="console.commands.EnvironmentCommand.html">env</a></li>
 *     <li><a href="console.commands.ListCommand.html">list</a></li>
 *     <li><a href="console.commands.MakeCommandCommand.html">make:command</a></li>
 *     <li><a href="console.commands.MakeProviderCommand.html">make:provider</a></li>
 * </ul>
 *
 * @memberof console
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class ConsoleServiceProvider extends _ServiceProvider.default {
  /**
   * @inheritdoc
   */
  get name() {
    return 'Node IoC - Console';
  }
  /**
   * Register the service provider.
   */


  register() {
    this.loadAndPublishTranslations(this.app.formatPath(__dirname, 'lang'));
    this.bindCommandRepository();
    this.bindCommandRegistrar();
    this.bindCommandRunner();
    this.bindTerminal();
    this.bindInterceptorService();
    this.bindCaptureInterceptor();
    this.bindYargsEngine();
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.setDefaultCommand();
    this.enableInterceptor();
    this.loadCommands([_EnvironmentCommand.default, _ListCommand.default, _MakeCommandCommand.default, _MakeProviderCommand.default]);
  }
  /**
   * Bind command repository.
   */


  bindCommandRepository() {
    this.app.singleton('command', _CommandRepository.default);
  }
  /**
   * Bind command registrar.
   */


  bindCommandRegistrar() {
    this.app.singleton('command.registrar', _CommandRegistrar.default);
  }
  /**
   * Bind command runner.
   */


  bindCommandRunner() {
    this.app.singleton('command.runner', _CommandRunner.default);
  }
  /**
   * Bind terminal service.
   */


  bindTerminal() {
    this.app.singleton('terminal', _Terminal.default);
  }
  /**
   * Bind interceptor service.
   */


  bindInterceptorService() {
    this.app.singleton('terminal.interceptor', _Interceptor.default);
  }
  /**
   * Bind capture interceptor.
   */


  bindCaptureInterceptor() {
    this.app.singleton('terminal.interceptor.capture', _CaptureInterceptor.default);
  }
  /**
   * Bind Yargs service.
   */


  bindYargsEngine() {
    this.app.singleton('yargs', _YargsEngine.default);
  }
  /**
   * Set default command into the command registrar.
   */


  setDefaultCommand() {
    this.app.make('command.registrar').setDefault(_ListCommand.default);
  }
  /**
   * Enable interceptor service.
   */


  enableInterceptor() {
    this.app.make('terminal.interceptor').enable();
  }

}

var _default = ConsoleServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;