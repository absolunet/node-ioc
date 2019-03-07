//--------------------------------------------------------
//-- Tests - Unit - Console - Command stub
//--------------------------------------------------------
'use strict';


const Command = require('./../../../../../src/console/Command');


class TestCommand extends Command {

	get name() {
		return 'test:case';
	}

	get description() {
		return 'This is a test case';
	}

	handle() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 2000);
		});
	}

	get parameters() {
		return [
			['name']
		];
	}

	get flags() {
		return [
			['force', 'Force the command to run', 'f']
		];
	}

}

module.exports = TestCommand;
