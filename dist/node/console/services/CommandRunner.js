"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - Console - Services - Command Runner
//--------------------------------------------------------

/**
 * Class that is used to run a command instance through the wanted pipes.
 *
 * @memberof console.services
 * @hideconstructor
 */
class CommandRunner {
  /**
   * Class dependencies: <code>['app']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app'];
  }
  /**
   * Run command based on argv object.
   * If an exception occurs, handle it with the application exception handler.
   *
   * @param {console.Command} command - The command instance.
   * @param {object<string, string>} argv - The Yargs arguments.
   * @param {Yargs} [yargs] - The Yargs instance.
   * @returns {Promise} The async process promise.
   */


  run(command, argv, yargs) {
    return this.unsafeRun(command, argv, yargs).catch(async error => {
      if (this.app.isBound('exception.handler')) {
        await this.app.make('exception.handler').handle(error);
      }
    });
  }
  /**
   * Run command based on argv object.
   *
   * @param {console.Command} command - The command instance.
   * @param {object<string, string>} argv - The Yargs arguments.
   * @param {Yargs} [yargs] - The Yargs instance.
   * @returns {Promise} The async process promise.
   */


  async unsafeRun(command, argv, yargs) {
    if (yargs) {
      command.setYargs(yargs);
    }

    await this.runPreprocess(command, argv);
    const data = await this.runHandle(command);
    await this.runPostprocess(command, data);
  }
  /**
   * Run command preprocess.
   *
   * @param {console.Command} command - The command instance.
   * @param {object<string, string>} [argv={}] - The Yargs arguments.
   * @returns {Promise} The async process promise.
   */


  async runPreprocess(command, argv = {}) {
    const preprocessedArgv = await command.preprocess(argv);
    command.setArgv(preprocessedArgv);
  }
  /**
   * Run command handle method.
   *
   * @param {console.Command} command - The command instance.
   * @returns {Promise<*>} The async process promise with the possible returned data from the command.
   */


  runHandle(command) {
    if (command.forward) {
      return command.forwardCall(command.forward);
    }

    return command.handle();
  }
  /**
   * Run command postprocess.
   *
   * @param {console.Command} command - The command instance.
   * @param {*} [data] - The data to use when postprocessing.
   * @returns {Promise} The async process promise.
   */


  async runPostprocess(command, data) {
    await command.postprocess(data);
  }

}

var _default = CommandRunner;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;