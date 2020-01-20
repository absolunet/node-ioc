//--------------------------------------------------------
//-- Node IoC - Security - Command - Make Policy
//--------------------------------------------------------

import GeneratorCommand from '../../console/GeneratorCommand';


/**
 * Command that makes a policy class file inside the application policies folder.
 *
 * @memberof console.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakePolicyCommand extends GeneratorCommand {

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
		return 'make:policy';
	}

	/**
	 * @inheritdoc
	 */
	get files() {
		return {
			base: this.app.formatPath(__dirname, 'stubs', 'Policy.stub')
		};
	}

	/**
	 * @inheritdoc
	 */
	get destination() {
		return this.app.sourcePath('policy', '');
	}

	/**
	 * @inheritdoc
	 */
	get patterns() {
		return {
			NAME: this.getPolicyName()
		};
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		this.debug(`Generating ${this.parameter('class')} policy file.`);
		await this.generate('base');
		this.info(`${this.parameter('class')} policy file successfully generated!`);
	}

	/**
	 * Get policy guessed name.
	 *
	 * @returns {string} The policy guessed name.
	 */
	getPolicyName() {
		return this.stringHelper.dot(this.parameter('class').replace(/Policy$/u, ''));
	}

	/**
	 * String helper.
	 *
	 * @type {ioc.support.helpers.StringHelper}
	 */
	get stringHelper() {
		return this.helperString;
	}

}


export default MakePolicyCommand;
