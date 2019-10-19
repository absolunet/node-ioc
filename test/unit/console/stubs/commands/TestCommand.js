//--------------------------------------------------------
//-- Tests - Unit - Console - Command stub
//--------------------------------------------------------

import Command from '../../../../../dist/node/console/Command';


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


export default TestCommand;
