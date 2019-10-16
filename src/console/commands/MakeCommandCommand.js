//--------------------------------------------------------
//-- Node IoC - Console - Command - Make Command
//--------------------------------------------------------

import GeneratorCommand from '../GeneratorCommand';


/**
 * Command that makes a command class file inside the application commands folder.
 *
 * @memberof console.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeCommandCommand extends GeneratorCommand {

	/**
	 * @inheritdoc
	 */
	get policies() {
		return ['env:local'];
	}

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'make:command';
	}

	/**
	 * @inheritdoc
	 */
	get files() {
		return {
			'base':      this.app.formatPath(__dirname, 'stubs', 'BaseCommand.stub'),
			'private':   this.app.formatPath(__dirname, 'stubs', 'PrivateCommand.stub'),
			'generator': this.app.formatPath(__dirname, 'stubs', 'GeneratorCommand.stub')
		};
	}

	/**
	 * @inheritdoc
	 */
	get destination() {
		return this.app.sourcePath('command', '');
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		const type = this.flag('generator') ? 'generator' : this.flag('private') ? 'private' : 'base'; // eslint-disable-line unicorn/no-nested-ternary
		this.debug(`Generating ${type} command file.`);
		await this.generate(type);
		this.info(`Command ${this.parameter('class')} file successfully generated!`);
	}

	/**
	 * @inheritdoc
	 */
	get flags() {
		return [
			['generator', 'Generate a generator command class.'],
			['private',   'Generate a private command class.']
		];
	}

}


export default MakeCommandCommand;
