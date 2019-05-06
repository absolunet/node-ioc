//--------------------------------------------------------
//-- Node IoC - Console - Command - List
//--------------------------------------------------------
'use strict';

const Command = require('./../Command');


class ListCommand extends Command {

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
		return this.call('--help', false);
	}

}

module.exports = ListCommand;
