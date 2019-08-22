//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Factory
//--------------------------------------------------------
'use strict';

const path             = require('path');
const GeneratorCommand = require('../../console/GeneratorCommand');


class MakeFactoryCommand extends GeneratorCommand {

	/**
	 * {@inheritdoc}
	 */
	get policies() {
		return ['db', 'env:local'];
	}

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'make:factory';
	}

	/**
	 * {@inheritdoc}
	 */
	get files() {
		return {
			base: path.join(__dirname, 'stubs', 'Factory.stub')
		};
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return this.app.make('db.resolver').resolvePath('factories');
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
		this.debug(`Generating ${this.parameter('class')} model factory`);
		await this.generate('base');
		this.info(`${this.parameter('class')} model factory successfully generated`);
	}

	/**
	 * Get guessed model name based on the class name.
	 *
	 * @returns {string}
	 */
	getModelName() {
		const regex = /^(?<model>[A-Z][A-Za-z]+)Factory$/u;
		const { model = 'model' } = (regex.exec(this.parameter('class')) || {}).groups || {};

		return this.app.make('helper.string').slug(model);
	}

}


module.exports = MakeFactoryCommand;