//--------------------------------------------------------
//-- Tests - Unit - Console - Command stub
//--------------------------------------------------------
'use strict';

const path             = require('path');
const GeneratorCommand = require('../../../../../dist/node/console/GeneratorCommand');


class TestMakeCommand extends GeneratorCommand {

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'test:case:make';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'This is a test generator case';
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return path.join(__dirname, 'stubs');
	}

	/**
	 * {@inheritdoc}
	 */
	get files() {
		return {
			test: path.join(__dirname, 'stubs', 'SomeClass.stub')
		};
	}

	/**
	 * {@inheritdoc}
	 */
	async handle() {
		await this.generate('test');
	}

}


module.exports = TestMakeCommand;
