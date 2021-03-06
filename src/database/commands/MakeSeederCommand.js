//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Seeder
//--------------------------------------------------------

import GeneratorCommand from '../../console/GeneratorCommand';


/**
 * Command that makes a seeder class file inside the database seeders folder.
 *
 * @memberof database.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeSeederCommand extends GeneratorCommand {

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
		return 'make:seeder';
	}

	/**
	 * @inheritdoc
	 */
	get files() {
		return {
			base: this.app.formatPath(__dirname, 'stubs', 'Seeder.stub')
		};
	}

	/**
	 * @inheritdoc
	 */
	get destination() {
		return this.app.make('db.resolver').resolveSourcePath('seeds');
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
		this.debug(this.t('commands.make-seeder.messages.generating', { name }));
		await this.generate('base');
		this.info(this.t('commands.make-seeder.messages.success', { name }));
	}

	/**
	 * Get guessed model name based on the class name.
	 *
	 * @returns {string} The model name.
	 */
	getModelName() {
		const regex = /^(?<model>[A-Z][A-Za-z]+)TableSeeder$/u;
		const { model = 'model' } = (regex.exec(this.parameter('class')) || {}).groups || {};

		const stringHelper = this.app.make('helper.string');

		return stringHelper.slug(stringHelper.singular(model));
	}

}


export default MakeSeederCommand;
