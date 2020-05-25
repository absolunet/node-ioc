"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
    await this.beforeHandling();
    await this.call(this.terminal.argv);
    await this.afterHandling();
  }
  /**
   * Called just before handling incoming request.
   *
   * @abstract
   */


  beforeHandling() {} //

  /**
   * Called just after handling incoming request, if no error was thrown.
   *
   * @abstract
   */


  afterHandling() {} //

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
    this.terminating();

    if ((0, _privateRegistry.default)(this).get('shouldExit')) {
      let code = 0;

      if (this.app.isBound('exception.handler')) {
        code = Number(this.app.make('exception.handler').hadException);
      }

      process.exit(code); // eslint-disable-line unicorn/no-process-exit, no-process-exit
    }
  }
  /**
   * Called when the application is terminating.
   *
   * @abstract
   */


  terminating() {} //

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