//--------------------------------------------------------
//-- Tests - Unit - Console - Command stub
//--------------------------------------------------------
'use strict';

const Command = require('./../../../../../src/console/command/Command');

class TestCommand extends Command {

	get name() {
		return 'test:case';
	}

	options() {
		return [
			['type', true, null, 'Type of the test case']
		];
	}

	flags() {
		return [
			['verbose', 'Show debug information']
		];
	}

}

module.exports = TestCommand;
