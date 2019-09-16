//--------------------------------------------------------
//-- Node IoC - Console - Command - List
//--------------------------------------------------------
'use strict';

const GeneratorCommand = require('../GeneratorCommand');


class MakeCommandCommand extends GeneratorCommand {

	/**
	 * {@inheritdoc}
	 */
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
	get files() {
		return {
			'base':      this.app.formatPath(__dirname, 'stubs', 'BaseCommand.stub'),
			'public':    this.app.formatPath(__dirname, 'stubs', 'PublicCommand.stub'),
			'generator': this.app.formatPath(__dirname, 'stubs', 'GeneratorCommand.stub')
		};
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return this.app.commandPath();
	}

	/**
	 * {@inheritdoc}
	 */
	async handle() {
		const type = this.flag('generator') ? 'generator' : this.flag('public') ? 'public' : 'base';
		this.debug(`Generating ${type} command`);
		await this.generate(type);
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


module.exports = MakeCommandCommand;
