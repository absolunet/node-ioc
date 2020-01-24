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
		return this.t('commands.env.description');
	}

	/**
	 * @inheritdoc
	 */
	handle() {
		this.terminal.echo(this.t('commands.env.messages.current', { name: this.app.environment }));
	}

}


export default EnvironmentCommand;
