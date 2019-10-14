//--------------------------------------------------------
//-- Node IoC - Console - Command - Environment
//--------------------------------------------------------
'use strict';

const Command = require('../Command');
/**
 * Command that displays the application environment.
 *
 * @memberof console.commands
 * @augments console.Command
 * @hideconstructor
 */


class EnvironmentCommand extends Command {
  /**
   * @inheritdoc
   */
  get policies() {
    return ['public'];
  }
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
    return 'Display the application environment.';
  }
  /**
   * @inheritdoc
   */


  handle() {
    this.terminal.echo(`Current application environment: "${this.app.environment}"`);
  }

}

module.exports = EnvironmentCommand;