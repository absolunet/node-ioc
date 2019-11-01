//--------------------------------------------------------
//-- Node IoC - Console - Command - Environment
//--------------------------------------------------------

import Command from '../Command';


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


export default EnvironmentCommand;
