//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Factory
//--------------------------------------------------------

import GeneratorCommand from '../../console/GeneratorCommand';


/**
 * Command that makes a model factory class file inside the database factories folder.
 *
 * @memberof database.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeFactoryCommand extends GeneratorCommand {

	/**
	 * @inheritdoc
	 */
	get policies() {
		return (super.policies || []).concat(['db']);
	}

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'make:factory';
	}

	/**
	 * @inheritdoc
	 */
	get files() {
		return {
			base: this.app.formatPath(__dirname, 'stubs', 'Factory.stub')
		};
	}

	/**
	 * @inheritdoc
	 */
	get destination() {
		return this.app.make('db.resolver').resolveSourcePath('factories');
	}

	/**
	 * @inheritdoc
	 */
	get patterns() {
		return {
			MODEL: this.getModelName()
		};
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		const name = this.parameter('class');
		this.debug(this.t('commands.make-factory.messages.generating', { name }));
		await this.generate('base');
		this.info(this.t('commands.make-factory.messages.success', { name }));
	}

	/**
	 * Get guessed model name based on the class name.
	 *
	 * @returns {string} The model name.
	 */
	getModelName() {
		const regex = /^(?<model>[A-Z][A-Za-z]+)Factory$/u;
		const { model = 'model' } = (regex.exec(this.parameter('class')) || {}).groups || {};

		return this.app.make('helper.string').slug(model);
	}

}


export default MakeFactoryCommand;
