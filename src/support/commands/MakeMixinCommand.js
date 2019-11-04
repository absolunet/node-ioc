//--------------------------------------------------------
//-- Node IoC - Support - Command - Make Mixin
//--------------------------------------------------------

import GeneratorCommand from '../../console/GeneratorCommand';


/**
 * Command that makes a mixin scaffold inside application bootstrapper.
 *
 * @memberof support.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeMixinCommand extends GeneratorCommand {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'make:mixin';
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return 'Create a mixin class factory.';
	}

	/**
	 * @inheritdoc
	 */
	get destination() {
		return this.app.sourcePath('bootstrap', 'mixins');
	}

	/**
	 * @inheritdoc
	 */
	get files() {
		return {
			base: this.app.formatPath(__dirname, 'stubs', 'mixin.stub')
		};
	}

	/**
	 * @inheritdoc
	 */
	get parameters() {
		return [
			['name', true, null, `Mixin name.`]
		];
	}

	/**
	 * @inheritdoc
	 */
	get flags() {
		return [
			['noBootstrap', 'Indicates that the mixin should not be bootstrapped.']
		];
	}

	/**
	 * @inheritdoc
	 */
	get fileName() {
		return `${this.parameter('name')}.js`;
	}

	/**
	 * @inheritdoc
	 */
	get patterns() {
		return {
			CLASS: this.getClassName(),
			NAME:  this.getMixinName()
		};
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		this.debug(`Generating mixin file for "${this.parameter('name')}".`);
		await this.generate('base');
		this.info(`Mixin file for "${this.parameter('name')}" successfully generated!`);

		await this.bootstrapMixin();
	}

	/**
	 * Bootstrap the mixin in the application.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async bootstrapMixin() {
		if (!this.flag('noBootstrap')) {
			const fileDriver = this.app.make('file').driver();
			const mixinBootstrapperPath = this.app.sourcePath('bootstrap', ['mixins', 'index.js']);
			const importStatement = `import './${this.parameter('name')}';`;

			const mixinBootstrapper = await fileDriver.loadAsync(mixinBootstrapperPath);
			if (!mixinBootstrapper.includes(importStatement)) {
				this.debug('Adding auto-bootstrap statement.');
				await fileDriver.writeAsync(mixinBootstrapperPath, `${mixinBootstrapper}${importStatement}\n`);
				this.info('Mixin automatically bootstrapped!');
			}
		} else {
			this.info('You will have to manually bootstrap the mixin.');
		}
	}

	/**
	 * Get class name from mixin name.
	 *
	 * @returns {string} The mixin class name.
	 */
	getClassName() {
		return this.app.make('helper.string').pascal(`${this.getMixinName()}Mixin`);
	}

	/**
	 * Get mixin name.
	 *
	 * @returns {string} The mixin name.
	 */
	getMixinName() {
		return this.parameter('name').split('/').pop();
	}

}


export default MakeMixinCommand;
