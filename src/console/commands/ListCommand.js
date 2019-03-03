//--------------------------------------------------------
//-- Node IoC - Console - Command - List
//--------------------------------------------------------
'use strict';


const Command = require('./../Command');


class ListCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'list';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'List all available commands';
	}

	/**
	 * {@inheritdoc}
	 */
	handle() {
		this.call('--help');
	}

}

module.exports = ListCommand;
