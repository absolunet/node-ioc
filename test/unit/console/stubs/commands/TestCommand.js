//--------------------------------------------------------
//-- Tests - Unit - Console - Command stub
//--------------------------------------------------------
'use strict';

const Command = require('../../../../../dist/node/console/Command');


class TestCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'test:case';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'This is a test case';
	}

	/**
	 * {@inheritdoc}
	 */
	handle() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 2000);
		});
	}

	/**
	 * {@inheritdoc}
	 */
	get parameters() {
		return [
			['name']
		];
	}

	/**
	 * {@inheritdoc}
	 */
	get flags() {
		return [
			['force', 'Force the command to run', 'f']
		];
	}

}


module.exports = TestCommand;
