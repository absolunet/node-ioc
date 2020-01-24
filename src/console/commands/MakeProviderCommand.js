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
	 * Class dependencies: <code>['helper.string']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['helper.string'];
	}

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
	get patterns() {
		return {
			NAME: this.getProviderName()
		};
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		this.debug(this.t('commands.make-provider.messages.generating'));
		await this.generate('base');
		this.info(this.t('commands.make-provider.messages.success', { name: this.parameter('class') }));
	}

	/**
	 * Get provider human-readable name.
	 *
	 * @returns {string} The provider guessed name.
	 */
	getProviderName() {
		return this.stringHelper.capital(this.parameter('class').replace(/ServiceProvider$/u, ''));
	}

}


export default MakeProviderCommand;
