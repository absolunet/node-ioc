//--------------------------------------------------------
//-- Node IoC - Console - Command - Make Provider
//--------------------------------------------------------

import GeneratorCommand from '../GeneratorCommand';


/**
 * Command that makes a service provider class file inside the application providers folder.
 *
 * @memberof console.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeProviderCommand extends GeneratorCommand {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'make:provider';
	}

	/**
	 * @inheritdoc
	 */
	get files() {
		return {
			base: this.app.formatPath(__dirname, 'stubs', 'ServiceProvider.stub')
		};
	}

	/**
	 * @inheritdoc
	 */
	get destination() {
		return this.app.sourcePath('provider', '');
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		this.debug(`Generating ${this.parameter('class')} service provider file.`);
		await this.generate('base');
		this.info(`${this.parameter('class')} service provider file successfully generated!`);
	}

}


export default MakeProviderCommand;
