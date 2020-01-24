"use strict";

exports.default = void 0;

var _Command = _interopRequireDefault(require("../Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Command - Environment
//--------------------------------------------------------

/**
 * Command that displays the application environment.
 *
 * @memberof console.commands
 * @augments console.Command
 * @hideconstructor
 */
class EnvironmentCommand extends _Command.default {
  /**
   * @inheritdoc
   */
  get name() {
    return 'env';
  }
  /**
   * @inheritdoc
   */


  get description() {
    return this.t('commands.env.description');
  }
  /**
   * @inheritdoc
   */


  handle() {
    this.terminal.echo(this.t('commands.env.messages.current', {
      name: this.app.environment
    }));
  }

}

var _default = EnvironmentCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;