"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _ConsoleServiceProvider = _interopRequireDefault(require("../../console/ConsoleServiceProvider"));

var _Kernel = _interopRequireDefault(require("../Kernel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Foundation - Console Kernel
//--------------------------------------------------------

/**
 * The console kernel that implements the needed flow for a proper CLI request handling.
 *
 * @memberof foundation.console
 * @augments foundation.Kernel
 * @hideconstructor
 */
class Kernel extends _Kernel.default {
  /**
   * ConsoleKernel constructor.
   *
   * @param {...*} parameters - Injected parameters.
   */
  constructor(...parameters) {
    super(...parameters);
    this.shouldExit();
  }
  /**
   * @inheritdoc
   */


  async handle() {
    await this.onBeforeHandling();
    await this.call(this.terminal.argv);
    await this.onAfterHandling();
  }
  /**
   * Called just before handling incoming request.
   *
   * @abstract
   */


  onBeforeHandling() {} //

  /**
   * Called just after handling incoming request, if no error was thrown.
   *
   * @abstract
   */


  onAfterHandling() {} //

  /**
   * Call the given command and process it through the command registrar.
   *
   * @param {string} command - The current command.
   * @returns {Promise} The async process promise.
   */


  async call(command) {
    await this.commandRegistrar.resolve(command);
  }
  /**
   * Specify if the kernel should exit the current process when terminating.
   *
   * @param {boolean} [shouldExit] - Indicates if the process should exit at the end.
   */


  shouldExit(shouldExit = true) {
    (0, _privateRegistry.default)(this).set('shouldExit', shouldExit);
  }
  /**
   * @inheritdoc
   */


  terminate() {
    this.onTerminating();

    if ((0, _privateRegistry.default)(this).get('shouldExit')) {
      process.exit(this.app.make('exception.handler').hadException ? 1 : 0); // eslint-disable-line unicorn/no-process-exit, no-process-exit
    }
  }
  /**
   * Called when the application is terminating.
   *
   * @abstract
   */


  onTerminating() {} //

  /**
   * CommandRegistrar accessor.
   *
   * @type {console.services.CommandRegistrar}
   */


  get commandRegistrar() {
    return this.app.make('command.registrar');
  }
  /**
   * Terminal accessor.
   *
   * @type {console.services.Terminal}
   */


  get terminal() {
    return this.app.make('terminal');
  }
  /**
   * @inheritdoc
   */


  get bootstrappers() {
    return [_ConsoleServiceProvider.default];
  }

}

var _default = Kernel;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;