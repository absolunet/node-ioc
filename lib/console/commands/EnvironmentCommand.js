//--------------------------------------------------------
//-- Node IoC - Console - Command - Environment
//--------------------------------------------------------
'use strict';

const Command = require('../Command');


class EnvironmentCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	get policies() {
		return ['public'];
	}

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'env';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Display the application environment';
	}

	/**
	 * {@inheritdoc}
	 */
	handle() {
		this.terminal.echo(`Current application environment: "${this.app.environment}"`);
	}

}

module.exports = EnvironmentCommand;
