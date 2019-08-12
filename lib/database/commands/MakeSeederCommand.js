//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Seeder
//--------------------------------------------------------
'use strict';

const path             = require('path');
const GeneratorCommand = require('../../console/GeneratorCommand');


class MakeSeederCommand extends GeneratorCommand {

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
		return 'make:seeder';
	}

	/**
	 * {@inheritdoc}
	 */
	get files() {
		return {
			base: path.join(__dirname, 'stubs', 'Seeder.stub')
		};
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return path.join(process.cwd(), 'database', 'seeds');
	}

	/**
	 * {@inheritdoc}
	 */
	get patterns() {
		return {
			MODEL: this.getModelName()
		};
	}

	/**
	 * {@inheritdoc}
	 */
	async handle() {
		this.debug(`Generating ${this.parameter('class')} seed`);
		await this.generate('base');
		this.info(`${this.parameter('class')} seed successfully generated`);
	}

	/**
	 * Get guessed model name based on the class name.
	 *
	 * @returns {string}
	 */
	getModelName() {
		const regex = /^(?<model>[A-Z][A-Za-z]+)TableSeeder$/u;
		const { model = 'model' } = (regex.exec(this.parameter('class')) || {}).groups || {};

		const stringHelper = this.app.make('helper.string');

		return stringHelper.slug(stringHelper.singular(model));
	}

}


module.exports = MakeSeederCommand;
