//--------------------------------------------------------
//-- Node IoC - Console - Command - List
//--------------------------------------------------------
'use strict';

const path = require('path');

const GeneratorCommand = require('../GeneratorCommand');


class ListCommand extends GeneratorCommand {

	get policies() {
		return ['env:local'];
	}

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'make:command';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Create a command class';
	}

	/**
	 * {@inheritdoc}
	 */
	get files() {
		return {
			'base':      path.join(__dirname, 'stubs', 'BaseCommand.stub'),
			'public':    path.join(__dirname, 'stubs', 'PublicCommand.stub'),
			'generator': path.join(__dirname, 'stubs', 'GeneratorCommand.stub')
		};
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return path.join(process.cwd(), 'lib', 'commands');
	}

	/**
	 * {@inheritdoc}
	 */
	handle() {
		const type = this.flag('generator') ? 'generator' : this.flag('public') ? 'public' : 'base';
		this.debug(`Generating ${type} command`);
		this.generate(type);
		this.info(`Command ${this.parameter('class')} successfully generated`);
	}

	/**
	 * {@inheritdoc}
	 */
	get flags() {
		return [
			['generator', 'Create generator command'],
			['public',    'Create public command']
		];
	}

}


module.exports = ListCommand;
